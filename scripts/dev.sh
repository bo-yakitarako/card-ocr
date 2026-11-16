#!/usr/bin/env bash
# devサーバーのデーモン制御スクリプト。
# エージェントがバックグラウンドでdevサーバーを立てる場合は `pnpm dev` ではなく
# 必ずこのスクリプト経由にすること（PID・ログを一元管理し、確実に停止できるようにするため）。
#
# 使い方:
#   scripts/dev.sh start    起動（URLが出るまで待ってから報告）
#   scripts/dev.sh stop     停止（プロセスグループごと終了。無管理起動の残骸も掃除）
#   scripts/dev.sh restart  再起動
#   scripts/dev.sh status   状態確認（このリポジトリの野良devプロセスがあれば警告）
#   scripts/dev.sh logs     ログをtail -fで表示
#   scripts/dev.sh toggle   起動中なら停止、停止中なら起動（引数なしでも同じ）

set -euo pipefail
cd "$(dirname "$0")/.."

PID_FILE=".dev-server.pid"
LOG_FILE=".dev-server.log"
REPO_ROOT=$(pwd -P)

is_running() {
  [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null
}

# 起動ログからViteが出力したURLを拾う（ポートは空きに応じて変わり得る）
detect_url() {
  grep -oE 'localhost:[0-9]+' "$LOG_FILE" 2>/dev/null | tail -1
}

# このリポジトリをcwdに持つdev系プロセス（vite/vpのdev）を列挙する。
# pidfile管理外の無管理起動の残骸も検出できるように /proc を走査する。
find_dev_pids() {
  local proc_cwd pid target
  for proc_cwd in /proc/[0-9]*/cwd; do
    pid=${proc_cwd%/cwd}
    pid=${pid#/proc/}
    [[ "$pid" == "$$" ]] && continue
    target=$(readlink "$proc_cwd" 2>/dev/null) || continue
    [[ "$target" == "$REPO_ROOT" ]] || continue
    if tr '\0' ' ' <"/proc/$pid/cmdline" 2>/dev/null | grep -qE '(^|/)vite(\.js)?[[:space:]]+dev|(^|/)vp[[:space:]]+dev'; then
      echo "$pid"
    fi
  done
}

# 指定pidの子孫pidを全て列挙する（pstree非依存、pgrep -Pの再帰）
descendants_of() {
  local child
  for child in $(pgrep -P "$1" 2>/dev/null || true); do
    echo "$child"
    descendants_of "$child"
  done
}

cmd_start() {
  if is_running; then
    echo "already running (pid $(cat "$PID_FILE"), http://$(detect_url)/)"
    exit 0
  fi
  : >"$LOG_FILE"
  # setsidで新セッション化し、親シェル終了・プロセスグループkillの影響を受けないようにする。
  # 子孫（pnpm→vp→vite/workerd）はこのpidをpgidとするグループにまとまる。
  setsid nohup pnpm dev >>"$LOG_FILE" 2>&1 </dev/null &
  echo $! >"$PID_FILE"

  for _ in $(seq 1 40); do
    if ! is_running; then
      echo "dev server exited early; see $LOG_FILE" >&2
      tail -20 "$LOG_FILE" >&2
      rm -f "$PID_FILE"
      exit 1
    fi
    if url=$(detect_url) && [[ -n "$url" ]]; then
      echo "up: http://$url/ (pid $(cat "$PID_FILE"), log: $LOG_FILE)"
      exit 0
    fi
    sleep 0.5
  done
  echo "started (pid $(cat "$PID_FILE")) but URL not detected yet; see $LOG_FILE"
}

cmd_stop() {
  local stopped=0 pid orphans
  if is_running; then
    pid=$(cat "$PID_FILE")
    # プロセスグループごと停止（setsidしたのでpid=pgid）。失敗時は単体killにフォールバック。
    kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    for _ in $(seq 1 20); do
      is_running || break
      sleep 0.25
    done
    if is_running; then
      kill -9 -- "-$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
    fi
    # 子が別pgidで立っている場合に備え、子孫ツリーも明示的に畳む
    local tree tpid
    tree=$(descendants_of "$pid")
    while IFS= read -r tpid; do
      [[ "$tpid" == "$pid" ]] || kill "$tpid" 2>/dev/null || true
    done <<<"$tree"
    stopped=1
  fi
  rm -f "$PID_FILE"

  # pidfile管理外の残骸（直接 `pnpm dev` されたもの等）もこのリポジトリ限定で掃除する
  orphans=$(find_dev_pids || true)
  if [[ -n "$orphans" ]]; then
    while IFS= read -r opid; do
      kill "$opid" 2>/dev/null && echo "killed orphan dev process (pid $opid)"
    done <<<"$orphans"
    stopped=1
  fi

  if [[ $stopped -eq 1 ]]; then
    echo "stopped"
  else
    echo "not running"
  fi
}

cmd_status() {
  local orphans
  orphans=$(find_dev_pids || true)
  if is_running; then
    local url
    url=$(detect_url || true)
    echo "running (pid $(cat "$PID_FILE")${url:+, http://$url/})"
    # 管理プロセス自身＋その子孫以外のdevプロセスだけを「野良」として警告
    # （vp→viteは子を別pgidで立てることがあるためpgid比較ではなく子孫判定にする）
    local managed_tree extra opid
    managed_tree=$(descendants_of "$(cat "$PID_FILE")")
    extra=""
    while IFS= read -r opid; do
      grep -qxF "$opid" <<<"$managed_tree" || extra="$extra $opid"
    done <<<"$orphans"
    [[ -n "${extra// /}" ]] && echo "warn: unmanaged dev processes also running:${extra}" >&2
  elif [[ -n "$orphans" ]]; then
    echo "not running (but unmanaged dev processes found: $(echo "$orphans" | tr '\n' ' ') — 'stop' will clean them)" >&2
    exit 1
  else
    echo "not running"
    exit 1
  fi
}

case "${1:-toggle}" in
  start) cmd_start ;;
  stop) cmd_stop ;;
  restart) cmd_stop && cmd_start ;;
  toggle) if is_running; then cmd_stop; else cmd_start; fi ;;
  status) cmd_status ;;
  logs) tail -f "$LOG_FILE" ;;
  *)
    echo "usage: $0 {start|stop|restart|status|logs|toggle}" >&2
    exit 64
    ;;
esac

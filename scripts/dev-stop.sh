#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$ROOT_DIR/.dev-server.pid"

if [[ ! -f "$PID_FILE" ]]; then
  echo "dev server is not running (no pid file)"
  exit 0
fi

pid="$(cat "$PID_FILE")"

if kill -0 "$pid" 2>/dev/null; then
  kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
  for _ in $(seq 1 50); do
    kill -0 "$pid" 2>/dev/null || break
    sleep 0.1
  done
  if kill -0 "$pid" 2>/dev/null; then
    kill -9 -- "-$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
  fi
  echo "dev server stopped (pid $pid)"
else
  echo "dev server was not running (stale pid $pid)"
fi

rm -f "$PID_FILE"

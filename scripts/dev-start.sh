#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$ROOT_DIR/.dev-server.pid"
LOG_FILE="$ROOT_DIR/.dev-server.log"

cd "$ROOT_DIR"

if [[ -f "$PID_FILE" ]] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "dev server is already running (pid $(cat "$PID_FILE"))"
  exit 0
fi

setsid mise exec -- bun run dev >"$LOG_FILE" 2>&1 &
pid=$!
echo "$pid" >"$PID_FILE"

for _ in $(seq 1 50); do
  if curl -sf -o /dev/null http://localhost:3000/; then
    echo "dev server started (pid $pid) -> http://localhost:3000"
    echo "log: $LOG_FILE"
    exit 0
  fi
  if ! kill -0 "$pid" 2>/dev/null; then
    echo "dev server failed to start. log:"
    cat "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
  sleep 0.1
done

echo "dev server started but not responding yet (pid $pid) -> http://localhost:3000"
echo "log: $LOG_FILE"

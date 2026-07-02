#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LOG_DIR="${E2E_LOG_DIR:-$ROOT_DIR/e2e-logs}"
RUN_NAME="${RUN_NAME:-e2e}"
E2E_API_PORT="${E2E_API_PORT:-3001}"
E2E_WEB_PORT="${E2E_WEB_PORT:-8080}"

mkdir -p "$LOG_DIR"

API_LOG="$LOG_DIR/api-$RUN_NAME.log"
WEB_LOG="$LOG_DIR/web-$RUN_NAME.log"
API_PID_FILE="$LOG_DIR/api-$RUN_NAME.pid"
WEB_PID_FILE="$LOG_DIR/web-$RUN_NAME.pid"

start_app() {
	local pid_file="$1"
	local log_file="$2"

	if command -v setsid >/dev/null 2>&1; then
		setsid npm run start > "$log_file" 2>&1 &
	else
		npm run start > "$log_file" 2>&1 &
	fi

	echo "$!" > "$pid_file"
}

wait_for_url() {
	local url="$1"
	local name="$2"
	local pid_file="$3"
	local log_file="$4"

	for _ in {1..60}; do
		if curl --silent --fail --output /dev/null "$url"; then
			return 0
		fi

		if [ -f "$pid_file" ] && ! kill -0 "$(cat "$pid_file")" 2>/dev/null; then
			echo "$name exited before it responded at $url"
			tail -200 "$log_file" || true
			return 1
		fi

		sleep 2
	done

	echo "$name did not respond at $url"
	tail -200 "$log_file" || true
	return 1
}

cd "$ROOT_DIR/apps/api"
start_app "$API_PID_FILE" "$API_LOG"

wait_for_url "http://localhost:$E2E_API_PORT/health" "API" "$API_PID_FILE" "$API_LOG"

cd "$ROOT_DIR/apps/web"
start_app "$WEB_PID_FILE" "$WEB_LOG"

wait_for_url "http://localhost:$E2E_WEB_PORT/" "Web app" "$WEB_PID_FILE" "$WEB_LOG"

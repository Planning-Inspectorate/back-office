#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LOG_DIR="${E2E_LOG_DIR:-$ROOT_DIR/e2e-logs}"
RUN_NAME="${RUN_NAME:-e2e}"

stop_from_pid_file() {
	local pid_file="$1"

	if [ ! -f "$pid_file" ]; then
		return 0
	fi

	local pid
	pid="$(cat "$pid_file")"

	if [ -n "$pid" ]; then
		kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true

		for _ in {1..10}; do
			if ! kill -0 "$pid" 2>/dev/null; then
				break
			fi
			sleep 1
		done

		kill -9 -- "-$pid" 2>/dev/null || kill -9 "$pid" 2>/dev/null || true
	fi

	rm -f "$pid_file"
}

stop_from_pid_file "$LOG_DIR/web-$RUN_NAME.pid"
stop_from_pid_file "$LOG_DIR/api-$RUN_NAME.pid"

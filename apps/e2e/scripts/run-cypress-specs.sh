#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
LOG_DIR="${E2E_LOG_DIR:-$ROOT_DIR/e2e-logs}"
RUN_NAME="${RUN_NAME:-e2e}"
SHARD_INDEX="${SHARD_INDEX:-0}"
SHARD_COUNT="${SHARD_COUNT:-0}"
CYPRESS_BROWSER="${CYPRESS_BROWSER:-chrome}"
E2E_WEB_PORT="${E2E_WEB_PORT:-8080}"
STATIC_FEATURE_FLAG_OVERRIDES="${STATIC_FEATURE_FLAG_OVERRIDES:-applics-1036-training-sector=true}"

mkdir -p "$LOG_DIR" "$ROOT_DIR/apps/e2e/cypress/screenshots"

resolve_specs() {
	if [ -n "${CYPRESS_SPEC:-}" ]; then
		echo "$CYPRESS_SPEC"
		return 0
	fi

	if [ "$SHARD_INDEX" = "0" ] || [ "$SHARD_COUNT" = "0" ]; then
		echo "cypress/e2e/back-office-applications/smokeTests.spec.js"
		return 0
	fi

	find "$ROOT_DIR/apps/e2e/cypress/e2e/back-office-applications" -type f -name '*.spec.js' |
		sed "s#^$ROOT_DIR/apps/e2e/##" |
		sort |
		awk \
			-v shard_index="$SHARD_INDEX" \
			-v shard_count="$SHARD_COUNT" \
			'((NR - 1) % shard_count) == (shard_index - 1) { print }' |
		paste -sd, -
}

SPEC_LIST="$(resolve_specs)"

if [ -z "$SPEC_LIST" ]; then
	echo "No specs were assigned to shard $SHARD_INDEX of $SHARD_COUNT"
	exit 0
fi

echo "Running Cypress against http://localhost:$E2E_WEB_PORT/"
echo "$SPEC_LIST" | tr ',' '\n'

cd "$ROOT_DIR/apps/e2e"
unset ELECTRON_RUN_AS_NODE

BASE_URL="http://localhost:$E2E_WEB_PORT/" \
APP=applications \
AUTH_DISABLED=true \
CASE_TEAM_EMAIL=caseteam.test@planninginspectorate.gov.uk \
CASE_ADMIN_EMAIL=caseofficeradmin.test@planninginspectorate.gov.uk \
INSPECTOR_EMAIL=inspector.test@planninginspectorate.gov.uk \
VALIDATION_OFFICER_EMAIL=validationofficer.test@planninginspectorate.gov.uk \
USER_PASSWORD="" \
FEATURE_FLAG_CONNECTION_STRING=local-e2e \
STATIC_FEATURE_FLAGS_ENABLED=true \
STATIC_FEATURE_FLAG_OVERRIDES="$STATIC_FEATURE_FLAG_OVERRIDES" \
npx cypress run \
	--browser "$CYPRESS_BROWSER" \
	--spec "$SPEC_LIST" \
	2>&1 | tee "$LOG_DIR/cypress-$RUN_NAME.log"

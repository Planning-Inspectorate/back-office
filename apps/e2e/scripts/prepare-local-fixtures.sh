#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
E2E_SQL_PORT="${E2E_SQL_PORT:-14330}"
E2E_API_PORT="${E2E_API_PORT:-3001}"
E2E_WEB_PORT="${E2E_WEB_PORT:-8080}"
LOCAL_SQL_PASSWORD="${LOCAL_SQL_PASSWORD:-P@ssw0rdPINS2026!}"

mkdir -p "$ROOT_DIR/apps/e2e/cypress/support/browserAuthData"

cat > "$ROOT_DIR/apps/api/.env" <<EOF
NODE_ENV=development
GIT_SHA=local-e2e
PORT=$E2E_API_PORT
DATABASE_URL="sqlserver://127.0.0.1:$E2E_SQL_PORT;database=pins_development;user=sa;password=$LOCAL_SQL_PASSWORD;trustServerCertificate=true"
QUERY_BATCH_SIZE=2090
VIRUS_SCANNING_DISABLED=true
AZURE_BLOB_STORE_HOST=blob-store-host
AZURE_BLOB_STORE_CONTAINER=blob-store-container
AUTH_DISABLED=true
SERVICE_BUS_ENABLED=false
KEY_VAULT_ENABLED=false
PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING=""
STATIC_FEATURE_FLAGS_ENABLED=true
LOG_LEVEL_STDOUT=debug
EOF

cat > "$ROOT_DIR/apps/web/.env" <<EOF
NODE_ENV=local
GIT_SHA=local-e2e
AUTH_DISABLED=true
AUTH_DISABLED_GROUP_IDS=*
APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID=applications_case_admin_officer
APPLICATIONS_CASETEAM_GROUP_ID=applications_case_team
APPLICATIONS_INSPECTOR_GROUP_ID=applications_inspector
API_HOST=http://localhost:$E2E_API_PORT
APP_HOSTNAME=localhost:$E2E_WEB_PORT
HTTPS_ENABLED=false
HTTP_PORT=$E2E_WEB_PORT
LOG_LEVEL_STDOUT=debug
SESSION_SECRET=local-e2e-session-secret
DISABLE_REDIS=true
AZURE_BLOB_STORE_HOST=blob-store-host
STATIC_FEATURE_FLAGS_ENABLED=true
PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING=""
DUMMY_ADDRESS_DATA=true
DUMMY_USER_DATA=true
RETRY_MAX_ATTEMPTS=3
RETRY_STATUS_CODES="500,501,502"
EOF

cat > "$ROOT_DIR/apps/web/dummy_user_data.json" <<'EOF'
[
	{
		"id": "76c8f6d4-adbb-47fc-88f6-d4adbb17fc0c",
		"surname": "Admin",
		"givenName": "Case Officer",
		"userPrincipalName": "caseofficeradmin.test@planninginspectorate.gov.uk"
	},
	{
		"id": "b05734e0-3a88-4841-9734-e03a88484119",
		"surname": "Admin",
		"givenName": "Inspector",
		"userPrincipalName": "inspector.test@planninginspectorate.gov.uk"
	},
	{
		"id": "d4fdb42a-9394-4a56-b738-f6d773a2c452",
		"surname": "Team",
		"givenName": "Case",
		"userPrincipalName": "caseteam.test@planninginspectorate.gov.uk"
	},
	{
		"id": "ec83cd34-c720-4e99-b614-55f427d6c2ff",
		"surname": "Officer",
		"givenName": "Validation",
		"userPrincipalName": "validationofficer.test@planninginspectorate.gov.uk"
	}
]
EOF

cat > "$ROOT_DIR/apps/web/dummy_address_data.json" <<'EOF'
{
	"BS1 6PN": [
		{
			"apiReference": "1",
			"addressLine1": "2 Temple Quay",
			"addressLine2": "Planning Inspectorate",
			"postcode": "BS1 6PN",
			"county": "",
			"town": "Bristol",
			"displayAddress": "Planning Inspectorate, Temple Quay House, 2, The Square, Temple Quay, Bristol, BS1 6PN"
		}
	],
	"GU21 3HB": [
		{
			"apiReference": "3",
			"addressLine1": "1 Greenham Walk",
			"addressLine2": "",
			"postcode": "GU21 3HB",
			"county": "",
			"town": "Woking",
			"displayAddress": "1, Greenham Walk, Woking, GU21 3HB"
		}
	],
	"SW1P 4DF": [
		{
			"apiReference": "2",
			"addressLine1": "2 Marsham Street",
			"addressLine2": "Home Office",
			"postcode": "SW1P 4DF",
			"county": "",
			"town": "London",
			"displayAddress": "Home Office, 2, Marsham Street, London, SW1P 4DF"
		}
	]
}
EOF

printf '[]\n' > "$ROOT_DIR/apps/e2e/cypress/support/browserAuthData/case-admin-cookies.json"
printf '[]\n' > "$ROOT_DIR/apps/e2e/cypress/support/browserAuthData/inspector-cookies.json"

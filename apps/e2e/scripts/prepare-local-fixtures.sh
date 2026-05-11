#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

mkdir -p "$ROOT_DIR/apps/e2e/cypress/support/browserAuthData"

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

# Environment

## Simulating AD and OS places lookups

When developing locally, it's likely you will not have access to the Active directory or OS places for looking up users or addresses.  It is possible through environment variables and json data files to simulate these two services.

### Simulate AD with dummy data

Add the file "./apps/web/dummy_user_data.json" containing the following:
```json
[
	{
		"id": "0d248a0d-ac83-4af9-a2e6-0087db8e01a1",
		"surname": "Doe",
		"givenName": "John",
		"userPrincipalName": "john.doe@example.com"
	},
	{
		"id": "76c8f6d4-adbb-47fc-88f6-d4adbb17fc0c",
		"surname": "Admin",
		"givenName": "Case Officer",
		"userPrincipalName": "caseofficeradmin.test@planninginspectorate.gov.uk"
	}

]
```

Set the environment variables in "./apps/web/.env" as follows
```.dotenv
AUTH_DISABLED=true
DUMMY_USER_DATA=true
```

### Simulate OS Places with dummy data

Add the file "./apps/web/dummy_address_data.json" containing the following:
```json
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
```

Set the environment variables in "./apps/web/.env" as follows
```.dotenv
OS_PLACES_API_KEY=
DUMMY_ADDRESS_DATA=true
```
Note that the `OS_PLACES_API_KEY` should not be set to anything or removed altogether

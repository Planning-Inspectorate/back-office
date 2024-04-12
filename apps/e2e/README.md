## Usage

To run the tests, you can run `npm run e2e` from the root, or `npm run e2e:open` to run in interactive mode. 

You can also run `npm run cy:run` and `npm run cy:open` to run in interactive mode from the e2e-testing - `/back-office/apps/e2e`` directory.

## Environment Variables

There is a sample `.env.sample` file which will show you all the required environment variables. Make sure to set those variables in order for the tests to run properly.


## Smoke tests can run via command line
From root run - npm run e2e:smokeTests

***

## Running the tests against the local environment when developing

It is now possible to run the e2e tests against your local branch running in http://localhost:8080  

### With these .env files and dummy json files set as described below, the e2e tests will:

- Skip the Active Directory Login
- Simulate uploading and downloading to blob-storage and automatically set the status to Unchecked
- Simulate looking up users required in the tests
- Simulate looking up addresses required in the tests

### Set up your local .env files as follows:

#### apps/e2e/.env
- AUTH_DISABLED=true
- BASE_URL=http://localhost:8080/
- CASE_TEAM_EMAIL=caseofficer.test@planninginspectorate.gov.uk
- CASE_ADMIN_EMAIL=caseofficeradmin.test@planninginspectorate.gov.uk
- INSPECTOR_EMAIL=inspector.test@planninginspectorate.gov.uk
- APP=applications


#### apps/web/.env
- AUTH_DISABLED=true
- AZURE_BLOB_STORE_HOST=blob-store-host
- SESSION_SECRET=session-secret
- DUMMY_USER_DATA=true
- DUMMY_ADDRESS_DATA=true

#### apps/api/.env
- VIRUS_SCANNER_DISABLED=true
- AZURE_BLOB_STORE_HOST=blob-store-host
- AZURE_BLOB_STORE_CONTAINER=blob-store-container

### Add the following json files for address and user look-ups

#### apps/web/dummy_user_data.json
```json 
[ 
	{
		"id": "b05734e0-3a88-4841-9734-e03a88484119",
		"surname": "Admin",
		"givenName": "Inspector",
		"userPrincipalName": "inspector.test@planninginspectorate.gov.uk"
	},
	{
		"id": "76c8f6d4-adbb-47fc-88f6-d4adbb17fc0c",
		"surname": "Admin",
		"givenName": "Case Officer",
		"userPrincipalName": "caseofficeradmin.test@planninginspectorate.gov.uk"
	}
]
```

#### apps/web/dummy_address_data.json
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

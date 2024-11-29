# applications-migration Function App

Collection of Functions which migrate data from ODW system to the CBOS database

## Running locally

The Functions use the Back Office API, so this needs to be run in the background:
```bash
cd apps/api
npm run dev
```

The Functions require some environment variables to be set, including the ODW Synapse database URL.

Dev - `pins-synw-odw-dev-uks-ondemand.sql.azuresynapse.net` 

Test - `pins-synw-odw-test-uks-ondemand.sql.azuresynapse.net`

In order for your local machine to be able to query the Synapse instance, you must be logged into your Azure account (`az login`) and it must have been given permission to read the Synapse database in the ODW team's Azure Subscription. There is also an IP whitelist on the Synapse instance which your IP address will need to be added to.

```
# set the required environment variables
There is a settings file local.settings.json.example.
Copy this file to local.settings.json, and make sure the settings are correct for your environment.
You may need to check with dev colleagues for secret values.

export SYNAPSE_SQL_HOST='pins-synw-odw-test-uks-ondemand.sql.azuresynapse.net'
export API_HOST='localhost:3000'
export BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN=example.org

cd apps/functions/applications-migration
npx func start --verbose
```

The `func start` command will provide a list of URLs, one for each Function. For example, the `nsip-project` Function will be: `http://localhost:7071/api/nsip-project-migration`

Make a POST request to this URL to trigger the Function:

```
curl http://localhost:7071/api/nsip-project-migration \ 
  --data '{ 
    "caseReferences": [
	  "WW010001"
	] 
  }'
```

## Running remotely

The Functions are triggered via HTTP request using a URL provided in Azure that contains a secret key to guard against public access. 

You can find the URLs for each Function in the Azure Portal (`Home` > `Function App` > `pins-func-apps-migration-apps-migration-{env}-ukw-001` > `{function name}` > `Get function URL`)

Make a POST request to this URL with an array of case references, as described above

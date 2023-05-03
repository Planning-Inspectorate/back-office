# Uploading Files

Files are uploaded from the client-side directly to blob storage. There isn't currently an implementation that works with a local storage emulator, so tests against uploaded files must be done against a live blob storage instance. Authentication to the blob storage instance is achieved using the OBO flow with the currently logged-in user's session, so you'll have to enable authentication. Additionally, azure blob storage will refuse uploads from non-https origins, so you'll need to create a certificate and enable HTTPS.

Prerequisites:

1. Azure CLI installed
2. Openssl installed
3. Access to the Azure Portal

## 1. Login to the azure cli

```
az login
```

## 2. Configure local environment to point at dev environment

You'll need to point your local environment at the dev environment database and blob storage. You can limit this to just the blob storage environment, but then you'll pollute the dev environment with orphaned file uploads, so it's best to point at the database too if possible.

Log into the azure portal and take a look at the App Configuration settings for web, api and document api. Create a .env file in 'api' that mirrors the dev settings for:

```
DATABASE_URL
```

Then for the document API, create a .env.local file that mirrors the dev settings for:

```
AZURE_BLOB_STORE_HOST
```

Finally for the web app, create a .env.local file that mirrors dev settings for:

```
APPEALS_CASE_OFFICER_GROUP_ID
APPEALS_INSPECTOR_GROUP_ID
APPEALS_VALIDATION_OFFICER_GROUP_ID
APPLICATIONS_CASE_ADMIN_OFFICER_GROUP_ID
APPLICATIONS_CASEOFFICER_GROUP_ID
APPLICATIONS_CASETEAM_GROUP_ID
APPLICATIONS_INSPECTOR_GROUP_ID
AZURE_BLOB_STORE_HOST
AZURE_BLOB_STORE_ACCOUNT_NAME
AZURE_BLOB_STORE_ACCOUNT_KEY
```

## 3. Enable authentication and HTTPS on Web
You'll need to enable authentication and HTTPS on the Web app. First, generate a key pair

```
openssl genrsa -out client-key.pem 2048
openssl req -new -key client-key.pem -out client.csr
openssl x509 -req -in client.csr -signkey client-key.pem -out client-cert.pem
```

Then place them in the root of the back-office project folder (they'll be ignored by gitignore). Then, configure your .env.local file for the web app with the following settings:

```
SSL_CERT_FILE=client-cert.pem
SSL_KEY_FILE=client-key.pem
HTTP_PORT=8081
HTTPS_PORT=8080
AUTH_DISABLED=false
AUTH_CLIENT_ID={copy from portal}
AUTH_TENANT_ID={copy from portal}
AUTH_CLIENT_SECRET={copy from portal}
AUTH_REDIRECT_URI=/auth/redirect
AUTH_CLOUD_INSTANCE_ID=https://login.microsoftonline.com
```

You'll have to log into the Azure Portal and copy the values for the keys with {copy from portal} values.

## 4. Grant yourself temporary access to the database (optional)

If you are pointing at the dev database, you'll need to temporarily whitelist your IP on the database firewall. You can do this in the Azure Portal in the Networking tab

(TODO: We're in the process of making this step redundant using VPN)

## 5. Enable CORS for https://localost:8080 on the dev blob instance

Navigate to 'Resource sharing (CORS)' section of the azure blob storage account you're pointing at and add https://localhost:8080 as an allowed origin for GET, OPTIONS and PUT.

(TODO: This probably needs to live in Terraform for dev if we're going to make this a permanent thing)

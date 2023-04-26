# Local Development

The function to scan documents is triggered by EventGrid events, which are emitted by Blob Storage when a new file is uploaded. As far as I know, it's not possible to emulate this set-up locally using azurite storage emulator (since the azurite emulator doesn't support this, and there's no native EventGrid emulator even if it could) but you have a few options for testing:

1. Only run the stateless express services locally (the express apps) and configure your env variables to run against the dev database, service bus and blob storage. Your requests will be processed by the Azure Functions deployed to the dev environment, so you'll have to deploy your function directly to the dev environment to test it end-to-end.
2. Expand on option 1 by creating your own subscription against Blob Storage and pointing the webhook callback at your locally running functions using ngrok (detailed on Azure docs [here](https://learn.microsoft.com/en-us/azure/azure-functions/functions-event-grid-blob-trigger?pivots=programming-language-javascript#start-local-debuggin)). Any existing subscriptions will still run in the dev environment (i.e. the deployed azure function), so your code will have to be idempotent.
3. Probably the easiest option is to collect or craft an EventGrid event and invoke the locally running function explicitly (using postman). If you want to run this against a local file referenced in your local database, you'll also need to have the express APIs running.

## 1. Set up azurite
You can install azurite using npm

``npm install -g azurite``

Or you can run Azurite on docker

``docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 --name azurite -d mcr.microsoft.com/azure-storage/azurite``

## 2. Install azure-functions-core-tools

``npm install -g azure-functions-core-tools@4``

## 3. Run ClamAV

This is not the official clamav image (which we use in production), but seems to be more stable for local development. The official image is a little more temperamental - it won't work without a volume so it can auto-update the virus DB, and when it's updating it sometimes gets stuck and won't respond to requests. For local development, this should be good enough. 

``docker run -d -p 3310:3310 mkodockx/docker-clamav:buster-slim``

## 4. Run azure function

``func start``

## 5. Log into the Azure CLI if you're targeting a live blob (optional)

If you're working against a live blob (i.e. the blob has been uploaded against the dev environment), you'll need to log into the Azure CLI.

### 5.1 Install the Azure CLI

https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

### 5.2 Log-in to the Azure CLI

``az login``

## 6. Create a POST request to the Functions runtime

```
curl --location --request POST 'http://localhost:7071/runtime/webhooks/EventGrid?functionName=check-document' \
--header 'aeg-event-type: Notification' \
--header 'Content-Type: application/json' \
--data-raw '[
  {
    "id": "'\''1",
    "eventType": "yourEventType",
    "eventTime": "10:59:00.000",
    "subject": "yoursubject",
    "data": {
      "api": "PutBlob",
      "clientRequestId": "977e1054-1ed9-449e-a4a4-7966cc6499f0",
      "requestId": "a67ec3ef-301e-0042-2e92-77434c000000",
      "eTag": "0x8DB45A9FACC55A3",
      "contentType": "application/pdf",
      "contentLength": 238955,
      "blobType": "BlockBlob",
      "url": "https://pinsstdocsbodevukw001.blob.core.windows.net/document-service-uploads/application/TR0310010/41985cf3-cf61-4609-9e8c-c41f41ce8283/sample-doc",
      "sequencer": "0000000000000000000000000000A8CE0000000001523864",
      "storageDiagnostics": {
        "batchId": "3e803cd5-6006-0051-0092-7776ad000000"
      }
    },
    "dataVersion": "1.0"
  }
]'
```

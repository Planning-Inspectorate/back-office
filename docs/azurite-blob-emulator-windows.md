### Setting up Azure Blob Store emulator locally

To run a local emulator, there are a number of required steps. In order to successfully write to the emulator, it is necessary to configure it over https, using a self-signed certificate, and with a Shared Access Signature (SAS). Before you start, make sure you have followed the steps in [enabling-ad-locally](./enabling-ad-locally.md)

1. The first step is to create a [local self-signed certificate](./self-signed-ssl.md), follow the instructions for windows.

2. Once the certificate is created, it needs to be accessible by docker, in order to start the Azurite emulator with https. The following command will create a docker container running the emulator, mapping a local folder containing the certificate:

In your terminal, navigate to the folder where you created the certificates (should be `/back-office/appeals/web`).

**_Windows Command Line:_**

```
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 -v %cd%:/workspace --name pins_azurite -d mcr.microsoft.com/azure-storage/azurite azurite --blobHost 0.0.0.0  --queueHost 0.0.0.0 --tableHost 0.0.0.0 --cert /workspace/cert.pem --key /workspace/key.pem --oauth basic --skipApiVersionCheck
```

**_Powershell:_**

```
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 -v ${PWD}:/workspace --name pins_azurite -d mcr.microsoft.com/azure-storage/azurite azurite --blobHost 0.0.0.0  --queueHost 0.0.0.0 --tableHost 0.0.0.0 --cert /workspace/cert.pem --key /workspace/key.pem --oauth basic --skipApiVersionCheck
```

3. Create a shortcut of Azure Storage Explorer, right-click properties, and add `--ignore-certificate-errors` at the end.

4. Open Azure Storage Explorer, right-click on `Storage Accounts` and select `Connect to Azure Storage`.
5. Select Local storage emulator, give it a name (eg. pins_azurite), and check the `Use HTTPS` box. Then click next and connect
6. Create a Blob Container by right-clicking Blob Containers and name it `document-service-uploads`.
7. Get a SAS for `document-service-uploads`, set the expiry time into the far future, add `Create` to the permissions, and add an API version (doesn't matter, it just needs a date eg. 2021-10-04), and `Create`. You will be given a URL copy it for later.
8. Ensure CORS is properly configured on the blob container. In `Microsoft Azure Storage Explorer`, in the sidebar, expand `Storage Accounts > pins_azurite (Key)`, right click on `Blob Containers` and select `Configure CORS settings`. Add a new rule named `*` (or edit if already present), with the following settings:

```
Allowed Origins: *
Allowed Methods: GET;PUT
Allowed Headers: *
Exposed Headers: *
Max Age (in seconds): 5
```

**Be sure to save the new rule.**

6. The final step is to configure the application to use the emulator. That is achieved by adding the following to `./appeals/web/.env`:

```
AZURE_BLOB_DEFAULT_CONTAINER=document-service-uploads
AZURE_BLOB_EMULATOR_SAS_HOST=<obtained in step 7>
AZURE_BLOB_STORE_HOST=https://127.0.0.1:10000/devstoreaccount1/
AZURE_BLOB_USE_EMULATOR=true
NODE_TLS_REJECT_UNAUTHORIZED=0
```

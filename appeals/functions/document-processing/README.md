# Document Processing

Contains functions to:
1. copy blobs from the `front_office_storage_account_host` to the `back_office_storage_account_host` storage account
2. reports malware scans, consuming event grid messages from the `malware-scanning-bo-subscription`

These function process documents and metadata, across blob storage and back-office appeals api.

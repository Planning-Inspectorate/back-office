BEGIN TRY

BEGIN TRAN;

-- Back-fill [dbo].[DocumentVersion] columns (since we can't rename in SQL Server)
UPDATE DocumentVersion
SET [privateBlobContainer] = [blobStorageContainer],
    [privateBlobPath] = [documentURI];

-- Drop old columns
ALTER TABLE [dbo].[DocumentVersion] DROP COLUMN [blobStorageContainer],
[blobStoragePath],
[documentURI],
[path];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

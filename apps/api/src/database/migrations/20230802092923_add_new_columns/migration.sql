BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_name_folderId_key];

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [name];

-- Create new columns
ALTER TABLE [dbo].[DocumentVersion] ADD [privateBlobContainer] NVARCHAR(1000),
[privateBlobPath] NVARCHAR(1000),
[publishedBlobContainer] NVARCHAR(1000),
[publishedBlobPath] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_documentType_df];
ALTER TABLE [dbo].[DocumentVersion] ALTER COLUMN [documentType] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
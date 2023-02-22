BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentMetadata] DROP CONSTRAINT [DocumentMetadata_sourceSystem_df];
ALTER TABLE [dbo].[DocumentMetadata] ALTER COLUMN [stage] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[DocumentMetadata] ADD CONSTRAINT [DocumentMetadata_sourceSystem_df] DEFAULT 'back-office' FOR [sourceSystem];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

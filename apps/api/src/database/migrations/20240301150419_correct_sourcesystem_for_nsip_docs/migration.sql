-- sourceSystem needs to match schema enum value
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_sourceSystem_df];
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office-applications' FOR [sourceSystem];


-- and correct all existing NSIP Applications doc records
UPDATE [dbo].[DocumentVersion] SET sourceSystem = 'back-office-applications'
WHERE sourceSystem = 'back-office'

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

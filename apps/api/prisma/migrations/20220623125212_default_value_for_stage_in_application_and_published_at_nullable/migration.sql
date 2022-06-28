BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Application] ALTER COLUMN [publishedAt] DATETIME2 NULL;
ALTER TABLE [dbo].[Application] ADD CONSTRAINT [Application_stage_df] DEFAULT 'Pre-application' FOR [stage];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

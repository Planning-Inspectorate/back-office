BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_status_df];
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_status_df] DEFAULT 'received_appeal' FOR [status];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

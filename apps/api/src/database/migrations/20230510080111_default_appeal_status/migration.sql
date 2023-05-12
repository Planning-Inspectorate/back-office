BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealStatus] DROP CONSTRAINT [AppealStatus_status_df];
ALTER TABLE [dbo].[AppealStatus] ADD CONSTRAINT [AppealStatus_status_df] DEFAULT 'ready_to_start' FOR [status];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

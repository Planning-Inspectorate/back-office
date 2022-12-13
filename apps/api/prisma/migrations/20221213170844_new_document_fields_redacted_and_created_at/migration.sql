BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_status_df];
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_status_df] DEFAULT 'awaiting_upload' FOR [status];
ALTER TABLE [dbo].[Document] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Document_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[redacted] BIT NOT NULL CONSTRAINT [Document_redacted_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

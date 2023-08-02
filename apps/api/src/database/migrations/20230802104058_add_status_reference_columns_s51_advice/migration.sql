BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[S51Advice] ADD [publishedStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [S51Advice_publishedStatus_df] DEFAULT 'not_checked',
[redactedStatus] NVARCHAR(1000) NOT NULL CONSTRAINT [S51Advice_redactedStatus_df] DEFAULT 'not_redacted',
[referenceNumber] INT NOT NULL CONSTRAINT [S51Advice_referenceNumber_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[S51Advice] ADD [publishedStatusPrev] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
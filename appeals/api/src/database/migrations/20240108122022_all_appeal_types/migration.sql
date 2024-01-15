BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [resubmitTypeId] INT;

-- AlterTable
ALTER TABLE [dbo].[AppealTimetable] ADD [resubmitAppealTypeDate] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[AppealType] ADD [code] NVARCHAR(1000),
[enabled] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

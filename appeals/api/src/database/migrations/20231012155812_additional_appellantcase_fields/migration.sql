BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantCase] ADD [costsAppliedForIndicator] BIT,
[decision] NVARCHAR(1000),
[inspectorAccessDetails] NVARCHAR(1000),
[originalCaseDecisionDate] DATETIME2;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

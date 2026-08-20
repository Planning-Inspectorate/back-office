BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[ExaminationLibraryCategory] DROP CONSTRAINT [ExaminationLibraryCategory_examinationTimetableItemId_key];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

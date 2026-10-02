BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[ExaminationLibraryCategory] DROP CONSTRAINT [ExaminationLibraryCategory_examinationTimetableItemId_key];

-- CreateIndex
CREATE UNIQUE NONCLUSTERED INDEX [ExaminationLibraryCategory_examinationTimetableItemId_key] ON [dbo].[ExaminationLibraryCategory]([examinationTimetableItemId]) WHERE [examinationTimetableItemId] IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

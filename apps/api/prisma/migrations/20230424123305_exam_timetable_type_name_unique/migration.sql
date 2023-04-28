/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ExaminationTimetableType` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[ExaminationTimetableType] ADD CONSTRAINT [ExaminationTimetableType_name_key] UNIQUE NONCLUSTERED ([name]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

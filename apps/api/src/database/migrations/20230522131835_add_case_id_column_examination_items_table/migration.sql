/*
  Warnings:

  - Added the required column `caseId` to the `ExaminationTimetableItems` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ExaminationTimetableItems] ALTER COLUMN [description] NTEXT NULL;
ALTER TABLE [dbo].[ExaminationTimetableItems] ADD [caseId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItems] ADD CONSTRAINT [ExaminationTimetableItems_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - Added the required column `folderId` to the `ExaminationTimetableItem` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- Truncate Existing records
TRUNCATE TABLE [dbo].[ExaminationTimetableItem]

-- AlterTable
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD [folderId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[ExaminationTimetableItem] ADD CONSTRAINT [ExaminationTimetableItem_folderId_fkey] FOREIGN KEY ([folderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

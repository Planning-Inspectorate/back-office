/*
  Warnings:

  - You are about to drop the column `endTime` on the `ExaminationTimetableItem` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `ExaminationTimetableItem` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ExaminationTimetableItem] DROP COLUMN [endTime],
[startTime];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - Made the column `procedureTypeId` on table `LPAQuestionnaire` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scheduleTypeId` on table `LPAQuestionnaire` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] ALTER COLUMN [procedureTypeId] INT NOT NULL;
ALTER TABLE [dbo].[LPAQuestionnaire] ALTER COLUMN [scheduleTypeId] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

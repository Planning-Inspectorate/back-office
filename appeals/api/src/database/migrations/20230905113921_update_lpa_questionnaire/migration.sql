/*
  Warnings:

  - You are about to drop the column `description` on the `ListedBuildingDetails` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `ListedBuildingDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ListedBuildingDetails] DROP COLUMN [description],
[grade];
ALTER TABLE [dbo].[ListedBuildingDetails] ADD [listEntry] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [isCorrectAppealType] BIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

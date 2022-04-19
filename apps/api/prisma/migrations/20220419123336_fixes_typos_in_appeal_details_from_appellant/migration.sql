/*
  Warnings:

  - You are about to drop the column `healthAndSafetyIsueesDescription` on the `AppealDetailsFromAppellant` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealDetailsFromAppellant] DROP COLUMN [healthAndSafetyIsueesDescription];
ALTER TABLE [dbo].[AppealDetailsFromAppellant] ADD [healthAndSafetyIssuesDescription] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

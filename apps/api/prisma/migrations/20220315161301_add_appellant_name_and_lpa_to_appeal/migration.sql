/*
  Warnings:

  - Added the required column `appellantName` to the `Appeal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localPlanningDepartment` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [appellantName] NVARCHAR(1000) NOT NULL,
[localPlanningDepartment] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

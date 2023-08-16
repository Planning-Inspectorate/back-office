/*
  Warnings:

  - You are about to alter the column `otherNotValidReasons` on the `AppellantCase` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(4000)` to `NVarChar(1000)`.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppellantCase] ALTER COLUMN [otherNotValidReasons] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

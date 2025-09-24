/*
  Warnings:

  - You are about to drop the column `type` on the `Meeting` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Meeting] DROP COLUMN [type];
ALTER TABLE [dbo].[Meeting] ADD [meetingType] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

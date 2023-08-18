/*
  Warnings:

  - You are about to drop the column `displayName` on the `Folder` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] ADD [dateReceived] DATETIME2;

-- AlterTable
ALTER TABLE [dbo].[Folder] DROP COLUMN [displayName];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

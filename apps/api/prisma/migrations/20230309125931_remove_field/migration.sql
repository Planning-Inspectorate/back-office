/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DocumentVersion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
-- ALTER TABLE [dbo].[DocumentVersion] DROP COLUMN [createdAt];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

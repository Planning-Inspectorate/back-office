/*
  Warnings:

  - You are about to drop the column `blocStoragePath` on the `Document` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [blocStoragePath];
ALTER TABLE [dbo].[Document] ADD [blobStoragePath] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

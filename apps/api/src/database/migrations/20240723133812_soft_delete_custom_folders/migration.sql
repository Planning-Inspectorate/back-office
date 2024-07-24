/*
  Warnings:

  - A unique constraint covering the columns `[caseId,displayNameEn,parentFolderId,deletedAt]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Folder] DROP CONSTRAINT [Folder_caseId_displayNameEn_parentFolderId_key];

-- AlterTable
ALTER TABLE [dbo].[Folder] ADD [deletedAt] DATETIME2;

-- CreateIndex
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_displayNameEn_parentFolderId_deletedAt_key] UNIQUE NONCLUSTERED ([caseId], [displayNameEn], [parentFolderId], [deletedAt]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

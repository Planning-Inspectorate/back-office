/*
  Warnings:

  - A unique constraint covering the columns `[caseId,displayNameEn,parentFolderId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_displayNameEn_parentFolderId_key] UNIQUE NONCLUSTERED ([caseId], [displayNameEn], [parentFolderId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

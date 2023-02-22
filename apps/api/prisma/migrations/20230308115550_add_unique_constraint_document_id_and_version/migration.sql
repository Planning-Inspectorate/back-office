/*
  Warnings:

  - A unique constraint covering the columns `[documentId,version]` on the table `DocumentVersion` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_documentId_version_key] UNIQUE NONCLUSTERED ([documentId], [version]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

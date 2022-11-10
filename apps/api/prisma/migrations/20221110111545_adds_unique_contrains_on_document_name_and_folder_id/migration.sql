/*
  Warnings:

  - A unique constraint covering the columns `[name,folderId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_name_folderId_key] UNIQUE NONCLUSTERED ([name], [folderId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

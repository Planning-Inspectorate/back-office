/*
  Warnings:

  - You are about to drop the column `reference` on the `Document` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

EXEC sp_rename 'dbo.Document.reference', 'documentReference', 'COLUMN'

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

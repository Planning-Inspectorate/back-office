/*
  Warnings:

  - You are about to drop the column `redacted` on the `DocumentVersion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;


COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

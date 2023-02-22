/*
  Warnings:

  - You are about to drop the column `createdAt` on the `DocumentMetadata` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentMetadata] ADD [receivedDate] DATETIME2 CONSTRAINT [DocumentMetadata_receivedDate_df] DEFAULT CURRENT_TIMESTAMP;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

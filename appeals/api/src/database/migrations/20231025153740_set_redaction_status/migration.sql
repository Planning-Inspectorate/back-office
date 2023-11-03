/*
  Warnings:

  - You are about to drop the column `documentRedactionStatusId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `receivedAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `redactedStatus` on the `DocumentVersion` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_documentRedactionStatusId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [documentRedactionStatusId],
[receivedAt];

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP COLUMN [redactedStatus];
ALTER TABLE [dbo].[DocumentVersion] ADD [redactionStatusId] INT;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_redactionStatusId_fkey] FOREIGN KEY ([redactionStatusId]) REFERENCES [dbo].[DocumentRedactionStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

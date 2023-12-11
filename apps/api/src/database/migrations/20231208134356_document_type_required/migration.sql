/*
  Warnings:

  - Made the column `documentType` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
UPDATE [dbo].[Document] SET [documentType] = 's51-attachment' WHERE [guid] in (SELECT [documentGuid] FROM [dbo].[S51AdviceDocument]);
UPDATE [dbo].[Document] SET [documentType] = 'document' WHERE [documentType] is NULL;

ALTER TABLE [dbo].[Document] ALTER COLUMN [documentType] NVARCHAR(1000) NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

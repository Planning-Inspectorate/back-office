/*
  Warnings:

  - Added the required column `caseId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- Create the column as nullable for migration
ALTER TABLE [dbo].[Document] ADD [caseId] INT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

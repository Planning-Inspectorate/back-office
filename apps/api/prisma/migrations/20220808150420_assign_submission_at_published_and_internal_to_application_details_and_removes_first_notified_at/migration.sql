/*
  Warnings:

  - You are about to drop the column `firstNotifiedAt` on the `ApplicationDetails` table. All the data in the column will be lost.
  - You are about to drop the column `submissionAt` on the `ApplicationDetails` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[ApplicationDetails] DROP COLUMN [firstNotifiedAt],
[submissionAt];
ALTER TABLE [dbo].[ApplicationDetails] ADD [submissionAtInternal] DATETIME2,
[submissionAtPublished] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

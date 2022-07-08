/*
  Warnings:

  - Added the required column `description` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Application] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [Application_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[description] NVARCHAR(1000) NOT NULL DEFAULT '',
[publishedAt] DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
[title] NVARCHAR(1000) NOT NULL DEFAULT '';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

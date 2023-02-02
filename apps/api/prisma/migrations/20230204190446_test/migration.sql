/*
  Warnings:

  - A unique constraint covering the columns `[guid,isDeleted]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [isDeleted] BIT NOT NULL CONSTRAINT [Document_isDeleted_df] DEFAULT 0;

-- CreateIndex
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_guid_isDeleted_key] UNIQUE NONCLUSTERED ([guid], [isDeleted]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

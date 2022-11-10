/*
  Warnings:

  - The primary key for the `Document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Document` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_pkey];
ALTER TABLE [dbo].[Document] DROP COLUMN [id];
ALTER TABLE [dbo].[Document] ADD CONSTRAINT Document_pkey PRIMARY KEY CLUSTERED ([guid]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

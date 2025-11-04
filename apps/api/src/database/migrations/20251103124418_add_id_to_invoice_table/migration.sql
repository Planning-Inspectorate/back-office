/*
  Warnings:

  - The primary key for the `Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Invoice] DROP CONSTRAINT [Invoice_pkey];
ALTER TABLE [dbo].[Invoice] ADD [id] INT NOT NULL IDENTITY(1,1);
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT Invoice_pkey PRIMARY KEY CLUSTERED ([id]);

-- CreateIndex
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT [Invoice_invoiceNumber_key] UNIQUE NONCLUSTERED ([invoiceNumber]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

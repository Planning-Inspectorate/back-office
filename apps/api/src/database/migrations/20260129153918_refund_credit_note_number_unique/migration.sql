/*
  Warnings:

  - A unique constraint covering the columns `[refundCreditNoteNumber]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT [Invoice_refundCreditNoteNumber_key] UNIQUE NONCLUSTERED ([refundCreditNoteNumber]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

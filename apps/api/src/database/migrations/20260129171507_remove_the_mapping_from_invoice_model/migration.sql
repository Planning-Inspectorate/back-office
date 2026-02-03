BEGIN TRY

BEGIN TRAN;

-- RenameIndex
EXEC SP_RENAME N'dbo.Invoice.invoiceNumber', N'Invoice_invoiceNumber_key', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Invoice.refundCreditNoteNumber', N'Invoice_refundCreditNoteNumber_key', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

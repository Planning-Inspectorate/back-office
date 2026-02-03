BEGIN TRY

BEGIN TRAN;

-- RenameIndex
EXEC SP_RENAME N'dbo.Invoice.Invoice_invoiceNumber_key', N'invoiceNumber', N'INDEX';

-- RenameIndex
EXEC SP_RENAME N'dbo.Invoice.Invoice_refundCreditNoteNumber_key', N'refundCreditNoteNumber', N'INDEX';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

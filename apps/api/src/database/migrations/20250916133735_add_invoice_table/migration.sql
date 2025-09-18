BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Invoice] (
    [invoiceNumber] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    [invoiceStage] NVARCHAR(1000),
    [amountDue] DECIMAL(32,16) NOT NULL,
    [paymentDueDate] DATETIME2,
    [invoicedDate] DATETIME2,
    [paymentDate] DATETIME2,
    [refundCreditNoteNumber] NVARCHAR(1000),
    [refundAmount] DECIMAL(32,16),
    [refundIssueDate] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Invoice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Invoice_pkey] PRIMARY KEY CLUSTERED ([invoiceNumber])
);

-- AddForeignKey
ALTER TABLE [dbo].[Invoice] ADD CONSTRAINT [Invoice_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

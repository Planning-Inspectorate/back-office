BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[DocumentReferenceNumberCounter] (
    [caseReference] NVARCHAR(1000) NOT NULL,
    [count] INT NOT NULL,
    CONSTRAINT [DocumentReferenceNumberCounter_pkey] PRIMARY KEY CLUSTERED ([caseReference])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

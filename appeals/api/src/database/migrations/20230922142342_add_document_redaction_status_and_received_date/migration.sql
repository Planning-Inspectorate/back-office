BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] ADD [documentRedactionStatusId] INT,
[receivedAt] DATETIME2;

-- CreateTable
CREATE TABLE [dbo].[DocumentRedactionStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentRedactionStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentRedactionStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_documentRedactionStatusId_fkey] FOREIGN KEY ([documentRedactionStatusId]) REFERENCES [dbo].[DocumentRedactionStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

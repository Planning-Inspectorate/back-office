BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppealStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealStatus_status_df] DEFAULT 'received_appeal',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppealStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [AppealStatus_valid_df] DEFAULT 1,
    [appealId] INT NOT NULL,
    CONSTRAINT [AppealStatus_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppealStatus] ADD CONSTRAINT [AppealStatus_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

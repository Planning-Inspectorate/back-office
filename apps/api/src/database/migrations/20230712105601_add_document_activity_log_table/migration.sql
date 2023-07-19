BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[DocumentActivityLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [user] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [DocumentActivityLog_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [DocumentActivityLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentActivityLog] ADD CONSTRAINT [DocumentActivityLog_documentGuid_version_fkey] FOREIGN KEY ([documentGuid], [version]) REFERENCES [dbo].[DocumentVersion]([documentGuid],[version]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

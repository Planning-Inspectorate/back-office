BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[S51AdviceDocument] (
    [id] INT NOT NULL IDENTITY(1,1),
    [adviceId] INT NOT NULL,
    [documentGuid] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [S51AdviceDocument_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [S51AdviceDocument_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid])
);

-- AddForeignKey
ALTER TABLE [dbo].[S51AdviceDocument] ADD CONSTRAINT [S51AdviceDocument_adviceId_fkey] FOREIGN KEY ([adviceId]) REFERENCES [dbo].[S51Advice]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[S51AdviceDocument] ADD CONSTRAINT [S51AdviceDocument_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

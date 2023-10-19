BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] ADD [transcriptGuid] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_transcriptGuid_fkey] FOREIGN KEY ([transcriptGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

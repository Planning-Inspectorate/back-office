BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] ADD [transcriptReference] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_transcript_documentGuid_fkey] FOREIGN KEY ([transcriptReference]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

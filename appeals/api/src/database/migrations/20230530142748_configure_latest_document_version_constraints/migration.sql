/*
  Warnings:

  - A unique constraint covering the columns `[guid,latestVersionId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_guid_latestVersionId_key] UNIQUE NONCLUSTERED ([guid], [latestVersionId]);

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_guid_latestVersionId_fkey] FOREIGN KEY ([guid], [latestVersionId]) REFERENCES [dbo].[DocumentVersion]([documentGuid],[version]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

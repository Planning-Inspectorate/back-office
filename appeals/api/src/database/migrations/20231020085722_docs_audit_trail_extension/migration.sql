BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[DocumentVersion] DROP CONSTRAINT [DocumentVersion_sourceSystem_df];
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office-appeals' FOR [sourceSystem];

-- CreateTable
CREATE TABLE [dbo].[DocumentVersionAudit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [auditTrailId] INT NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentVersionAudit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentVersionAudit_auditTrailId_key] UNIQUE NONCLUSTERED ([auditTrailId])
);

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_auditTrailId_fkey] FOREIGN KEY ([auditTrailId]) REFERENCES [dbo].[AuditTrail]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

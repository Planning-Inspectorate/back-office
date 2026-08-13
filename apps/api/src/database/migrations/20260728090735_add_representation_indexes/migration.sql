BEGIN TRY

BEGIN TRAN;

-- CreateIndex
CREATE NONCLUSTERED INDEX [status] ON [dbo].[Representation]([status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [caseId_status] ON [dbo].[Representation]([caseId], [status]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [representationAction_representationId] ON [dbo].[RepresentationAction]([representationId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [representationAttachment_representationId] ON [dbo].[RepresentationAttachment]([representationId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

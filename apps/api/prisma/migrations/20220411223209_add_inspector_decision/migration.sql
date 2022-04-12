BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[InspectorDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [outcome] NVARCHAR(1000) NOT NULL,
    [decisionLetterFilename] NVARCHAR(1000),
    CONSTRAINT [InspectorDecision_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [InspectorDecision_appealId_key] UNIQUE ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

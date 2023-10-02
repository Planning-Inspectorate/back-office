BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CasePublishedState] (
    [id] INT NOT NULL IDENTITY(1,1),
    [isPublished] BIT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CasePublishedState_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [caseId] INT NOT NULL,
    CONSTRAINT [CasePublishedState_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CasePublishedState] ADD CONSTRAINT [CasePublishedState_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

INSERT INTO [dbo].[CasePublishedState] ([isPublished], [createdAt], [caseId])
SELECT 1, [publishedAt], [id] FROM [dbo].[Case] WHERE [publishedAt] IS NOT NULL;

ALTER TABLE [dbo].[Case] DROP COLUMN [publishedAt];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

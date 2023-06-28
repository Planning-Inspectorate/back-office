BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProjectUpdate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [authorId] INT,
    [dateCreated] DATETIME2 NOT NULL CONSTRAINT [ProjectUpdate_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [emailSubscribers] BIT NOT NULL CONSTRAINT [ProjectUpdate_emailSubscribers_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [ProjectUpdate_status_df] DEFAULT 'draft',
    [datePublished] DATETIME2,
    [sentToSubscribers] BIT NOT NULL CONSTRAINT [ProjectUpdate_sentToSubscribers_df] DEFAULT 0,
    [title] NVARCHAR(1000),
    [htmlContent] NVARCHAR(1000) NOT NULL,
    [htmlContentWelsh] NVARCHAR(1000),
    CONSTRAINT [ProjectUpdate_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProjectUpdate] ADD CONSTRAINT [ProjectUpdate_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectUpdate] ADD CONSTRAINT [ProjectUpdate_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

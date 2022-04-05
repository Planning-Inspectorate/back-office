BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[SiteVisit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [visitDate] DATETIME2 NOT NULL,
    [visitSlot] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SiteVisit_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [SiteVisit_appealId_key] UNIQUE ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

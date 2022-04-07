BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[SiteVisit] ADD [visitType] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[AppealDetailsFromAppellant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [siteVisibleFromPublicLand] BIT,
    CONSTRAINT [AppealDetailsFromAppellant_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [AppealDetailsFromAppellant_appealId_key] UNIQUE ([appealId])
);

-- AddForeignKey
ALTER TABLE [dbo].[AppealDetailsFromAppellant] ADD CONSTRAINT [AppealDetailsFromAppellant_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

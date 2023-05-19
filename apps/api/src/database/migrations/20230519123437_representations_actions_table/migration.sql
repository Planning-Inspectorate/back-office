BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Representation] ADD [type] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[RepresentationContact] ADD [contactMethod] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[RepresentationAction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [type] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [previousStatus] NVARCHAR(1000),
    [redactStatus] BIT,
    [previousRedactStatus] BIT,
    [invalidReason] NVARCHAR(1000),
    [referredTo] NVARCHAR(1000),
    [actionBy] NVARCHAR(1000) NOT NULL,
    [actionDate] DATETIME2 NOT NULL,
    [notes] NVARCHAR(1000),
    CONSTRAINT [RepresentationAction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAction] ADD CONSTRAINT [RepresentationAction_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

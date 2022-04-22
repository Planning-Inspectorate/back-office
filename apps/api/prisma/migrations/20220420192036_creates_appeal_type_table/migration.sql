BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Appeal] ADD [appealTypeId] INT;

-- CreateTable
CREATE TABLE [dbo].[AppealType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [shorthand] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppealType_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [AppealType_type_key] UNIQUE ([type]),
    CONSTRAINT [AppealType_shorthand_key] UNIQUE ([shorthand])
);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appealTypeId_fkey] FOREIGN KEY ([appealTypeId]) REFERENCES [dbo].[AppealType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

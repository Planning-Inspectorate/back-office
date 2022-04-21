BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appealTypeId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Appeal] ALTER COLUMN [appealTypeId] INT NULL;

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

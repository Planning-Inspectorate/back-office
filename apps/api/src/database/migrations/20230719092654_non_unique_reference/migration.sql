BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Document] DROP CONSTRAINT [Document_reference_key];

-- AlterTable
ALTER TABLE [dbo].[Document] ALTER COLUMN [reference] NVARCHAR(1000) NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

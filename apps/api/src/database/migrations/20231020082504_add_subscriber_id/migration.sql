BEGIN TRY

BEGIN TRAN;

-- AlterTable
-- We need to create this as nullable initially, since we're going to seed it
ALTER TABLE [dbo].[Subscription] ADD [subscriberId] INT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

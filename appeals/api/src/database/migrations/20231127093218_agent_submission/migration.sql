BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Agent] DROP CONSTRAINT [Agent_customerId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appellant] DROP CONSTRAINT [Appellant_customerId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Agent] ALTER COLUMN [customerId] INT NULL;

-- AlterTable
ALTER TABLE [dbo].[Appellant] ALTER COLUMN [customerId] INT NULL;

-- AlterTable
ALTER TABLE [dbo].[InspectorDecision] ADD [invalidDecisionReason] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[Appellant] ADD CONSTRAINT [Appellant_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[ServiceCustomer]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Agent] ADD CONSTRAINT [Agent_customerId_fkey] FOREIGN KEY ([customerId]) REFERENCES [dbo].[ServiceCustomer]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - A unique constraint covering the columns `[subscriberId,caseReference]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_subscriberId_caseReference_key] UNIQUE NONCLUSTERED ([subscriberId], [caseReference]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

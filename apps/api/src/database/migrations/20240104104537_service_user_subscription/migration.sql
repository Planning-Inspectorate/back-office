/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceUserId,caseReference]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceUserId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_emailAddress_caseReference_key];

-- Create ServiceUser rows for subscriptions where they don't already exist
INSERT INTO [dbo].[ServiceUser] ([email])
SELECT DISTINCT ([s].[emailAddress]) FROM [dbo].[Subscription] s
WHERE NOT EXISTS (
  SELECT [email] FROM [dbo].[ServiceUser] WHERE [email] = [s].[emailAddress]
);

UPDATE s
SET s.serviceUserId = su.id
FROM [dbo].[Subscription] s
JOIN [dbo].[ServiceUser] su ON su.email = s.emailAddress;

ALTER TABLE [dbo].[Subscription] ALTER COLUMN [serviceUserId] INT NOT NULL;

-- CreateIndex
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_serviceUserId_caseReference_key] UNIQUE NONCLUSTERED ([serviceUserId], [caseReference]);

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_serviceUserId_fkey] FOREIGN KEY ([serviceUserId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE [dbo].[Subscription] DROP COLUMN [emailAddress];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

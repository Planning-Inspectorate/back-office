/*
	This migration normmalises the 'emailAddress' column into a reference to the 'ServiceUser' table

	For now, the 'emailAddress' will remain in the table (as a precaution), but will no longer be available in the model.

	Immediately after this migration, a UNIQUE constraint will be added to [subscriberId, caseReference]

	We need to find all unique emails in the Subscription table and then insert service user records where a record with that email doesn't already exist.
*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex - we're re-adding this index after the data has been migrated
ALTER TABLE [dbo].[Subscription] DROP CONSTRAINT [Subscription_emailAddress_caseReference_key];

-- Firstly, create all of the service user records (where one doesn't already exist)
INSERT INTO [dbo].[ServiceUser] ([email])
SELECT DISTINCT([s].[emailAddress]) FROM [dbo].[Subscription] s
LEFT JOIN [ServiceUser] su ON s.emailAddress = su.email
WHERE su.email IS NULL;

-- Then, set the subscriberId for all Subscriptions
UPDATE s
SET s.subscriberId = su.id
FROM [dbo].[Subscription] s
JOIN [dbo].[ServiceUser] su ON su.email = s.emailAddress;

-- Now that we've seeded the columns, we can add the NOT NULL constraint
-- If this fails because of a null subscriberId then something has gone wrong (like maybe a newly inserted Subscription)
ALTER TABLE [dbo].[Subscription] ALTER COLUMN [subscriberId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_subscriberId_fkey] FOREIGN KEY ([subscriberId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

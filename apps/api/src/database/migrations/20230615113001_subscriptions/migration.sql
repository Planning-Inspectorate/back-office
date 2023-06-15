BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Subscription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [emailAddress] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [subscriptionType] NVARCHAR(1000) NOT NULL,
    [startDate] DATETIME2,
    [endDate] DATETIME2,
    [language] NVARCHAR(1000),
    [caseId] INT,
    CONSTRAINT [Subscription_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Subscription_emailAddress_caseReference_key] UNIQUE NONCLUSTERED ([emailAddress],[caseReference])
);

-- AddForeignKey
ALTER TABLE [dbo].[Subscription] ADD CONSTRAINT [Subscription_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

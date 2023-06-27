BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Subscription] (
    [id] INT NOT NULL IDENTITY(1,1),
    [emailAddress] NVARCHAR(1000) NOT NULL,
    [caseReference] NVARCHAR(1000) NOT NULL,
    [subscribedToAllUpdates] BIT NOT NULL CONSTRAINT [Subscription_subscribedToAllUpdates_df] DEFAULT 0,
    [subscribedToApplicationSubmitted] BIT NOT NULL CONSTRAINT [Subscription_subscribedToApplicationSubmitted_df] DEFAULT 0,
    [subscribedToApplicationDecided] BIT NOT NULL CONSTRAINT [Subscription_subscribedToApplicationDecided_df] DEFAULT 0,
    [subscribedToRegistrationOpen] BIT NOT NULL CONSTRAINT [Subscription_subscribedToRegistrationOpen_df] DEFAULT 0,
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

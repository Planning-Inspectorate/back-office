BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProjectUpdateNotificationLog] (
    [id] INT NOT NULL IDENTITY(1,1),
    [projectUpdateId] INT NOT NULL,
    [subscriptionId] INT NOT NULL,
    [entryDate] DATETIME2 NOT NULL,
    [emailSent] BIT NOT NULL,
    [functionInvocationId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ProjectUpdateNotificationLog_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

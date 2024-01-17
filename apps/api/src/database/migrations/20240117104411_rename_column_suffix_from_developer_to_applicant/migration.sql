BEGIN TRY

BEGIN TRAN;

EXEC sp_rename 'dbo.ApplicationDetails.notificationDateForEventsDeveloper', 'notificationDateForEventsApplicant', 'COLUMN';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

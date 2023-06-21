BEGIN TRY

BEGIN TRAN;

UPDATE [dbo].[RepresentationContact]
SET [dbo].[RepresentationContact].[isOver18] = ~[dbo].[RepresentationContact].[isOver18]

EXEC sp_rename 'dbo.RepresentationContact.isOver18', 'under18', 'COLUMN';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Update the S51 Advice folders to have default stage '0' set

*/
BEGIN TRY

BEGIN TRAN;

UPDATE [dbo].[Folder] SET stage = '0' WHERE [displayNameEn] = 'S51 advice';

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

	BOAS-1719 - correct folder 'Mail merge spreadsheet' to 'Mail merges'

	Sub folder name change:

	This script corrects those values in all existing records.
	To be run in all environments inc Prod

*/
BEGIN TRY

BEGIN TRAN;

	UPDATE [Folder] SET displayNameEn = 'Mail merges'
	WHERE displayNameEn = 'Mail merge spreadsheet'

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

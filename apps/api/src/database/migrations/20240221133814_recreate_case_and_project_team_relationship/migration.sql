BEGIN TRY

	BEGIN TRAN;

-- Remove ForeignKey if exist
	ALTER TABLE dbo.[ProjectTeam] DROP CONSTRAINT IF EXISTS [ProjectTeam_caseId_fkey];
-- AddForeignKey
	ALTER TABLE [dbo].[ProjectTeam] ADD CONSTRAINT [ProjectTeam_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

	COMMIT TRAN;

END TRY
BEGIN CATCH

	IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN;
		END;
	THROW

END CATCH

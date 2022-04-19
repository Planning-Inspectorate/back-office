BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealDetailsFromAppellant] ADD [appellantOwnsWholeSite] BIT,
[appellantOwnsWholeSiteDescription] NVARCHAR(1000),
[healthAndSafetyIssues] BIT,
[healthAndSafetyIsueesDescription] NVARCHAR(1000),
[siteVisibleFromPublicLandDescription] NVARCHAR(1000);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

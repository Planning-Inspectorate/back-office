/*
  Warnings:

  - You are about to drop the column `doesInspectorNeedToEnterSideDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `healthAndSafetyIsueesDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `sideVisibleFromPublicLandDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AppealDetailsFromAppellant] ADD [appellantOwnsWholeSite] BIT,
[appellantOwnsWholeSiteDescription] NVARCHAR(1000),
[healthAndSafetyIssues] BIT,
[healthAndSafetyIssuesDescription] NVARCHAR(1000),
[siteVisibleFromPublicLandDescription] NVARCHAR(1000);

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] DROP COLUMN [doesInspectorNeedToEnterSideDescription],
[healthAndSafetyIsueesDescription],
[sideVisibleFromPublicLandDescription];
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [doesInspectorNeedToEnterSiteDescription] NVARCHAR(1000),
[emergingDevelopmentPlanOrNeighbourhoodPlan] BIT,
[emergingDevelopmentPlanOrNeighbourhoodPlanDescription] NVARCHAR(1000),
[healthAndSafetyIssuesDescription] NVARCHAR(1000),
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

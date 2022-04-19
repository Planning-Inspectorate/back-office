/*
  Warnings:

  - You are about to drop the column `doesInspectorNeedToEnterSideDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `sideVisibleFromPublicLandDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] DROP COLUMN [doesInspectorNeedToEnterSideDescription],
[sideVisibleFromPublicLandDescription];
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [doesInspectorNeedToEnterSiteDescription] NVARCHAR(1000),
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

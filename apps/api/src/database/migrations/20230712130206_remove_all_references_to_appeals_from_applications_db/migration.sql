/*
  Warnings:

  - You are about to drop the `Appeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppealStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppealTimetable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppealType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Appellant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppellantCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppellantCaseIncompleteReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppellantCaseIncompleteReasonOnAppellantCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppellantCaseInvalidReason` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AppellantCaseInvalidReasonOnAppellantCase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DesignatedSite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DesignatedSitesOnLPAQuestionnaires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InspectorDecision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KnowledgeOfOtherLandowners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ListedBuildingDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LPANotificationMethods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LPANotificationMethodsOnLPAQuestionnaires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LPAQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlanningObligationStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcedureType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScheduleType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SiteVisit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValidationDecision` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ValidationOutcome` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_addressId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appealTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_appellantId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_linkedAppealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_otherAppealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Appeal] DROP CONSTRAINT [Appeal_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppealStatus] DROP CONSTRAINT [AppealStatus_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppealTimetable] DROP CONSTRAINT [AppealTimetable_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_appellantCaseIncompleteReasonId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_appellantCaseInvalidReasonId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_knowledgeOfOtherLandownersId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_planningObligationStatusId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCase] DROP CONSTRAINT [AppellantCase_validationOutcomeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] DROP CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] DROP CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseIncompleteReasonId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] DROP CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] DROP CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseInvalidReasonId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires] DROP CONSTRAINT [DesignatedSitesOnLPAQuestionnaires_designatedSiteId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires] DROP CONSTRAINT [DesignatedSitesOnLPAQuestionnaires_lpaQuestionnaireId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[InspectorDecision] DROP CONSTRAINT [InspectorDecision_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ListedBuildingDetails] DROP CONSTRAINT [ListedBuildingDetails_lpaQuestionnaireId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires] DROP CONSTRAINT [LPANotificationMethodsOnLPAQuestionnaires_lpaQuestionnaireId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires] DROP CONSTRAINT [LPANotificationMethodsOnLPAQuestionnaires_notificationMethodId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] DROP CONSTRAINT [LPAQuestionnaire_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] DROP CONSTRAINT [LPAQuestionnaire_procedureTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] DROP CONSTRAINT [LPAQuestionnaire_scheduleTypeId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ReviewQuestionnaire] DROP CONSTRAINT [ReviewQuestionnaire_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[SiteVisit] DROP CONSTRAINT [SiteVisit_appealId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ValidationDecision] DROP CONSTRAINT [ValidationDecision_appealId_fkey];

-- DropTable
DROP TABLE [dbo].[Appeal];

-- DropTable
DROP TABLE [dbo].[AppealStatus];

-- DropTable
DROP TABLE [dbo].[AppealTimetable];

-- DropTable
DROP TABLE [dbo].[AppealType];

-- DropTable
DROP TABLE [dbo].[Appellant];

-- DropTable
DROP TABLE [dbo].[AppellantCase];

-- DropTable
DROP TABLE [dbo].[AppellantCaseIncompleteReason];

-- DropTable
DROP TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase];

-- DropTable
DROP TABLE [dbo].[AppellantCaseInvalidReason];

-- DropTable
DROP TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase];

-- DropTable
DROP TABLE [dbo].[DesignatedSite];

-- DropTable
DROP TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires];

-- DropTable
DROP TABLE [dbo].[InspectorDecision];

-- DropTable
DROP TABLE [dbo].[KnowledgeOfOtherLandowners];

-- DropTable
DROP TABLE [dbo].[ListedBuildingDetails];

-- DropTable
DROP TABLE [dbo].[LPANotificationMethods];

-- DropTable
DROP TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires];

-- DropTable
DROP TABLE [dbo].[LPAQuestionnaire];

-- DropTable
DROP TABLE [dbo].[PlanningObligationStatus];

-- DropTable
DROP TABLE [dbo].[ProcedureType];

-- DropTable
DROP TABLE [dbo].[ReviewQuestionnaire];

-- DropTable
DROP TABLE [dbo].[ScheduleType];

-- DropTable
DROP TABLE [dbo].[SiteVisit];

-- DropTable
DROP TABLE [dbo].[ValidationDecision];

-- DropTable
DROP TABLE [dbo].[ValidationOutcome];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

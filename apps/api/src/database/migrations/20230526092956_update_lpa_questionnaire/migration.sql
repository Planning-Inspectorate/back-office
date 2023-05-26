/*
  Warnings:

  - You are about to drop the column `affectsListedBuilding` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `appealsInImmediateAreaBeingConsidered` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `doesInspectorNeedToAccessNeighboursLand` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `doesInspectorNeedToAccessNeighboursLandDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `doesInspectorNeedToEnterSite` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `doesInspectorNeedToEnterSiteDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `emergingDevelopmentPlanOrNeighbourhoodPlan` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `emergingDevelopmentPlanOrNeighbourhoodPlanDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `healthAndSafetyIssues` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `healthAndSafetyIssuesDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `inGreenBelt` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `inOrNearConservationArea` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `listedBuildingDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `siteVisibleFromPublicLand` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - You are about to drop the column `siteVisibleFromPublicLandDescription` on the `LPAQuestionnaire` table. All the data in the column will be lost.
  - Added the required column `procedureTypeId` to the `LPAQuestionnaire` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTypeId` to the `LPAQuestionnaire` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[LPAQuestionnaire] ALTER COLUMN [extraConditions] NVARCHAR(1000) NULL;
ALTER TABLE [dbo].[LPAQuestionnaire] DROP COLUMN [affectsListedBuilding],
[appealsInImmediateAreaBeingConsidered],
[doesInspectorNeedToAccessNeighboursLand],
[doesInspectorNeedToAccessNeighboursLandDescription],
[doesInspectorNeedToEnterSite],
[doesInspectorNeedToEnterSiteDescription],
[emergingDevelopmentPlanOrNeighbourhoodPlan],
[emergingDevelopmentPlanOrNeighbourhoodPlanDescription],
[healthAndSafetyIssues],
[healthAndSafetyIssuesDescription],
[inGreenBelt],
[inOrNearConservationArea],
[listedBuildingDescription],
[siteVisibleFromPublicLand],
[siteVisibleFromPublicLandDescription];
ALTER TABLE [dbo].[LPAQuestionnaire] ADD [communityInfrastructureLevyAdoptionDate] DATETIME2,
[developmentDescription] NVARCHAR(1000),
[doesAffectAListedBuilding] BIT,
[doesAffectAScheduledMonument] BIT,
[doesSiteHaveHealthAndSafetyIssues] BIT,
[doesSiteRequireInspectorAccess] BIT,
[hasCommunityInfrastructureLevy] BIT,
[hasCompletedAnEnvironmentalStatement] BIT,
[hasEmergingPlan] BIT,
[hasExtraConditions] BIT,
[hasOtherAppeals] BIT,
[hasProtectedSpecies] BIT,
[hasRepresentationsFromOtherParties] BIT,
[hasResponsesOrStandingAdviceToUpload] BIT,
[hasStatementOfCase] BIT,
[hasStatutoryConsultees] BIT,
[hasSupplementaryPlanningDocuments] BIT,
[hasTreePreservationOrder] BIT,
[healthAndSafetyDetails] NVARCHAR(1000),
[inCAOrrelatesToCA] BIT,
[includesScreeningOption] BIT,
[inquiryDays] INT,
[inspectorAccessDetails] NVARCHAR(1000),
[isCommunityInfrastructureLevyFormallyAdopted] BIT,
[isDevelopmentInOrNearDesignatedSites] BIT,
[isEnvironmentalStatementRequired] BIT,
[isGypsyOrTravellerSite] BIT,
[isListedBuilding] BIT,
[isPublicRightOfWay] BIT,
[isSensitiveArea] BIT,
[isSiteVisible] BIT,
[isTheSiteWithinAnAONB] BIT,
[meetsOrExceedsThresholdOrCriteriaInColumn2] BIT,
[procedureTypeId] INT NOT NULL,
[scheduleTypeId] INT NOT NULL,
[sensitiveAreaDetails] NVARCHAR(1000),
[siteWithinGreenBelt] BIT,
[statutoryConsulteesDetails] NVARCHAR(1000);

-- CreateTable
CREATE TABLE [dbo].[ProcedureType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ProcedureType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ProcedureType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[ScheduleType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ScheduleType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ScheduleType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DesignatedSite] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DesignatedSite_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DesignatedSite_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires] (
    [designatedSiteId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [DesignatedSitesOnLPAQuestionnaires_pkey] PRIMARY KEY CLUSTERED ([designatedSiteId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[LPANotificationMethods] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPANotificationMethods_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPANotificationMethods_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires] (
    [notificationMethodId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPANotificationMethodsOnLPAQuestionnaires_pkey] PRIMARY KEY CLUSTERED ([notificationMethodId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[ListedBuildingDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [lpaQuestionnaireId] INT,
    [grade] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [affectsListedBuilding] BIT NOT NULL CONSTRAINT [ListedBuildingDetails_affectsListedBuilding_df] DEFAULT 0,
    CONSTRAINT [ListedBuildingDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_procedureTypeId_fkey] FOREIGN KEY ([procedureTypeId]) REFERENCES [dbo].[ProcedureType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_scheduleTypeId_fkey] FOREIGN KEY ([scheduleTypeId]) REFERENCES [dbo].[ScheduleType]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires] ADD CONSTRAINT [DesignatedSitesOnLPAQuestionnaires_designatedSiteId_fkey] FOREIGN KEY ([designatedSiteId]) REFERENCES [dbo].[DesignatedSite]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DesignatedSitesOnLPAQuestionnaires] ADD CONSTRAINT [DesignatedSitesOnLPAQuestionnaires_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires] ADD CONSTRAINT [LPANotificationMethodsOnLPAQuestionnaires_notificationMethodId_fkey] FOREIGN KEY ([notificationMethodId]) REFERENCES [dbo].[LPANotificationMethods]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPANotificationMethodsOnLPAQuestionnaires] ADD CONSTRAINT [LPANotificationMethodsOnLPAQuestionnaires_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ListedBuildingDetails] ADD CONSTRAINT [ListedBuildingDetails_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

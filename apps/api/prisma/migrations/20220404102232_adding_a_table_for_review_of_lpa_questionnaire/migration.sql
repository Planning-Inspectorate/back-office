BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ReviewQuestionnaire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ReviewQuestionnaire_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [complete] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_complete_df] DEFAULT 0,
    [applicationPlanningOficersReportMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_applicationPlanningOficersReportMissingOrIncorrect_df] DEFAULT 0,
    [applicationPlansToReachDecisionMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_applicationPlansToReachDecisionMissingOrIncorrect_df] DEFAULT 0,
    [applicationPlansToReachDecisionMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect_df] DEFAULT 0,
    [policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesOtherRelevanPoliciesMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesOtherRelevanPoliciesMissingOrIncorrect_df] DEFAULT 0,
    [policiesOtherRelevanPoliciesMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesSupplementaryPlanningDocumentsMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesSupplementaryPlanningDocumentsMissingOrIncorrect_df] DEFAULT 0,
    [policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription] NVARCHAR(1000),
    [siteConservationAreaMapAndGuidanceMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_siteConservationAreaMapAndGuidanceMissingOrIncorrect_df] DEFAULT 0,
    [siteCconservationAreaMapAndGuidanceMissingOrIncorrectDescription] NVARCHAR(1000),
    [siteListedBuildingDescriptionMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_siteListedBuildingDescriptionMissingOrIncorrect_df] DEFAULT 0,
    [siteListedBuildingDescriptionMissingOrIncorrectDescription] NVARCHAR(1000),
    [thirdPartyApplicationNotificationMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyApplicationNotificationMissingOrIncorrect_df] DEFAULT 0,
    [thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses_df] DEFAULT 0,
    [thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice_df] DEFAULT 0,
    [thirdPartyApplicationPublicityMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyApplicationPublicityMissingOrIncorrect_df] DEFAULT 0,
    [thirdPartyRepresentationsMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyRepresentationsMissingOrIncorrect_df] DEFAULT 0,
    [thirdPartyRepresentationsMissingOrIncorrectDescription] NVARCHAR(1000),
    [thirdPartyAppealNotificationMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyAppealNotificationMissingOrIncorrect_df] DEFAULT 0,
    [thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses_df] DEFAULT 0,
    [thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice_df] DEFAULT 0,
    CONSTRAINT [ReviewQuestionnaire_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ReviewQuestionnaire] ADD CONSTRAINT [ReviewQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

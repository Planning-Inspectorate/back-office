BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Appeal] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Appeal_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Appeal_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [addressId] INT,
    [localPlanningDepartment] NVARCHAR(1000) NOT NULL,
    [planningApplicationReference] NVARCHAR(1000) NOT NULL,
    [startedAt] DATETIME2,
    [userId] INT,
    [appellantId] INT,
    [appealTypeId] INT,
    CONSTRAINT [Appeal_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Appeal_appellantId_key] UNIQUE NONCLUSTERED ([appellantId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [shorthand] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppealType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealType_type_key] UNIQUE NONCLUSTERED ([type]),
    CONSTRAINT [AppealType_shorthand_key] UNIQUE NONCLUSTERED ([shorthand])
);

-- CreateTable
CREATE TABLE [dbo].[AppealStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealStatus_status_df] DEFAULT 'received_appeal',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppealStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [AppealStatus_valid_df] DEFAULT 1,
    [appealId] INT NOT NULL,
    [subStateMachineName] NVARCHAR(1000),
    [compoundStateName] NVARCHAR(1000),
    CONSTRAINT [AppealStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Appellant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [agentName] NVARCHAR(1000),
    CONSTRAINT [Appellant_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealDetailsFromAppellant] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [siteVisibleFromPublicLand] BIT,
    [appellantOwnsWholeSite] BIT,
    [appellantOwnsWholeSiteDescription] NVARCHAR(1000),
    [healthAndSafetyIssues] BIT,
    [healthAndSafetyIssuesDescription] NVARCHAR(1000),
    [siteVisibleFromPublicLandDescription] NVARCHAR(1000),
    CONSTRAINT [AppealDetailsFromAppellant_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealDetailsFromAppellant_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[Case] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000),
    [modifiedAt] DATETIME2 NOT NULL CONSTRAINT [Case_modifiedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Case_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [description] NVARCHAR(1000),
    [publishedAt] DATETIME2,
    [title] NVARCHAR(1000),
    CONSTRAINT [Case_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceCustomer] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organisationName] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    [caseId] INT NOT NULL,
    CONSTRAINT [ServiceCustomer_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GridReference] (
    [id] INT NOT NULL IDENTITY(1,1),
    [easting] INT,
    [northing] INT,
    [caseId] INT NOT NULL,
    CONSTRAINT [GridReference_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [GridReference_caseId_key] UNIQUE NONCLUSTERED ([caseId])
);

-- CreateTable
CREATE TABLE [dbo].[CaseStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [CaseStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [CaseStatus_valid_df] DEFAULT 1,
    [subStateMachineName] NVARCHAR(1000),
    [compoundStateName] NVARCHAR(1000),
    [caseId] INT NOT NULL,
    CONSTRAINT [CaseStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ApplicationDetails] (
    [id] INT NOT NULL IDENTITY(1,1),
    [caseId] INT NOT NULL,
    [subSectorId] INT,
    [locationDescription] NVARCHAR(1000),
    [zoomLevelId] INT,
    [caseEmail] NVARCHAR(1000),
    [submissionAtInternal] DATETIME2,
    [submissionAtPublished] NVARCHAR(1000),
    CONSTRAINT [ApplicationDetails_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ApplicationDetails_caseId_key] UNIQUE NONCLUSTERED ([caseId])
);

-- CreateTable
CREATE TABLE [dbo].[RegionsOnApplicationDetails] (
    [applicationDetailsId] INT NOT NULL,
    [regionId] INT NOT NULL,
    CONSTRAINT [RegionsOnApplicationDetails_pkey] PRIMARY KEY CLUSTERED ([applicationDetailsId],[regionId])
);

-- CreateTable
CREATE TABLE [dbo].[Sector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [abbreviation] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Sector_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Sector_abbreviation_key] UNIQUE NONCLUSTERED ([abbreviation]),
    CONSTRAINT [Sector_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[SubSector] (
    [id] INT NOT NULL IDENTITY(1,1),
    [abbreviation] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    [sectorId] INT NOT NULL,
    CONSTRAINT [SubSector_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SubSector_abbreviation_key] UNIQUE NONCLUSTERED ([abbreviation]),
    CONSTRAINT [SubSector_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressLine1] NVARCHAR(1000),
    [addressLine2] NVARCHAR(1000),
    [postcode] NVARCHAR(1000),
    [county] NVARCHAR(1000),
    [town] NVARCHAR(1000),
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ValidationDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ValidationDecision_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [decision] NVARCHAR(1000) NOT NULL,
    [namesDoNotMatch] BIT NOT NULL CONSTRAINT [ValidationDecision_namesDoNotMatch_df] DEFAULT 0,
    [sensitiveInfo] BIT NOT NULL CONSTRAINT [ValidationDecision_sensitiveInfo_df] DEFAULT 0,
    [missingApplicationForm] BIT NOT NULL CONSTRAINT [ValidationDecision_missingApplicationForm_df] DEFAULT 0,
    [missingDecisionNotice] BIT NOT NULL CONSTRAINT [ValidationDecision_missingDecisionNotice_df] DEFAULT 0,
    [missingGroundsForAppeal] BIT NOT NULL CONSTRAINT [ValidationDecision_missingGroundsForAppeal_df] DEFAULT 0,
    [missingSupportingDocuments] BIT NOT NULL CONSTRAINT [ValidationDecision_missingSupportingDocuments_df] DEFAULT 0,
    [inflammatoryComments] BIT NOT NULL CONSTRAINT [ValidationDecision_inflammatoryComments_df] DEFAULT 0,
    [openedInError] BIT NOT NULL CONSTRAINT [ValidationDecision_openedInError_df] DEFAULT 0,
    [wrongAppealTypeUsed] BIT NOT NULL CONSTRAINT [ValidationDecision_wrongAppealTypeUsed_df] DEFAULT 0,
    [outOfTime] BIT NOT NULL CONSTRAINT [ValidationDecision_outOfTime_df] DEFAULT 0,
    [noRightOfAppeal] BIT NOT NULL CONSTRAINT [ValidationDecision_noRightOfAppeal_df] DEFAULT 0,
    [notAppealable] BIT NOT NULL CONSTRAINT [ValidationDecision_notAppealable_df] DEFAULT 0,
    [lPADeemedInvalid] BIT NOT NULL CONSTRAINT [ValidationDecision_lPADeemedInvalid_df] DEFAULT 0,
    [otherReasons] NVARCHAR(1000),
    [descriptionOfDevelopment] NVARCHAR(1000),
    CONSTRAINT [ValidationDecision_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [affectsListedBuilding] BIT,
    [listedBuildingDescription] NVARCHAR(1000),
    [extraConditions] BIT,
    [inGreenBelt] BIT,
    [inOrNearConservationArea] BIT,
    [siteVisibleFromPublicLand] BIT,
    [doesInspectorNeedToEnterSite] BIT,
    [doesInspectorNeedToAccessNeighboursLand] BIT,
    [doesInspectorNeedToAccessNeighboursLandDescription] NVARCHAR(1000),
    [healthAndSafetyIssues] BIT,
    [appealsInImmediateAreaBeingConsidered] NVARCHAR(1000),
    [receivedAt] DATETIME2,
    [sentAt] DATETIME2 NOT NULL CONSTRAINT [LPAQuestionnaire_sentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [doesInspectorNeedToEnterSiteDescription] NVARCHAR(1000),
    [emergingDevelopmentPlanOrNeighbourhoodPlan] BIT,
    [emergingDevelopmentPlanOrNeighbourhoodPlanDescription] NVARCHAR(1000),
    [healthAndSafetyIssuesDescription] NVARCHAR(1000),
    [siteVisibleFromPublicLandDescription] NVARCHAR(1000),
    CONSTRAINT [LPAQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaire_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[Region] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Region_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Region_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[ReviewQuestionnaire] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [ReviewQuestionnaire_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [complete] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_complete_df] DEFAULT 0,
    [applicationPlanningOfficersReportMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_applicationPlanningOfficersReportMissingOrIncorrect_df] DEFAULT 0,
    [applicationPlansToReachDecisionMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_applicationPlansToReachDecisionMissingOrIncorrect_df] DEFAULT 0,
    [applicationPlansToReachDecisionMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect_df] DEFAULT 0,
    [policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesOtherRelevantPoliciesMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesOtherRelevantPoliciesMissingOrIncorrect_df] DEFAULT 0,
    [policiesOtherRelevantPoliciesMissingOrIncorrectDescription] NVARCHAR(1000),
    [policiesSupplementaryPlanningDocumentsMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_policiesSupplementaryPlanningDocumentsMissingOrIncorrect_df] DEFAULT 0,
    [policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription] NVARCHAR(1000),
    [siteConservationAreaMapAndGuidanceMissingOrIncorrect] BIT NOT NULL CONSTRAINT [ReviewQuestionnaire_siteConservationAreaMapAndGuidanceMissingOrIncorrect_df] DEFAULT 0,
    [siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription] NVARCHAR(1000),
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
    CONSTRAINT [ReviewQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SiteVisit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [visitDate] DATETIME2 NOT NULL,
    [visitSlot] NVARCHAR(1000) NOT NULL,
    [visitType] NVARCHAR(1000),
    CONSTRAINT [SiteVisit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisit_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[InspectorDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [outcome] NVARCHAR(1000) NOT NULL,
    [decisionLetterFilename] NVARCHAR(1000),
    CONSTRAINT [InspectorDecision_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InspectorDecision_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [azureReference] INT,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_azureReference_key] UNIQUE NONCLUSTERED ([azureReference])
);

-- CreateTable
CREATE TABLE [dbo].[ZoomLevel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [displayOrder] INT NOT NULL,
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayNameCy] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [ZoomLevel_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ZoomLevel_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [ZoomLevel_displayOrder_key] UNIQUE NONCLUSTERED ([displayOrder])
);

-- CreateTable
CREATE TABLE [dbo].[Folder] (
    [id] INT NOT NULL IDENTITY(1,1),
    [displayNameEn] NVARCHAR(1000) NOT NULL,
    [displayOrder] INT,
    [parentFolderId] INT,
    [caseId] INT,
    CONSTRAINT [Folder_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Folder_caseId_displayNameEn_parentFolderId_key] UNIQUE NONCLUSTERED ([caseId],[displayNameEn],[parentFolderId])
);

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [guid] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [folderId] INT NOT NULL,
    [blobStorageContainer] NVARCHAR(1000),
    [blobStoragePath] NVARCHAR(1000),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Document_status_df] DEFAULT 'awaiting_upload',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Document_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [redacted] BIT NOT NULL CONSTRAINT [Document_redacted_df] DEFAULT 0,
    [fileSize] INT CONSTRAINT [Document_fileSize_df] DEFAULT 0,
    [fileType] NVARCHAR(1000),
    [isDeleted] BIT NOT NULL CONSTRAINT [Document_isDeleted_df] DEFAULT 0,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([guid]),
    CONSTRAINT [Document_name_folderId_key] UNIQUE NONCLUSTERED ([name],[folderId])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersion] (
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL CONSTRAINT [DocumentVersion_version_df] DEFAULT 1,
    [lastModified] DATETIME2,
    [documentType] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_documentType_df] DEFAULT '',
    [published] BIT NOT NULL CONSTRAINT [DocumentVersion_published_df] DEFAULT 0,
    [sourceSystem] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office',
    [origin] NVARCHAR(1000),
    [originalFilename] NVARCHAR(1000),
    [fileName] NVARCHAR(1000),
    [representative] NVARCHAR(1000),
    [description] NVARCHAR(1000),
    [owner] NVARCHAR(1000),
    [author] NVARCHAR(1000),
    [securityClassification] NVARCHAR(1000),
    [mime] NVARCHAR(1000),
    [horizonDataID] NVARCHAR(1000),
    [fileMD5] NVARCHAR(1000),
    [path] NVARCHAR(1000),
    [virusCheckStatus] NVARCHAR(1000),
    [size] INT,
    [stage] NVARCHAR(1000),
    [filter1] NVARCHAR(1000),
    [blobStorageContainer] NVARCHAR(1000),
    [dateCreated] DATETIME2 CONSTRAINT [DocumentVersion_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [datePublished] DATETIME2,
    [isDeleted] BIT NOT NULL CONSTRAINT [DocumentVersion_isDeleted_df] DEFAULT 0,
    [examinationRefNo] NVARCHAR(1000),
    [filter2] NVARCHAR(1000),
    [publishedStatus] NVARCHAR(1000) CONSTRAINT [DocumentVersion_publishedStatus_df] DEFAULT 'awaiting_upload',
    [redactedStatus] NVARCHAR(1000),
    [redacted] BIT NOT NULL CONSTRAINT [DocumentVersion_redacted_df] DEFAULT 0,
    [documentURI] NVARCHAR(1000),
    CONSTRAINT [DocumentVersion_pkey] PRIMARY KEY CLUSTERED ([documentGuid],[version])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [filter1] ON [dbo].[DocumentVersion]([filter1]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersion]([documentGuid]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appealTypeId_fkey] FOREIGN KEY ([appealTypeId]) REFERENCES [dbo].[AppealType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[Appellant]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealStatus] ADD CONSTRAINT [AppealStatus_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealDetailsFromAppellant] ADD CONSTRAINT [AppealDetailsFromAppellant_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceCustomer] ADD CONSTRAINT [ServiceCustomer_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceCustomer] ADD CONSTRAINT [ServiceCustomer_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GridReference] ADD CONSTRAINT [GridReference_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CaseStatus] ADD CONSTRAINT [CaseStatus_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_subSectorId_fkey] FOREIGN KEY ([subSectorId]) REFERENCES [dbo].[SubSector]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ApplicationDetails] ADD CONSTRAINT [ApplicationDetails_zoomLevelId_fkey] FOREIGN KEY ([zoomLevelId]) REFERENCES [dbo].[ZoomLevel]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] ADD CONSTRAINT [RegionsOnApplicationDetails_applicationDetailsId_fkey] FOREIGN KEY ([applicationDetailsId]) REFERENCES [dbo].[ApplicationDetails]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RegionsOnApplicationDetails] ADD CONSTRAINT [RegionsOnApplicationDetails_regionId_fkey] FOREIGN KEY ([regionId]) REFERENCES [dbo].[Region]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SubSector] ADD CONSTRAINT [SubSector_sectorId_fkey] FOREIGN KEY ([sectorId]) REFERENCES [dbo].[Sector]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ValidationDecision] ADD CONSTRAINT [ValidationDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ReviewQuestionnaire] ADD CONSTRAINT [ReviewQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Case]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_parentFolderId_fkey] FOREIGN KEY ([parentFolderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_folderId_fkey] FOREIGN KEY ([folderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

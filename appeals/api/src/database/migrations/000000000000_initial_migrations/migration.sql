BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Appeal] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Appeal_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Appeal_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [addressId] INT,
    [lpaId] INT NOT NULL,
    [planningApplicationReference] NVARCHAR(1000) NOT NULL,
    [startedAt] DATETIME2,
    [appellantId] INT,
    [agentId] INT,
    [appealTypeId] INT,
    [resubmitTypeId] INT,
    [transferredCaseId] NVARCHAR(1000),
    [dueDate] DATETIME2,
    [allocationId] INT,
    [caseOfficerUserId] INT,
    [inspectorUserId] INT,
    CONSTRAINT [Appeal_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Appeal_reference_key] UNIQUE NONCLUSTERED ([reference])
);

-- CreateTable
CREATE TABLE [dbo].[AppealRelationship] (
    [id] INT NOT NULL IDENTITY(1,1),
    [parentRef] NVARCHAR(1000) NOT NULL,
    [childRef] NVARCHAR(1000) NOT NULL,
    [parentId] INT,
    [childId] INT,
    [linkingDate] DATETIME2 NOT NULL CONSTRAINT [AppealRelationship_linkingDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AppealRelationship_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [type] NVARCHAR(1000) NOT NULL,
    [shorthand] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(1000),
    [enabled] BIT,
    CONSTRAINT [AppealType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealType_type_key] UNIQUE NONCLUSTERED ([type]),
    CONSTRAINT [AppealType_shorthand_key] UNIQUE NONCLUSTERED ([shorthand])
);

-- CreateTable
CREATE TABLE [dbo].[AppealTimetable] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [finalCommentReviewDate] DATETIME2,
    [issueDeterminationDate] DATETIME2,
    [lpaQuestionnaireDueDate] DATETIME2,
    [statementReviewDate] DATETIME2,
    [resubmitAppealTypeDate] DATETIME2,
    CONSTRAINT [AppealTimetable_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealTimetable_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [AppealStatus_status_df] DEFAULT 'assign_case_officer',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AppealStatus_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [valid] BIT NOT NULL CONSTRAINT [AppealStatus_valid_df] DEFAULT 1,
    [appealId] INT NOT NULL,
    [subStateMachineName] NVARCHAR(1000),
    [compoundStateName] NVARCHAR(1000),
    CONSTRAINT [AppealStatus_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppealAllocation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [level] NVARCHAR(1000) NOT NULL,
    [band] INT NOT NULL,
    CONSTRAINT [AppealAllocation_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppealAllocation_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[AppealSpecialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [specialismId] INT NOT NULL,
    [appealId] INT NOT NULL,
    CONSTRAINT [AppealSpecialism_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPA] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [lpaCode] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000),
    CONSTRAINT [LPA_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPA_lpaCode_key] UNIQUE NONCLUSTERED ([lpaCode])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCase] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [appellantCaseIncompleteReasonId] INT,
    [appellantCaseInvalidReasonId] INT,
    [appellantCaseValidationOutcomeId] INT,
    [knowledgeOfOtherLandownersId] INT,
    [planningObligationStatusId] INT,
    [applicantFirstName] NVARCHAR(1000),
    [applicantSurname] NVARCHAR(1000),
    [areAllOwnersKnown] BIT,
    [hasAdvertisedAppeal] BIT,
    [hasAttemptedToIdentifyOwners] BIT,
    [hasDesignAndAccessStatement] BIT,
    [hasHealthAndSafetyIssues] BIT,
    [hasNewPlansOrDrawings] BIT,
    [hasNewSupportingDocuments] BIT,
    [hasOtherTenants] BIT,
    [hasPlanningObligation] BIT,
    [hasSeparateOwnershipCertificate] BIT,
    [hasSubmittedDesignAndAccessStatement] BIT,
    [hasToldOwners] BIT,
    [hasToldTenants] BIT,
    [healthAndSafetyIssues] NVARCHAR(1000),
    [isAgriculturalHolding] BIT,
    [isAgriculturalHoldingTenant] BIT,
    [isAppellantNamedOnApplication] BIT,
    [isDevelopmentDescriptionStillCorrect] BIT,
    [isSiteFullyOwned] BIT,
    [isSitePartiallyOwned] BIT,
    [isSiteVisibleFromPublicRoad] BIT,
    [newDevelopmentDescription] NVARCHAR(1000),
    [visibilityRestrictions] NVARCHAR(1000),
    [decision] NVARCHAR(1000),
    [originalCaseDecisionDate] DATETIME2,
    [costsAppliedForIndicator] BIT,
    [inspectorAccessDetails] NVARCHAR(1000),
    CONSTRAINT [AppellantCase_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCase_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[ServiceUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [organisationName] NVARCHAR(1000),
    [firstName] NVARCHAR(1000),
    [middleName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [addressId] INT,
    CONSTRAINT [ServiceUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressLine1] NVARCHAR(1000),
    [addressLine2] NVARCHAR(1000),
    [postcode] NVARCHAR(1000),
    [addressCounty] NVARCHAR(1000),
    [addressTown] NVARCHAR(1000),
    [addressCountry] NVARCHAR(1000),
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
    [lpaQuestionnaireValidationOutcomeId] INT,
    [procedureTypeId] INT,
    [scheduleTypeId] INT,
    [communityInfrastructureLevyAdoptionDate] DATETIME2,
    [developmentDescription] NVARCHAR(1000),
    [doesAffectAListedBuilding] BIT,
    [doesAffectAScheduledMonument] BIT,
    [doesSiteHaveHealthAndSafetyIssues] BIT,
    [doesSiteRequireInspectorAccess] BIT,
    [extraConditions] NVARCHAR(1000),
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
    [isAffectingNeighbouringSites] BIT,
    [isCommunityInfrastructureLevyFormallyAdopted] BIT,
    [isConservationArea] BIT,
    [isCorrectAppealType] BIT,
    [isDevelopmentInOrNearDesignatedSites] BIT,
    [isGypsyOrTravellerSite] BIT,
    [isListedBuilding] BIT,
    [isPublicRightOfWay] BIT,
    [isSensitiveArea] BIT,
    [isSiteVisible] BIT,
    [isTheSiteWithinAnAONB] BIT,
    [meetsOrExceedsThresholdOrCriteriaInColumn2] BIT,
    [receivedAt] DATETIME2,
    [isEnvironmentalStatementRequired] BIT,
    [sensitiveAreaDetails] NVARCHAR(1000),
    [sentAt] DATETIME2 NOT NULL CONSTRAINT [LPAQuestionnaire_sentAt_df] DEFAULT CURRENT_TIMESTAMP,
    [siteWithinGreenBelt] BIT,
    [statutoryConsulteesDetails] NVARCHAR(1000),
    CONSTRAINT [LPAQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaire_appealId_key] UNIQUE NONCLUSTERED ([appealId])
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
    [siteVisitTypeId] INT,
    [visitDate] DATETIME2,
    [visitStartTime] NVARCHAR(1000),
    [visitEndTime] NVARCHAR(1000),
    CONSTRAINT [SiteVisit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisit_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[InspectorDecision] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [outcome] NVARCHAR(1000) NOT NULL,
    [decisionLetterGuid] NVARCHAR(1000),
    [invalidDecisionReason] NVARCHAR(1000),
    CONSTRAINT [InspectorDecision_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [InspectorDecision_appealId_key] UNIQUE NONCLUSTERED ([appealId])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [azureAdUserId] NVARCHAR(1000),
    [sapId] NVARCHAR(1000),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_azureAdUserId_key] UNIQUE NONCLUSTERED ([azureAdUserId])
);

-- CreateTable
CREATE TABLE [dbo].[Folder] (
    [id] INT NOT NULL IDENTITY(1,1),
    [path] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    CONSTRAINT [Folder_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Folder_caseId_path_key] UNIQUE NONCLUSTERED ([caseId],[path])
);

-- CreateTable
CREATE TABLE [dbo].[Document] (
    [guid] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [folderId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Document_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [isDeleted] BIT NOT NULL CONSTRAINT [Document_isDeleted_df] DEFAULT 0,
    [latestVersionId] INT,
    [caseId] INT NOT NULL,
    CONSTRAINT [Document_pkey] PRIMARY KEY CLUSTERED ([guid]),
    CONSTRAINT [Document_name_folderId_key] UNIQUE NONCLUSTERED ([name],[folderId]),
    CONSTRAINT [Document_guid_latestVersionId_key] UNIQUE NONCLUSTERED ([guid],[latestVersionId])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersion] (
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [lastModified] DATETIME2,
    [documentType] NVARCHAR(1000),
    [published] BIT NOT NULL CONSTRAINT [DocumentVersion_published_df] DEFAULT 0,
    [draft] BIT NOT NULL CONSTRAINT [DocumentVersion_draft_df] DEFAULT 1,
    [sourceSystem] NVARCHAR(1000) NOT NULL CONSTRAINT [DocumentVersion_sourceSystem_df] DEFAULT 'back-office-appeals',
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
    [virusCheckStatus] NVARCHAR(1000) CONSTRAINT [DocumentVersion_virusCheckStatus_df] DEFAULT 'not_checked',
    [size] INT,
    [stage] NVARCHAR(1000),
    [blobStorageContainer] NVARCHAR(1000),
    [blobStoragePath] NVARCHAR(1000),
    [dateCreated] DATETIME2 CONSTRAINT [DocumentVersion_dateCreated_df] DEFAULT CURRENT_TIMESTAMP,
    [datePublished] DATETIME2,
    [dateReceived] DATETIME2,
    [isDeleted] BIT NOT NULL CONSTRAINT [DocumentVersion_isDeleted_df] DEFAULT 0,
    [isLateEntry] BIT,
    [redactionStatusId] INT,
    [redacted] BIT NOT NULL CONSTRAINT [DocumentVersion_redacted_df] DEFAULT 0,
    [documentURI] NVARCHAR(1000),
    CONSTRAINT [DocumentVersion_pkey] PRIMARY KEY CLUSTERED ([documentGuid],[version])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentVersionAudit] (
    [id] INT NOT NULL IDENTITY(1,1),
    [documentGuid] NVARCHAR(1000) NOT NULL,
    [version] INT NOT NULL,
    [auditTrailId] INT NOT NULL,
    [action] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentVersionAudit_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentVersionAudit_auditTrailId_key] UNIQUE NONCLUSTERED ([auditTrailId])
);

-- CreateTable
CREATE TABLE [dbo].[Representation] (
    [id] INT NOT NULL IDENTITY(1,1),
    [reference] NVARCHAR(1000) NOT NULL,
    [caseId] INT NOT NULL,
    [status] NVARCHAR(1000) NOT NULL,
    [originalRepresentation] NTEXT NOT NULL,
    [redactedRepresentation] NTEXT,
    [redacted] BIT NOT NULL CONSTRAINT [Representation_redacted_df] DEFAULT 0,
    [userId] INT,
    [received] DATETIME2,
    [type] NVARCHAR(1000),
    CONSTRAINT [Representation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationContact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [firstName] NVARCHAR(1000),
    [lastName] NVARCHAR(1000),
    [jobTitle] NVARCHAR(1000),
    [under18] BIT,
    [type] NVARCHAR(1000),
    [organisationName] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [phoneNumber] NVARCHAR(1000),
    [contactMethod] NVARCHAR(1000),
    [addressId] INT,
    CONSTRAINT [RepresentationContact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationAction] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [type] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [previousStatus] NVARCHAR(1000),
    [redactStatus] BIT,
    [previousRedactStatus] BIT,
    [invalidReason] NVARCHAR(1000),
    [referredTo] NVARCHAR(1000),
    [actionBy] NVARCHAR(1000) NOT NULL,
    [actionDate] DATETIME2 NOT NULL,
    [notes] NTEXT,
    CONSTRAINT [RepresentationAction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[RepresentationAttachment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [representationId] INT NOT NULL,
    [documentGuid] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [RepresentationAttachment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RepresentationAttachment_documentGuid_key] UNIQUE NONCLUSTERED ([documentGuid])
);

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
    [listEntry] NVARCHAR(1000),
    [affectsListedBuilding] BIT NOT NULL CONSTRAINT [ListedBuildingDetails_affectsListedBuilding_df] DEFAULT 0,
    CONSTRAINT [ListedBuildingDetails_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[PlanningObligationStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [PlanningObligationStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PlanningObligationStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[KnowledgeOfOtherLandowners] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [KnowledgeOfOtherLandowners_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [KnowledgeOfOtherLandowners_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AppellantCaseValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseIncompleteReason_hasText_df] DEFAULT 0,
    CONSTRAINT [AppellantCaseIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [AppellantCaseInvalidReason_hasText_df] DEFAULT 0,
    CONSTRAINT [AppellantCaseInvalidReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AppellantCaseInvalidReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] (
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_pkey] PRIMARY KEY CLUSTERED ([appellantCaseIncompleteReasonId],[appellantCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] (
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_pkey] PRIMARY KEY CLUSTERED ([appellantCaseInvalidReasonId],[appellantCaseId])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireValidationOutcome] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [LPAQuestionnaireValidationOutcome_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireValidationOutcome_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReason] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [hasText] BIT NOT NULL CONSTRAINT [LPAQuestionnaireIncompleteReason_hasText_df] DEFAULT 0,
    CONSTRAINT [LPAQuestionnaireIncompleteReason_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [LPAQuestionnaireIncompleteReason_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] (
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_pkey] PRIMARY KEY CLUSTERED ([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId])
);

-- CreateTable
CREATE TABLE [dbo].[NeighbouringSiteContact] (
    [id] INT NOT NULL IDENTITY(1,1),
    [addressId] INT,
    [lpaQuestionnaireId] INT,
    [firstName] NVARCHAR(1000) NOT NULL,
    [lastName] NVARCHAR(1000),
    [telephone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [NeighbouringSiteContact_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SiteVisitType] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [SiteVisitType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [SiteVisitType_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Specialism] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Specialism_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Specialism_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseIncompleteReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[AppellantCaseInvalidReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [appellantCaseInvalidReasonId] INT NOT NULL,
    [appellantCaseId] INT NOT NULL,
    CONSTRAINT [AppellantCaseInvalidReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [lpaQuestionnaireIncompleteReasonId] INT NOT NULL,
    [lpaQuestionnaireId] INT NOT NULL,
    CONSTRAINT [LPAQuestionnaireIncompleteReasonText_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DocumentRedactionStatus] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [DocumentRedactionStatus_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [DocumentRedactionStatus_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AuditTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [appealId] INT NOT NULL,
    [userId] INT NOT NULL,
    [loggedAt] DATETIME2 NOT NULL,
    [details] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [AuditTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_lpa] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_lpa_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [documentGuid] ON [dbo].[DocumentVersion]([documentGuid]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [reference] ON [dbo].[Representation]([reference]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_lpa_B_index] ON [dbo].[_lpa]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appealTypeId_fkey] FOREIGN KEY ([appealTypeId]) REFERENCES [dbo].[AppealType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_appellantId_fkey] FOREIGN KEY ([appellantId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_lpaId_fkey] FOREIGN KEY ([lpaId]) REFERENCES [dbo].[LPA]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_caseOfficerUserId_fkey] FOREIGN KEY ([caseOfficerUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Appeal] ADD CONSTRAINT [Appeal_inspectorUserId_fkey] FOREIGN KEY ([inspectorUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppealTimetable] ADD CONSTRAINT [AppealTimetable_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealStatus] ADD CONSTRAINT [AppealStatus_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealAllocation] ADD CONSTRAINT [AppealAllocation_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppealSpecialism] ADD CONSTRAINT [AppealSpecialism_specialismId_fkey] FOREIGN KEY ([specialismId]) REFERENCES [dbo].[Specialism]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_knowledgeOfOtherLandownersId_fkey] FOREIGN KEY ([knowledgeOfOtherLandownersId]) REFERENCES [dbo].[KnowledgeOfOtherLandowners]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_planningObligationStatusId_fkey] FOREIGN KEY ([planningObligationStatusId]) REFERENCES [dbo].[PlanningObligationStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseValidationOutcomeId_fkey] FOREIGN KEY ([appellantCaseValidationOutcomeId]) REFERENCES [dbo].[AppellantCaseValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseInvalidReasonId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId]) REFERENCES [dbo].[AppellantCaseInvalidReason]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCase] ADD CONSTRAINT [AppellantCase_appellantCaseIncompleteReasonId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId]) REFERENCES [dbo].[AppellantCaseIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ServiceUser] ADD CONSTRAINT [ServiceUser_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ValidationDecision] ADD CONSTRAINT [ValidationDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_procedureTypeId_fkey] FOREIGN KEY ([procedureTypeId]) REFERENCES [dbo].[ProcedureType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_scheduleTypeId_fkey] FOREIGN KEY ([scheduleTypeId]) REFERENCES [dbo].[ScheduleType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaire_lpaQuestionnaireValidationOutcomeId_fkey] FOREIGN KEY ([lpaQuestionnaireValidationOutcomeId]) REFERENCES [dbo].[LPAQuestionnaireValidationOutcome]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ReviewQuestionnaire] ADD CONSTRAINT [ReviewQuestionnaire_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SiteVisit] ADD CONSTRAINT [SiteVisit_siteVisitTypeId_fkey] FOREIGN KEY ([siteVisitTypeId]) REFERENCES [dbo].[SiteVisitType]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InspectorDecision] ADD CONSTRAINT [InspectorDecision_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Folder] ADD CONSTRAINT [Folder_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_folderId_fkey] FOREIGN KEY ([folderId]) REFERENCES [dbo].[Folder]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_guid_latestVersionId_fkey] FOREIGN KEY ([guid], [latestVersionId]) REFERENCES [dbo].[DocumentVersion]([documentGuid],[version]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Document] ADD CONSTRAINT [Document_caseId_fkey] FOREIGN KEY ([caseId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersion] ADD CONSTRAINT [DocumentVersion_redactionStatusId_fkey] FOREIGN KEY ([redactionStatusId]) REFERENCES [dbo].[DocumentRedactionStatus]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_auditTrailId_fkey] FOREIGN KEY ([auditTrailId]) REFERENCES [dbo].[AuditTrail]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[DocumentVersionAudit] ADD CONSTRAINT [DocumentVersionAudit_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Representation] ADD CONSTRAINT [Representation_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationContact] ADD CONSTRAINT [RepresentationContact_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAction] ADD CONSTRAINT [RepresentationAction_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_representationId_fkey] FOREIGN KEY ([representationId]) REFERENCES [dbo].[Representation]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RepresentationAttachment] ADD CONSTRAINT [RepresentationAttachment_documentGuid_fkey] FOREIGN KEY ([documentGuid]) REFERENCES [dbo].[Document]([guid]) ON DELETE NO ACTION ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseIncompleteReasonId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId]) REFERENCES [dbo].[AppellantCaseIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseIncompleteReasonOnAppellantCase_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseInvalidReasonId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId]) REFERENCES [dbo].[AppellantCaseInvalidReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonOnAppellantCase] ADD CONSTRAINT [AppellantCaseInvalidReasonOnAppellantCase_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseId]) REFERENCES [dbo].[AppellantCase]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_lpaQuestionnaireIncompleteReasonId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReason]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSiteContact] ADD CONSTRAINT [NeighbouringSiteContact_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaire]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[NeighbouringSiteContact] ADD CONSTRAINT [NeighbouringSiteContact_addressId_fkey] FOREIGN KEY ([addressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseIncompleteReasonText] ADD CONSTRAINT [AppellantCaseIncompleteReasonText_appellantCaseIncompleteReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseIncompleteReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseIncompleteReasonOnAppellantCase]([appellantCaseIncompleteReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AppellantCaseInvalidReasonText] ADD CONSTRAINT [AppellantCaseInvalidReasonText_appellantCaseInvalidReasonId_appellantCaseId_fkey] FOREIGN KEY ([appellantCaseInvalidReasonId], [appellantCaseId]) REFERENCES [dbo].[AppellantCaseInvalidReasonOnAppellantCase]([appellantCaseInvalidReasonId],[appellantCaseId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[LPAQuestionnaireIncompleteReasonText] ADD CONSTRAINT [LPAQuestionnaireIncompleteReasonText_lpaQuestionnaireIncompleteReasonId_lpaQuestionnaireId_fkey] FOREIGN KEY ([lpaQuestionnaireIncompleteReasonId], [lpaQuestionnaireId]) REFERENCES [dbo].[LPAQuestionnaireIncompleteReasonOnLPAQuestionnaire]([lpaQuestionnaireIncompleteReasonId],[lpaQuestionnaireId]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_appealId_fkey] FOREIGN KEY ([appealId]) REFERENCES [dbo].[Appeal]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_lpa] ADD CONSTRAINT [_lpa_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[LPA]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_lpa] ADD CONSTRAINT [_lpa_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[ServiceUser]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH


const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppeal');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASAppeal]
            @json VARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @recommendedSiteVisitTypeId INT,
            @siteVisitTypeId INT,
            @caseOfficerFirstName NVARCHAR(64),
            @caseOfficerSurname NVARCHAR(64),
            @caseOfficerId CHAR(36),
            @LpaQuestionnaireReviewOutcomeId INT,
            @LpaIncompleteReasons NVARCHAR(4000),
            @validationOfficerFirstName NVARCHAR(64),
            @validationOfficerSurname NVARCHAR(64),
            @validationOfficerId CHAR(36),
            @validationOutcomeId INT,
            @invalidReasonOtherDetails NVARCHAR(4000),
            @invalidAppealReasons NVARCHAR(4000),
            @inspectorFirstName NVARCHAR(64),
            @inspectorSurname NVARCHAR(64),
            @inspectorId CHAR(36),
            @inspectorSpecialismId INT,
            @scheduledSiteVisitDate DATETIME2,
            @decisionOutcomeId INT,
            @decisionLetterId CHAR(36),
            @decisionDate DATETIME2,
            @descriptionDevelopment NVARCHAR(4000),
            @caseOfficerEmail NVARCHAR(255),
            @inspectorEmail NVARCHAR(255),
            @validationOfficerEmail NVARCHAR(255),
            @appealStartDate DATETIME2,
            @appealValidationDate DATETIME2,
            @questionnaireDueDate DATETIME2,
            @appealValidDate DATETIME2,
            @missingOrWrongReasons NVARCHAR(4000),
            @missingOrWrongDocuments NVARCHAR(4000),
            @missingOrWrongOtherReason NVARCHAR(4000)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')

            SELECT
                @recommendedSiteVisitTypeId = RecommendedSiteVisitTypeID,
                @siteVisitTypeId = SiteVisitTypeID,
                @caseOfficerFirstName = CaseOfficerFirstName,
                @caseOfficerSurname = CaseOfficerSurname,
                @caseOfficerId = CaseOfficerID,
                @lpaQuestionnaireReviewOutcomeId = LPAQuestionnaireReviewOutcomeID,
                @lpaIncompleteReasons = LPAIncompleteReasons,
                @validationOfficerFirstName = ValidationOfficerFirstName,
                @validationOfficerSurname = ValidationOfficerSurname, 
                @validationOfficerId = ValidationOfficerID,
                @validationOutcomeId = ValidationOutcomeID,
                @invalidReasonOtherDetails = InvalidReasonOtherDetails,
                @invalidAppealReasons = InvalidAppealReasons,
                @inspectorFirstName = InspectorFirstName,
                @inspectorSurname = InspectorSurname, 
                @inspectorId = InspectorID,
                @inspectorSpecialismId = InspectorSpecialismID,
                @scheduledSiteVisitDate = ScheduledSiteVisitDate,
                @decisionOutcomeId = DecisionOutcomeID,
                @decisionLetterId = DecisionLetterID,
                @decisionDate = DecisionDate,
                @descriptionDevelopment = DescriptionDevelopment,
                @caseOfficerEmail = CaseOfficerEmail,
                @inspectorEmail = InspectorEmail,
                @validationOfficerEmail = ValidationOfficerEmail,
                @appealStartDate = AppealStartDate,
                @appealValidationDate = AppealValidationDate,
                @questionnaireDueDate = QuestionnaireDueDate,
                @appealValidDate = AppealValidDate,
                @missingOrWrongReasons = MissingOrWrongReasons,
                @missingOrWrongDocuments = MissingOrWrongDocuments,
                @missingOrWrongOtherReason = MissingOrWrongOtherReason
            FROM HASAppeal (NOLOCK) 
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.recommendedSiteVisitTypeId') IS NOT NULL  
                SET @recommendedSiteVisitTypeId = JSON_VALUE(@json, '$.recommendedSiteVisitTypeId')

            IF JSON_VALUE(@json, '$.siteVisitTypeId') IS NOT NULL
              SET @siteVisitTypeId = JSON_VALUE(@json, '$.siteVisitTypeId')

            IF JSON_VALUE(@json, '$.caseOfficerFirstName') IS NOT NULL
              SET @caseOfficerFirstName = JSON_VALUE(@json, '$.caseOfficerFirstName')

            IF JSON_VALUE(@json, '$.caseOfficerSurname') IS NOT NULL
              SET @caseOfficerSurname = JSON_VALUE(@json, '$.caseOfficerSurname')

            IF JSON_VALUE(@json, '$.caseOfficerId') IS NOT NULL
              SET @caseOfficerId = JSON_VALUE(@json, '$.caseOfficerId')

            IF JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId') IS NOT NULL
              SET @lpaQuestionnaireReviewOutcomeId = JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId')

            IF JSON_VALUE(@json, '$.lpaIncompleteReasons') IS NOT NULL
              SET @lpaIncompleteReasons = JSON_VALUE(@json, '$.lpaIncompleteReasons')

            IF JSON_VALUE(@json, '$.validationOfficerFirstName') IS NOT NULL
              SET @validationOfficerFirstName = JSON_VALUE(@json, '$.validationOfficerFirstName')

            IF JSON_VALUE(@json, '$.validationOfficerSurname') IS NOT NULL
              SET @validationOfficerSurname = JSON_VALUE(@json, '$.validationOfficerSurname')

            IF JSON_VALUE(@json, '$.validationOfficerId') IS NOT NULL
              SET @validationOfficerId = JSON_VALUE(@json, '$.validationOfficerId')

            IF JSON_VALUE(@json, '$.validationOutcomeId') IS NOT NULL
              SET @validationOutcomeId = JSON_VALUE(@json, '$.validationOutcomeId')

            IF JSON_VALUE(@json, '$.invalidReasonOtherDetails') IS NOT NULL
              SET @invalidReasonOtherDetails = JSON_VALUE(@json, '$.invalidReasonOtherDetails')

            IF JSON_VALUE(@json, '$.invalidAppealReasons') IS NOT NULL
              SET @invalidAppealReasons = JSON_VALUE(@json, '$.invalidAppealReasons')

            IF JSON_VALUE(@json, '$.inspectorFirstName') IS NOT NULL
              SET @inspectorFirstName = JSON_VALUE(@json, '$.inspectorFirstName')

            IF JSON_VALUE(@json, '$.inspectorSurname') IS NOT NULL
              SET @inspectorSurname = JSON_VALUE(@json, '$.inspectorSurname')

            IF JSON_VALUE(@json, '$.inspectorId') IS NOT NULL
              SET @inspectorId = JSON_VALUE(@json, '$.inspectorId')

            IF JSON_VALUE(@json, '$.inspectorSpecialismId') IS NOT NULL
              SET @inspectorSpecialismId = JSON_VALUE(@json, '$.inspectorSpecialismId')

            IF JSON_VALUE(@json, '$.scheduledSiteVisitDate') IS NOT NULL
              SET @scheduledSiteVisitDate = JSON_VALUE(@json, '$.scheduledSiteVisitDate')

            IF JSON_VALUE(@json, '$.decisionOutcomeId') IS NOT NULL
              SET @decisionOutcomeId = JSON_VALUE(@json, '$.decisionOutcomeId')

            IF JSON_VALUE(@json, '$.decisionLetterId') IS NOT NULL
              SET @decisionLetterId = JSON_VALUE(@json, '$.decisionLetterId')

            IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
              SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

            IF JSON_VALUE(@json, '$.descriptionDevelopment') IS NOT NULL
              SET @descriptionDevelopment = JSON_VALUE(@json, '$.descriptionDevelopment')

            IF JSON_VALUE(@json, '$.caseOfficerEmail') IS NOT NULL
              SET @caseOfficerEmail = JSON_VALUE(@json, '$.caseOfficerEmail')

            IF JSON_VALUE(@json, '$.inspectorEmail') IS NOT NULL
              SET @inspectorEmail = JSON_VALUE(@json, '$.inspectorEmail')

            IF JSON_VALUE(@json, '$.validationOfficerEmail') IS NOT NULL
              SET @validationOfficerEmail = JSON_VALUE(@json, '$.validationOfficerEmail')

            IF JSON_VALUE(@json, '$.appealStartDate') IS NOT NULL
              SET @appealStartDate = JSON_VALUE(@json, '$.appealStartDate')

            IF JSON_VALUE(@json, '$.appealValidationDate') IS NOT NULL
              SET @appealValidationDate = JSON_VALUE(@json, '$.appealValidationDate')

            IF JSON_VALUE(@json, '$.questionnaireDueDate') IS NOT NULL
              SET @questionnaireDueDate = JSON_VALUE(@json, '$.questionnaireDueDate')

            IF JSON_VALUE(@json, '$.appealValidDate') IS NOT NULL
              SET @appealValidDate = JSON_VALUE(@json, '$.appealValidDate')

            IF JSON_VALUE(@json, '$.missingOrWrongReasons') IS NOT NULL
              SET @missingOrWrongReasons = JSON_VALUE(@json, '$.missingOrWrongReasons')

            IF JSON_VALUE(@json, '$.missingOrWrongDocuments') IS NOT NULL
              SET @missingOrWrongDocuments = JSON_VALUE(@json, '$.missingOrWrongDocuments')

            IF JSON_VALUE(@json, '$.missingOrWrongOtherReason') IS NOT NULL
              SET @missingOrWrongOtherReason = JSON_VALUE(@json, '$.missingOrWrongOtherReason')

            INSERT INTO HASAppeal (
                ID,
                AppealID,
                RecommendedSiteVisitTypeID,
                SiteVisitTypeID,
                CaseOfficerFirstName,
                CaseOfficerSurname,
                CaseOfficerID,
                LPAQuestionnaireReviewOutcomeID,
                LPAIncompleteReasons,
                ValidationOfficerFirstName,
                ValidationOfficerSurname,
                ValidationOfficerID,
                ValidationOutcomeID,
                InvalidReasonOtherDetails,
                InvalidAppealReasons,
                InspectorFirstName,
                InspectorSurname,
                InspectorID,
                InspectorSpecialismID,
                ScheduledSiteVisitDate,
                DecisionOutcomeID,
                DecisionLetterID,
                DecisionDate,
                DescriptionDevelopment,
                CaseOfficerEmail,
                InspectorEmail,
                ValidationOfficerEmail,
                AppealStartDate,
                AppealValidationDate,
                QuestionnaireDueDate,
                AppealValidDate,
                MissingOrWrongReasons,
                MissingOrWrongDocuments,
                MissingOrWrongOtherReason
            )
            VALUES (
                newid(),
                @appealId,
                @recommendedSiteVisitTypeId,
                @siteVisitTypeId,
                @caseOfficerFirstName,
                @caseOfficerSurname,
                @caseOfficerId,
                @LpaQuestionnaireReviewOutcomeId,
                @LpaIncompleteReasons,
                @validationOfficerFirstName,
                @validationOfficerSurname,
                @validationOfficerId,
                @validationOutcomeId,
                @invalidReasonOtherDetails,
                @invalidAppealReasons,
                @inspectorFirstName,
                @inspectorSurname,
                @inspectorId,
                @inspectorSpecialismId,
                @scheduledSiteVisitDate,
                @decisionOutcomeId,
                @decisionLetterId,
                @decisionDate,
                @descriptionDevelopment,
                @caseOfficerEmail,
                @inspectorEmail,
                @validationOfficerEmail,
                @appealStartDate,
                @appealValidationDate,
                @questionnaireDueDate,
                @appealValidDate,
                @missingOrWrongReasons,
                @missingOrWrongDocuments,
                @missingOrWrongOtherReason
            );
        END
    `);

    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppealSubmission');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASAppealSubmission]
            @json NVARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @creatorEmailAddress NVARCHAR(255),
            @creatorName NVARCHAR(80),
            @creatorOriginalApplicant BIT,
            @creatorOnBehalfOf NVARCHAR(80),
            @originalApplicationNumber NVARCHAR(30),
            @siteOwnership BIT,
            @siteInformOwners BIT,
            @siteRestriction BIT,
            @siteRestrictionDetails NVARCHAR(255),
            @safetyConcern BIT,
            @safetyConcernDetails NVARCHAR(255),
            @sensitiveInformation BIT,
            @termsAgreed BIT,
            @decisionDate DATETIME,
            @submissionDate DATETIME,
            @eventUserId CHAR(36),
            @eventUserName NVARCHAR(256)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')
  
            SELECT
                @creatorEmailAddress = CreatorEmailAddress,
                @creatorName = CreatorName,
                @creatorOriginalApplicant = CreatorOriginalApplicant,
                @creatorOnBehalfOf = CreatorOnBehalfOf,
                @originalApplicationNumber = OriginalApplicationNumber,
                @siteOwnership = SiteOwnership,
                @siteInformOwners = SiteInformOwners,
                @siteRestriction = SiteRestriction,
                @siteRestrictionDetails = SiteRestrictionDetails,
                @safetyConcern = SafetyConcern,
                @safetyConcernDetails = SafetyConcernDetails,
                @sensitiveInformation = SensitiveInformation,
                @termsAgreed = TermsAgreed,
                @decisionDate = DecisionDate,
                @submissionDate = SubmissionDate,
                @eventUserId = EventUserID,
                @eventUserName = EventUserName
            FROM HASAppealSubmission (NOLOCK)
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.creatorEmailAddress') IS NOT NULL
                SET @creatorEmailAddress = JSON_VALUE(@json, '$.creatorEmailAddress')

            IF JSON_VALUE(@json, '$.creatorName') IS NOT NULL
                SET @creatorName = JSON_VALUE(@json, '$.creatorName')

            IF JSON_VALUE(@json, '$.creatorOriginalApplicant') IS NOT NULL
                SET @creatorOriginalApplicant = JSON_VALUE(@json, '$.creatorOriginalApplicant')

            IF JSON_VALUE(@json, '$.creatorOnBehalfOf') IS NOT NULL
                SET @creatorOnBehalfOf = JSON_VALUE(@json, '$.creatorOnBehalfOf')

            IF JSON_VALUE(@json, '$.originalApplicationNumber') IS NOT NULL
                SET @originalApplicationNumber = JSON_VALUE(@json, '$.originalApplicationNumber')

            IF JSON_VALUE(@json, '$.siteOwnership') IS NOT NULL
                SET @siteOwnership = JSON_VALUE(@json, '$.siteOwnership')

            IF JSON_VALUE(@json, '$.siteInformOwners') IS NOT NULL
                SET @siteInformOwners = JSON_VALUE(@json, '$.siteInformOwners')

            IF JSON_VALUE(@json, '$.siteRestriction') IS NOT NULL
                SET @siteRestriction = JSON_VALUE(@json, '$.siteRestriction')

            IF JSON_VALUE(@json, '$.siteRestrictionDetails') IS NOT NULL
                SET @siteRestrictionDetails = JSON_VALUE(@json, '$.siteRestrictionDetails')

            IF JSON_VALUE(@json, '$.safetyConcern') IS NOT NULL
                SET @safetyConcern = JSON_VALUE(@json, '$.safetyConcern')

            IF JSON_VALUE(@json, '$.safetyConcernDetails') IS NOT NULL
                SET @safetyConcernDetails = JSON_VALUE(@json, '$.safetyConcernDetails')

            IF JSON_VALUE(@json, '$.sensitiveInformation') IS NOT NULL
                SET @sensitiveInformation = JSON_VALUE(@json, '$.sensitiveInformation')

            IF JSON_VALUE(@json, '$.termsAgreed') IS NOT NULL
                SET @termsAgreed = JSON_VALUE(@json, '$.termsAgreed')

            IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
                SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

            IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
                SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

            IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
                SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

            IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
                SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

            INSERT INTO HASAppealSubmission (
                ID,
                AppealID,
                CreatorEmailAddress,
                CreatorName,
                CreatorOriginalApplicant,
                CreatorOnBehalfOf,
                OriginalApplicationNumber,
                SiteOwnership,
                SiteInformOwners,
                SiteRestriction,
                SiteRestrictionDetails,
                SafetyConcern,
                SafetyConcernDetails,
                SensitiveInformation,
                TermsAgreed,
                DecisionDate,
                SubmissionDate,
                EventUserID,
                EventUserName
            )
            VALUES (
                newid(),
                @appealId,
                @creatorEmailAddress,
                @creatorName,
                @creatorOriginalApplicant,
                @creatorOnBehalfOf,
                @originalApplicationNumber,
                @siteOwnership,
                @siteInformOwners,
                @siteRestriction,
                @siteRestrictionDetails,
                @safetyConcern,
                @safetyConcernDetails,
                @sensitiveInformation,
                @termsAgreed,
                @decisionDate,
                @submissionDate,
                @eventUserId,
                @eventUserName
            );
        END 
    `);

    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASLPASubmission');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASLPASubmission]
            @json NVARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @lpaQuestionnaireId CHAR(36),
            @submissionDate DATETIME2,
            @submissionAccuracy BIT,
            @submissionaccuracyDetails NVARCHAR(4000),
            @extraConditions BIT,
            @extraConditionsDetails NVARCHAR(4000),
            @adjacentAppeals BIT,
            @adjacentAppealsNumbers NVARCHAR(100),
            @cannotSeeLand BIT,
            @siteAccess BIT,
            @siteAccessDetails NVARCHAR(4000),
            @siteNeighbourAccess BIT,
            @siteNeighbourAccessDetails NVARCHAR(4000),
            @healthAndSafetyIssues BIT,
            @healthAndSafetyDetails NVARCHAR(4000),
            @affectListedBuilding BIT,
            @affectListedBuildingDetails NVARCHAR(4000),
            @greenBelt BIT,
            @conservationArea BIT,
            @originalPlanningApplicationPublicised BIT,
            @developmentNeighbourhoodPlanSubmitted BIT,
            @developmentNeighbourhoodPlanChanges NVARCHAR(4000),
            @eventUserId CHAR(36),
            @eventUserName NVARCHAR(256)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')

            SELECT
                @lpaQuestionnaireId = LPAQuestionnaireID,
                @submissionDate = SubmissionDate,
                @submissionAccuracy = SubmissionAccuracy,
                @submissionaccuracyDetails = SubmissionaccuracyDetails,
                @extraConditions = ExtraConditions,
                @extraConditionsDetails = ExtraConditionsDetails,
                @adjacentAppeals = AdjacentAppeals,
                @adjacentAppealsNumbers = AdjacentAppealsNumbers,
                @cannotSeeLand = CannotSeeLand,
                @siteAccess = SiteAccess,
                @siteAccessDetails = SiteAccessDetails,
                @siteNeighbourAccess = SiteNeighbourAccess,
                @siteNeighbourAccessDetails = SiteNeighbourAccessDetails,
                @healthAndSafetyIssues = HealthAndSafetyIssues,
                @healthAndSafetyDetails = HealthAndSafetyDetails,
                @affectListedBuilding = AffectListedBuilding,
                @affectListedBuildingDetails = AffectListedBuildingDetails,
                @greenBelt = GreenBelt,
                @conservationArea = ConservationArea,
                @originalPlanningApplicationPublicised = OriginalPlanningApplicationPublicised,
                @developmentNeighbourhoodPlanSubmitted = DevelopmentNeighbourhoodPlanSubmitted,
                @developmentNeighbourhoodPlanChanges = DevelopmentNeighbourhoodPlanChanges,
                @eventUserId = EventUserID,
                @eventUserName = EventUserName
            FROM HASLPASubmission (NOLOCK)
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.lpaQuestionnaireId') IS NOT NULL
                SET @lpaQuestionnaireId = JSON_VALUE(@json, '$.lpaQuestionnaireId')

            IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
                SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

            IF JSON_VALUE(@json, '$.submissionAccuracy') IS NOT NULL
                SET @submissionAccuracy = JSON_VALUE(@json, '$.submissionAccuracy')

            IF JSON_VALUE(@json, '$.submissionaccuracyDetails') IS NOT NULL
                SET @submissionaccuracyDetails = JSON_VALUE(@json, '$.submissionaccuracyDetails')

            IF JSON_VALUE(@json, '$.extraConditions') IS NOT NULL
                SET @extraConditions = JSON_VALUE(@json, '$.extraConditions')

            IF JSON_VALUE(@json, '$.extraConditionsDetails') IS NOT NULL
                SET @extraConditionsDetails = JSON_VALUE(@json, '$.extraConditionsDetails')

            IF JSON_VALUE(@json, '$.adjacentAppeals') IS NOT NULL
                SET @adjacentAppeals = JSON_VALUE(@json, '$.adjacentAppeals')

            IF JSON_VALUE(@json, '$.adjacentAppealsNumbers') IS NOT NULL
                SET @adjacentAppealsNumbers = JSON_VALUE(@json, '$.adjacentAppealsNumbers')

            IF JSON_VALUE(@json, '$.cannotSeeLand') IS NOT NULL
                SET @cannotSeeLand = JSON_VALUE(@json, '$.cannotSeeLand')

            IF JSON_VALUE(@json, '$.siteAccess') IS NOT NULL
                SET @siteAccess = JSON_VALUE(@json, '$.siteAccess')

            IF JSON_VALUE(@json, '$.siteAccessDetails') IS NOT NULL
                SET @siteAccessDetails = JSON_VALUE(@json, '$.siteAccessDetails')

            IF JSON_VALUE(@json, '$.siteNeighbourAccess') IS NOT NULL
                SET @siteNeighbourAccess = JSON_VALUE(@json, '$.siteNeighbourAccess')

            IF JSON_VALUE(@json, '$.siteNeighbourAccessDetails') IS NOT NULL
                SET @siteNeighbourAccessDetails = JSON_VALUE(@json, '$.siteNeighbourAccessDetails')

            IF JSON_VALUE(@json, '$.healthAndSafetyIssues') IS NOT NULL
                SET @healthAndSafetyIssues = JSON_VALUE(@json, '$.healthAndSafetyIssues')

            IF JSON_VALUE(@json, '$.healthAndSafetyDetails') IS NOT NULL
                SET @healthAndSafetyDetails = JSON_VALUE(@json, '$.healthAndSafetyDetails')

            IF JSON_VALUE(@json, '$.affectListedBuilding') IS NOT NULL
                SET @affectListedBuilding = JSON_VALUE(@json, '$.affectListedBuilding')

            IF JSON_VALUE(@json, '$.affectListedBuildingDetails') IS NOT NULL
                SET @affectListedBuildingDetails = JSON_VALUE(@json, '$.affectListedBuildingDetails')

            IF JSON_VALUE(@json, '$.greenBelt') IS NOT NULL
                SET @greenBelt = JSON_VALUE(@json, '$.greenBelt') 
  
            IF JSON_VALUE(@json, '$.conservationArea') IS NOT NULL
                SET @conservationArea = JSON_VALUE(@json, '$.conservationArea')

            IF JSON_VALUE(@json, '$.originalPlanningApplicationPublicised') IS NOT NULL
                SET @originalPlanningApplicationPublicised = JSON_VALUE(@json, '$.originalPlanningApplicationPublicised')

            IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted') IS NOT NULL
                SET @developmentNeighbourhoodPlanSubmitted = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted')

            IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges') IS NOT NULL
                SET @developmentNeighbourhoodPlanChanges = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges')

            IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
                SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

            IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
                SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

            INSERT INTO HASLPASubmission (
                ID,
                AppealID,
                LPAQuestionnaireID,
                SubmissionDate,
                SubmissionAccuracy,
                SubmissionaccuracyDetails,
                ExtraConditions,
                ExtraConditionsDetails,
                AdjacentAppeals,
                AdjacentAppealsNumbers,
                CannotSeeLand,
                SiteAccess,
                SiteAccessDetails,
                SiteNeighbourAccess,
                SiteNeighbourAccessDetails,
                HealthAndSafetyIssues,
                HealthAndSafetyDetails,
                AffectListedBuilding,
                AffectListedBuildingDetails,
                GreenBelt,
                ConservationArea,
                OriginalPlanningApplicationPublicised,
                DevelopmentNeighbourhoodPlanSubmitted,
                DevelopmentNeighbourhoodPlanChanges,
                EventUserID,
                EventUserName
            )
            VALUES (
                newid(),
                @appealId,
                @lpaQuestionnaireId,
                @submissionDate,
                @submissionAccuracy,
                @submissionaccuracyDetails,
                @extraConditions,
                @extraConditionsDetails,
                @adjacentAppeals,
                @adjacentAppealsNumbers,
                @cannotSeeLand,
                @siteAccess,
                @siteAccessDetails,
                @siteNeighbourAccess,
                @siteNeighbourAccessDetails,
                @healthAndSafetyIssues,
                @healthAndSafetyDetails,
                @affectListedBuilding,
                @affectListedBuildingDetails,
                @greenBelt,
                @conservationArea,
                @originalPlanningApplicationPublicised,
                @developmentNeighbourhoodPlanSubmitted,
                @developmentNeighbourhoodPlanChanges,
                @eventUserId,
                @eventUserName
            );
        END
    `);

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASAppeal]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASAppeal] ON [dbo].[HASAppeal]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[RecommendedSiteVisitTypeID],
                INSERTED.[SiteVisitTypeID],
                INSERTED.[CaseOfficerFirstName],
                INSERTED.[CaseOfficerSurname],
                INSERTED.[CaseOfficerID],
                INSERTED.[LPAQuestionnaireReviewOutcomeID],
                INSERTED.[LPAIncompleteReasons],
                INSERTED.[ValidationOfficerFirstName],
                INSERTED.[ValidationOfficerSurname],
                INSERTED.[ValidationOfficerID],
                INSERTED.[ValidationOutcomeID],
                INSERTED.[InvalidReasonOtherDetails],
                INSERTED.[InvalidAppealReasons],
                INSERTED.[InspectorFirstName],
                INSERTED.[InspectorSurname],
                INSERTED.[InspectorID],
                INSERTED.[InspectorSpecialismID],
                INSERTED.[ScheduledSiteVisitDate],
                INSERTED.[DecisionOutcomeID],
                INSERTED.[DecisionLetterID],
                INSERTED.[DecisionDate],
                INSERTED.[EventUserID],
                INSERTED.[EventUserName],
                INSERTED.[DescriptionDevelopment],
                INSERTED.[CaseOfficerEmail],
                INSERTED.[InspectorEmail],
                INSERTED.[ValidationOfficerEmail],
                INSERTED.[AppealStartDate],
                INSERTED.[AppealValidationDate],
                INSERTED.[AppealValidDate],
                INSERTED.[MissingOrWrongReasons],
                INSERTED.[MissingOrWrongDocuments],
                INSERTED.[MissingOrWrongOtherReason]) FROM INSERTED;

            UPDATE [HASAppeal]
            SET [LatestEvent] = 0
            WHERE [AppealID] = @AppealID
                AND [LatestEvent] = 1
                AND [ID] <> @ID;

            UPDATE [HASAppeal]
            SET [CheckSumRow] = @CheckSumRow, [EventDateTime] = GETDATE()
            WHERE [ID] = @ID;
        END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASAppeal] ENABLE TRIGGER [AfterInsertHASAppeal]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppeal');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASAppeal]
            @json VARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @recommendedSiteVisitTypeId INT,
            @siteVisitTypeId INT,
            @caseOfficerFirstName NVARCHAR(64),
            @caseOfficerSurname NVARCHAR(64),
            @caseOfficerId CHAR(36),
            @LpaQuestionnaireReviewOutcomeId INT,
            @LpaIncompleteReasons NVARCHAR(4000),
            @validationOfficerFirstName NVARCHAR(64),
            @validationOfficerSurname NVARCHAR(64),
            @validationOfficerId CHAR(36),
            @validationOutcomeId INT,
            @invalidReasonOtherDetails NVARCHAR(4000),
            @invalidAppealReasons NVARCHAR(4000),
            @inspectorFirstName NVARCHAR(64),
            @inspectorSurname NVARCHAR(64),
            @inspectorId CHAR(36),
            @inspectorSpecialismId INT,
            @scheduledSiteVisitDate DATE,
            @decisionOutcomeId INT,
            @decisionLetterId CHAR(36),
            @decisionDate DATE,
            @descriptionDevelopment NVARCHAR(4000),
            @caseOfficerEmail NVARCHAR(255),
            @inspectorEmail NVARCHAR(255),
            @validationOfficerEmail NVARCHAR(255),
            @appealStartDate DATE,
            @appealValidationDate DATE,
            @questionnaireDueDate DATE,
            @appealValidDate DATE,
            @missingOrWrongReasons NVARCHAR(4000),
            @missingOrWrongDocuments NVARCHAR(4000),
            @missingOrWrongOtherReason NVARCHAR(4000)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')

            SELECT
                @recommendedSiteVisitTypeId = RecommendedSiteVisitTypeID,
                @siteVisitTypeId = SiteVisitTypeID,
                @caseOfficerFirstName = CaseOfficerFirstName,
                @caseOfficerSurname = CaseOfficerSurname,
                @caseOfficerId = CaseOfficerID,
                @lpaQuestionnaireReviewOutcomeId = LPAQuestionnaireReviewOutcomeID,
                @lpaIncompleteReasons = LPAIncompleteReasons,
                @validationOfficerFirstName = ValidationOfficerFirstName,
                @validationOfficerSurname = ValidationOfficerSurname, 
                @validationOfficerId = ValidationOfficerID,
                @validationOutcomeId = ValidationOutcomeID,
                @invalidReasonOtherDetails = InvalidReasonOtherDetails,
                @invalidAppealReasons = InvalidAppealReasons,
                @inspectorFirstName = InspectorFirstName,
                @inspectorSurname = InspectorSurname, 
                @inspectorId = InspectorID,
                @inspectorSpecialismId = InspectorSpecialismID,
                @scheduledSiteVisitDate = ScheduledSiteVisitDate,
                @decisionOutcomeId = DecisionOutcomeID,
                @decisionLetterId = DecisionLetterID,
                @decisionDate = DecisionDate,
                @descriptionDevelopment = DescriptionDevelopment,
                @caseOfficerEmail = CaseOfficerEmail,
                @inspectorEmail = InspectorEmail,
                @validationOfficerEmail = ValidationOfficerEmail,
                @appealStartDate = AppealStartDate,
                @appealValidationDate = AppealValidationDate,
                @questionnaireDueDate = QuestionnaireDueDate,
                @appealValidDate = AppealValidDate,
                @missingOrWrongReasons = MissingOrWrongReasons,
                @missingOrWrongDocuments = MissingOrWrongDocuments,
                @missingOrWrongOtherReason = MissingOrWrongOtherReason
            FROM HASAppeal (NOLOCK) 
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.recommendedSiteVisitTypeId') IS NOT NULL  
                SET @recommendedSiteVisitTypeId = JSON_VALUE(@json, '$.recommendedSiteVisitTypeId')

            IF JSON_VALUE(@json, '$.siteVisitTypeId') IS NOT NULL
              SET @siteVisitTypeId = JSON_VALUE(@json, '$.siteVisitTypeId')

            IF JSON_VALUE(@json, '$.caseOfficerFirstName') IS NOT NULL
              SET @caseOfficerFirstName = JSON_VALUE(@json, '$.caseOfficerFirstName')

            IF JSON_VALUE(@json, '$.caseOfficerSurname') IS NOT NULL
              SET @caseOfficerSurname = JSON_VALUE(@json, '$.caseOfficerSurname')

            IF JSON_VALUE(@json, '$.caseOfficerId') IS NOT NULL
              SET @caseOfficerId = JSON_VALUE(@json, '$.caseOfficerId')

            IF JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId') IS NOT NULL
              SET @lpaQuestionnaireReviewOutcomeId = JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId')

            IF JSON_VALUE(@json, '$.lpaIncompleteReasons') IS NOT NULL
              SET @lpaIncompleteReasons = JSON_VALUE(@json, '$.lpaIncompleteReasons')

            IF JSON_VALUE(@json, '$.validationOfficerFirstName') IS NOT NULL
              SET @validationOfficerFirstName = JSON_VALUE(@json, '$.validationOfficerFirstName')

            IF JSON_VALUE(@json, '$.validationOfficerSurname') IS NOT NULL
              SET @validationOfficerSurname = JSON_VALUE(@json, '$.validationOfficerSurname')

            IF JSON_VALUE(@json, '$.validationOfficerId') IS NOT NULL
              SET @validationOfficerId = JSON_VALUE(@json, '$.validationOfficerId')

            IF JSON_VALUE(@json, '$.validationOutcomeId') IS NOT NULL
              SET @validationOutcomeId = JSON_VALUE(@json, '$.validationOutcomeId')

            IF JSON_VALUE(@json, '$.invalidReasonOtherDetails') IS NOT NULL
              SET @invalidReasonOtherDetails = JSON_VALUE(@json, '$.invalidReasonOtherDetails')

            IF JSON_VALUE(@json, '$.invalidAppealReasons') IS NOT NULL
              SET @invalidAppealReasons = JSON_VALUE(@json, '$.invalidAppealReasons')

            IF JSON_VALUE(@json, '$.inspectorFirstName') IS NOT NULL
              SET @inspectorFirstName = JSON_VALUE(@json, '$.inspectorFirstName')

            IF JSON_VALUE(@json, '$.inspectorSurname') IS NOT NULL
              SET @inspectorSurname = JSON_VALUE(@json, '$.inspectorSurname')

            IF JSON_VALUE(@json, '$.inspectorId') IS NOT NULL
              SET @inspectorId = JSON_VALUE(@json, '$.inspectorId')

            IF JSON_VALUE(@json, '$.inspectorSpecialismId') IS NOT NULL
              SET @inspectorSpecialismId = JSON_VALUE(@json, '$.inspectorSpecialismId')

            IF JSON_VALUE(@json, '$.scheduledSiteVisitDate') IS NOT NULL
              SET @scheduledSiteVisitDate = JSON_VALUE(@json, '$.scheduledSiteVisitDate')

            IF JSON_VALUE(@json, '$.decisionOutcomeId') IS NOT NULL
              SET @decisionOutcomeId = JSON_VALUE(@json, '$.decisionOutcomeId')

            IF JSON_VALUE(@json, '$.decisionLetterId') IS NOT NULL
              SET @decisionLetterId = JSON_VALUE(@json, '$.decisionLetterId')

            IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
              SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

            IF JSON_VALUE(@json, '$.descriptionDevelopment') IS NOT NULL
              SET @descriptionDevelopment = JSON_VALUE(@json, '$.descriptionDevelopment')

            IF JSON_VALUE(@json, '$.caseOfficerEmail') IS NOT NULL
              SET @caseOfficerEmail = JSON_VALUE(@json, '$.caseOfficerEmail')

            IF JSON_VALUE(@json, '$.inspectorEmail') IS NOT NULL
              SET @inspectorEmail = JSON_VALUE(@json, '$.inspectorEmail')

            IF JSON_VALUE(@json, '$.validationOfficerEmail') IS NOT NULL
              SET @validationOfficerEmail = JSON_VALUE(@json, '$.validationOfficerEmail')

            IF JSON_VALUE(@json, '$.appealStartDate') IS NOT NULL
              SET @appealStartDate = JSON_VALUE(@json, '$.appealStartDate')

            IF JSON_VALUE(@json, '$.appealValidationDate') IS NOT NULL
              SET @appealValidationDate = JSON_VALUE(@json, '$.appealValidationDate')

            IF JSON_VALUE(@json, '$.questionnaireDueDate') IS NOT NULL
              SET @questionnaireDueDate = JSON_VALUE(@json, '$.questionnaireDueDate')

            IF JSON_VALUE(@json, '$.appealValidDate') IS NOT NULL
              SET @appealValidDate = JSON_VALUE(@json, '$.appealValidDate')

            IF JSON_VALUE(@json, '$.missingOrWrongReasons') IS NOT NULL
              SET @missingOrWrongReasons = JSON_VALUE(@json, '$.missingOrWrongReasons')

            IF JSON_VALUE(@json, '$.missingOrWrongDocuments') IS NOT NULL
              SET @missingOrWrongDocuments = JSON_VALUE(@json, '$.missingOrWrongDocuments')

            IF JSON_VALUE(@json, '$.missingOrWrongOtherReason') IS NOT NULL
              SET @missingOrWrongOtherReason = JSON_VALUE(@json, '$.missingOrWrongOtherReason')

            INSERT INTO HASAppeal (
                ID,
                AppealID,
                RecommendedSiteVisitTypeID,
                SiteVisitTypeID,
                CaseOfficerFirstName,
                CaseOfficerSurname,
                CaseOfficerID,
                LPAQuestionnaireReviewOutcomeID,
                LPAIncompleteReasons,
                ValidationOfficerFirstName,
                ValidationOfficerSurname,
                ValidationOfficerID,
                ValidationOutcomeID,
                InvalidReasonOtherDetails,
                InvalidAppealReasons,
                InspectorFirstName,
                InspectorSurname,
                InspectorID,
                InspectorSpecialismID,
                ScheduledSiteVisitDate,
                DecisionOutcomeID,
                DecisionLetterID,
                DecisionDate,
                DescriptionDevelopment,
                CaseOfficerEmail,
                InspectorEmail,
                ValidationOfficerEmail,
                AppealStartDate,
                AppealValidationDate,
                QuestionnaireDueDate,
                AppealValidDate,
                MissingOrWrongReasons,
                MissingOrWrongDocuments,
                MissingOrWrongOtherReason
            )
            VALUES (
                newid(),
                @appealId,
                @recommendedSiteVisitTypeId,
                @siteVisitTypeId,
                @caseOfficerFirstName,
                @caseOfficerSurname,
                @caseOfficerId,
                @LpaQuestionnaireReviewOutcomeId,
                @LpaIncompleteReasons,
                @validationOfficerFirstName,
                @validationOfficerSurname,
                @validationOfficerId,
                @validationOutcomeId,
                @invalidReasonOtherDetails,
                @invalidAppealReasons,
                @inspectorFirstName,
                @inspectorSurname,
                @inspectorId,
                @inspectorSpecialismId,
                @scheduledSiteVisitDate,
                @decisionOutcomeId,
                @decisionLetterId,
                @decisionDate,
                @descriptionDevelopment,
                @caseOfficerEmail,
                @inspectorEmail,
                @validationOfficerEmail,
                @appealStartDate,
                @appealValidationDate,
                @questionnaireDueDate,
                @appealValidDate,
                @missingOrWrongReasons,
                @missingOrWrongDocuments,
                @missingOrWrongOtherReason
            );
        END
    `);

    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppealSubmission');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASAppealSubmission]
            @json NVARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @creatorEmailAddress NVARCHAR(255),
            @creatorName NVARCHAR(80),
            @creatorOriginalApplicant BIT,
            @creatorOnBehalfOf NVARCHAR(80),
            @originalApplicationNumber NVARCHAR(30),
            @siteOwnership BIT,
            @siteInformOwners BIT,
            @siteRestriction BIT,
            @siteRestrictionDetails NVARCHAR(255),
            @safetyConcern BIT,
            @safetyConcernDetails NVARCHAR(255),
            @sensitiveInformation BIT,
            @termsAgreed BIT,
            @decisionDate DATE,
            @submissionDate DATE,
            @eventUserId CHAR(36),
            @eventUserName NVARCHAR(256)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')
  
            SELECT
                @creatorEmailAddress = CreatorEmailAddress,
                @creatorName = CreatorName,
                @creatorOriginalApplicant = CreatorOriginalApplicant,
                @creatorOnBehalfOf = CreatorOnBehalfOf,
                @originalApplicationNumber = OriginalApplicationNumber,
                @siteOwnership = SiteOwnership,
                @siteInformOwners = SiteInformOwners,
                @siteRestriction = SiteRestriction,
                @siteRestrictionDetails = SiteRestrictionDetails,
                @safetyConcern = SafetyConcern,
                @safetyConcernDetails = SafetyConcernDetails,
                @sensitiveInformation = SensitiveInformation,
                @termsAgreed = TermsAgreed,
                @decisionDate = DecisionDate,
                @submissionDate = SubmissionDate,
                @eventUserId = EventUserID,
                @eventUserName = EventUserName
            FROM HASAppealSubmission (NOLOCK)
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.creatorEmailAddress') IS NOT NULL
                SET @creatorEmailAddress = JSON_VALUE(@json, '$.creatorEmailAddress')

            IF JSON_VALUE(@json, '$.creatorName') IS NOT NULL
                SET @creatorName = JSON_VALUE(@json, '$.creatorName')

            IF JSON_VALUE(@json, '$.creatorOriginalApplicant') IS NOT NULL
                SET @creatorOriginalApplicant = JSON_VALUE(@json, '$.creatorOriginalApplicant')

            IF JSON_VALUE(@json, '$.creatorOnBehalfOf') IS NOT NULL
                SET @creatorOnBehalfOf = JSON_VALUE(@json, '$.creatorOnBehalfOf')

            IF JSON_VALUE(@json, '$.originalApplicationNumber') IS NOT NULL
                SET @originalApplicationNumber = JSON_VALUE(@json, '$.originalApplicationNumber')

            IF JSON_VALUE(@json, '$.siteOwnership') IS NOT NULL
                SET @siteOwnership = JSON_VALUE(@json, '$.siteOwnership')

            IF JSON_VALUE(@json, '$.siteInformOwners') IS NOT NULL
                SET @siteInformOwners = JSON_VALUE(@json, '$.siteInformOwners')

            IF JSON_VALUE(@json, '$.siteRestriction') IS NOT NULL
                SET @siteRestriction = JSON_VALUE(@json, '$.siteRestriction')

            IF JSON_VALUE(@json, '$.siteRestrictionDetails') IS NOT NULL
                SET @siteRestrictionDetails = JSON_VALUE(@json, '$.siteRestrictionDetails')

            IF JSON_VALUE(@json, '$.safetyConcern') IS NOT NULL
                SET @safetyConcern = JSON_VALUE(@json, '$.safetyConcern')

            IF JSON_VALUE(@json, '$.safetyConcernDetails') IS NOT NULL
                SET @safetyConcernDetails = JSON_VALUE(@json, '$.safetyConcernDetails')

            IF JSON_VALUE(@json, '$.sensitiveInformation') IS NOT NULL
                SET @sensitiveInformation = JSON_VALUE(@json, '$.sensitiveInformation')

            IF JSON_VALUE(@json, '$.termsAgreed') IS NOT NULL
                SET @termsAgreed = JSON_VALUE(@json, '$.termsAgreed')

            IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
                SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

            IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
                SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

            IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
                SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

            IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
                SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

            INSERT INTO HASAppealSubmission (
                ID,
                AppealID,
                CreatorEmailAddress,
                CreatorName,
                CreatorOriginalApplicant,
                CreatorOnBehalfOf,
                OriginalApplicationNumber,
                SiteOwnership,
                SiteInformOwners,
                SiteRestriction,
                SiteRestrictionDetails,
                SafetyConcern,
                SafetyConcernDetails,
                SensitiveInformation,
                TermsAgreed,
                DecisionDate,
                SubmissionDate,
                EventUserID,
                EventUserName
            )
            VALUES (
                newid(),
                @appealId,
                @creatorEmailAddress,
                @creatorName,
                @creatorOriginalApplicant,
                @creatorOnBehalfOf,
                @originalApplicationNumber,
                @siteOwnership,
                @siteInformOwners,
                @siteRestriction,
                @siteRestrictionDetails,
                @safetyConcern,
                @safetyConcernDetails,
                @sensitiveInformation,
                @termsAgreed,
                @decisionDate,
                @submissionDate,
                @eventUserId,
                @eventUserName
            );
        END 
    `);

    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASLPASubmission');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASLPASubmission]
            @json NVARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @lpaQuestionnaireId CHAR(36),
            @submissionDate DATE,
            @submissionAccuracy BIT,
            @submissionaccuracyDetails NVARCHAR(4000),
            @extraConditions BIT,
            @extraConditionsDetails NVARCHAR(4000),
            @adjacentAppeals BIT,
            @adjacentAppealsNumbers NVARCHAR(100),
            @cannotSeeLand BIT,
            @siteAccess BIT,
            @siteAccessDetails NVARCHAR(4000),
            @siteNeighbourAccess BIT,
            @siteNeighbourAccessDetails NVARCHAR(4000),
            @healthAndSafetyIssues BIT,
            @healthAndSafetyDetails NVARCHAR(4000),
            @affectListedBuilding BIT,
            @affectListedBuildingDetails NVARCHAR(4000),
            @greenBelt BIT,
            @conservationArea BIT,
            @originalPlanningApplicationPublicised BIT,
            @developmentNeighbourhoodPlanSubmitted BIT,
            @developmentNeighbourhoodPlanChanges NVARCHAR(4000),
            @eventUserId CHAR(36),
            @eventUserName NVARCHAR(256)
        BEGIN
            SET @appealId = JSON_VALUE(@json, '$.appealId')

            SELECT
                @lpaQuestionnaireId = LPAQuestionnaireID,
                @submissionDate = SubmissionDate,
                @submissionAccuracy = SubmissionAccuracy,
                @submissionaccuracyDetails = SubmissionaccuracyDetails,
                @extraConditions = ExtraConditions,
                @extraConditionsDetails = ExtraConditionsDetails,
                @adjacentAppeals = AdjacentAppeals,
                @adjacentAppealsNumbers = AdjacentAppealsNumbers,
                @cannotSeeLand = CannotSeeLand,
                @siteAccess = SiteAccess,
                @siteAccessDetails = SiteAccessDetails,
                @siteNeighbourAccess = SiteNeighbourAccess,
                @siteNeighbourAccessDetails = SiteNeighbourAccessDetails,
                @healthAndSafetyIssues = HealthAndSafetyIssues,
                @healthAndSafetyDetails = HealthAndSafetyDetails,
                @affectListedBuilding = AffectListedBuilding,
                @affectListedBuildingDetails = AffectListedBuildingDetails,
                @greenBelt = GreenBelt,
                @conservationArea = ConservationArea,
                @originalPlanningApplicationPublicised = OriginalPlanningApplicationPublicised,
                @developmentNeighbourhoodPlanSubmitted = DevelopmentNeighbourhoodPlanSubmitted,
                @developmentNeighbourhoodPlanChanges = DevelopmentNeighbourhoodPlanChanges,
                @eventUserId = EventUserID,
                @eventUserName = EventUserName
            FROM HASLPASubmission (NOLOCK)
            WHERE AppealID = @appealId AND LatestEvent = 1;

            IF JSON_VALUE(@json, '$.lpaQuestionnaireId') IS NOT NULL
                SET @lpaQuestionnaireId = JSON_VALUE(@json, '$.lpaQuestionnaireId')

            IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
                SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

            IF JSON_VALUE(@json, '$.submissionAccuracy') IS NOT NULL
                SET @submissionAccuracy = JSON_VALUE(@json, '$.submissionAccuracy')

            IF JSON_VALUE(@json, '$.submissionaccuracyDetails') IS NOT NULL
                SET @submissionaccuracyDetails = JSON_VALUE(@json, '$.submissionaccuracyDetails')

            IF JSON_VALUE(@json, '$.extraConditions') IS NOT NULL
                SET @extraConditions = JSON_VALUE(@json, '$.extraConditions')

            IF JSON_VALUE(@json, '$.extraConditionsDetails') IS NOT NULL
                SET @extraConditionsDetails = JSON_VALUE(@json, '$.extraConditionsDetails')

            IF JSON_VALUE(@json, '$.adjacentAppeals') IS NOT NULL
                SET @adjacentAppeals = JSON_VALUE(@json, '$.adjacentAppeals')

            IF JSON_VALUE(@json, '$.adjacentAppealsNumbers') IS NOT NULL
                SET @adjacentAppealsNumbers = JSON_VALUE(@json, '$.adjacentAppealsNumbers')

            IF JSON_VALUE(@json, '$.cannotSeeLand') IS NOT NULL
                SET @cannotSeeLand = JSON_VALUE(@json, '$.cannotSeeLand')

            IF JSON_VALUE(@json, '$.siteAccess') IS NOT NULL
                SET @siteAccess = JSON_VALUE(@json, '$.siteAccess')

            IF JSON_VALUE(@json, '$.siteAccessDetails') IS NOT NULL
                SET @siteAccessDetails = JSON_VALUE(@json, '$.siteAccessDetails')

            IF JSON_VALUE(@json, '$.siteNeighbourAccess') IS NOT NULL
                SET @siteNeighbourAccess = JSON_VALUE(@json, '$.siteNeighbourAccess')

            IF JSON_VALUE(@json, '$.siteNeighbourAccessDetails') IS NOT NULL
                SET @siteNeighbourAccessDetails = JSON_VALUE(@json, '$.siteNeighbourAccessDetails')

            IF JSON_VALUE(@json, '$.healthAndSafetyIssues') IS NOT NULL
                SET @healthAndSafetyIssues = JSON_VALUE(@json, '$.healthAndSafetyIssues')

            IF JSON_VALUE(@json, '$.healthAndSafetyDetails') IS NOT NULL
                SET @healthAndSafetyDetails = JSON_VALUE(@json, '$.healthAndSafetyDetails')

            IF JSON_VALUE(@json, '$.affectListedBuilding') IS NOT NULL
                SET @affectListedBuilding = JSON_VALUE(@json, '$.affectListedBuilding')

            IF JSON_VALUE(@json, '$.affectListedBuildingDetails') IS NOT NULL
                SET @affectListedBuildingDetails = JSON_VALUE(@json, '$.affectListedBuildingDetails')

            IF JSON_VALUE(@json, '$.greenBelt') IS NOT NULL
                SET @greenBelt = JSON_VALUE(@json, '$.greenBelt') 
  
            IF JSON_VALUE(@json, '$.conservationArea') IS NOT NULL
                SET @conservationArea = JSON_VALUE(@json, '$.conservationArea')

            IF JSON_VALUE(@json, '$.originalPlanningApplicationPublicised') IS NOT NULL
                SET @originalPlanningApplicationPublicised = JSON_VALUE(@json, '$.originalPlanningApplicationPublicised')

            IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted') IS NOT NULL
                SET @developmentNeighbourhoodPlanSubmitted = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted')

            IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges') IS NOT NULL
                SET @developmentNeighbourhoodPlanChanges = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges')

            IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
                SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

            IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
                SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

            INSERT INTO HASLPASubmission (
                ID,
                AppealID,
                LPAQuestionnaireID,
                SubmissionDate,
                SubmissionAccuracy,
                SubmissionaccuracyDetails,
                ExtraConditions,
                ExtraConditionsDetails,
                AdjacentAppeals,
                AdjacentAppealsNumbers,
                CannotSeeLand,
                SiteAccess,
                SiteAccessDetails,
                SiteNeighbourAccess,
                SiteNeighbourAccessDetails,
                HealthAndSafetyIssues,
                HealthAndSafetyDetails,
                AffectListedBuilding,
                AffectListedBuildingDetails,
                GreenBelt,
                ConservationArea,
                OriginalPlanningApplicationPublicised,
                DevelopmentNeighbourhoodPlanSubmitted,
                DevelopmentNeighbourhoodPlanChanges,
                EventUserID,
                EventUserName
            )
            VALUES (
                newid(),
                @appealId,
                @lpaQuestionnaireId,
                @submissionDate,
                @submissionAccuracy,
                @submissionaccuracyDetails,
                @extraConditions,
                @extraConditionsDetails,
                @adjacentAppeals,
                @adjacentAppealsNumbers,
                @cannotSeeLand,
                @siteAccess,
                @siteAccessDetails,
                @siteNeighbourAccess,
                @siteNeighbourAccessDetails,
                @healthAndSafetyIssues,
                @healthAndSafetyDetails,
                @affectListedBuilding,
                @affectListedBuildingDetails,
                @greenBelt,
                @conservationArea,
                @originalPlanningApplicationPublicised,
                @developmentNeighbourhoodPlanSubmitted,
                @developmentNeighbourhoodPlanChanges,
                @eventUserId,
                @eventUserName
            );
        END
    `);

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASAppeal]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASAppeal] ON [dbo].[HASAppeal]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[RecommendedSiteVisitTypeID],
                INSERTED.[SiteVisitTypeID],
                INSERTED.[CaseOfficerFirstName],
                INSERTED.[CaseOfficerSurname],
                INSERTED.[CaseOfficerID],
                INSERTED.[LPAQuestionnaireReviewOutcomeID],
                INSERTED.[LPAIncompleteReasons],
                INSERTED.[ValidationOfficerFirstName],
                INSERTED.[ValidationOfficerSurname],
                INSERTED.[ValidationOfficerID],
                INSERTED.[ValidationOutcomeID],
                INSERTED.[InvalidReasonOtherDetails],
                INSERTED.[InvalidAppealReasons],
                INSERTED.[InspectorFirstName],
                INSERTED.[InspectorSurname],
                INSERTED.[InspectorID],
                INSERTED.[InspectorSpecialismID],
                INSERTED.[ScheduledSiteVisitDate],
                INSERTED.[DecisionOutcomeID],
                INSERTED.[DecisionLetterID],
                INSERTED.[DecisionDate],
                INSERTED.[EventUserID],
                INSERTED.[EventUserName],
                INSERTED.[DescriptionDevelopment],
                INSERTED.[CaseOfficerEmail],
                INSERTED.[InspectorEmail],
                INSERTED.[ValidationOfficerEmail],
                INSERTED.[AppealStartDate],
                INSERTED.[AppealValidationDate],
                INSERTED.[AppealValidDate],
                INSERTED.[MissingOrWrongReasons],
                INSERTED.[MissingOrWrongDocuments],
                INSERTED.[MissingOrWrongOtherReason]) FROM INSERTED;

            UPDATE [HASAppeal]
            SET [LatestEvent] = 0
            WHERE [AppealID] = @AppealID
                AND [LatestEvent] = 1
                AND [ID] <> @ID;

            UPDATE [HASAppeal]
            SET [CheckSumRow] = @CheckSumRow
            WHERE [ID] = @ID;
        END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASAppeal] ENABLE TRIGGER [AfterInsertHASAppeal]'
    );
  },
};

module.exports = migration;

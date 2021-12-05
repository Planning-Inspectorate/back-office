const migration = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('HASAppeal', 'CaseOfficerFirstName', 'CaseOfficerName');

    await queryInterface.sequelize.query(
      'ALTER TABLE [HASAppeal] ALTER COLUMN CaseOfficerName NVARCHAR(80)'
    );

    await queryInterface.removeColumn('HASAppeal', 'CaseOfficerSurname');

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertMessageQueue]');

    await queryInterface.sequelize.query(`
      CREATE TRIGGER [dbo].[AfterInsertMessageQueue] ON [dbo].[MessageQueue]
      FOR INSERT
      AS DECLARE @ID CHAR(36),
          @RowID INT,
          @AppealID CHAR(36),
          @QueueType INT,
          @Data NVARCHAR(max),
          @NumberRows INT;
      BEGIN

          SET @NumberRows = 0;
          SET @ID = NEWID();

          SELECT @RowID = [INSERTED].[ID] FROM [INSERTED];
          SELECT @AppealID = [INSERTED].[AppealID] FROM [INSERTED];
          SELECT @QueueType = [INSERTED].[QueueType] FROM [INSERTED];
          SELECT @Data = [INSERTED].[DATA] FROM [INSERTED];
          SELECT @NumberRows=COUNT(*) FROM [MessageQueue]
          WHERE [AppealID] = @AppealID
              AND [QueueType] = @QueueType
              AND [Processed] = 1
              AND CHECKSUM(JSON_QUERY([Data])) = CHECKSUM(JSON_QUERY(@Data));

          IF (@NumberRows = 0)
          BEGIN
              IF (@QueueType = 1)
              BEGIN
                  -- Table HASAppealSubmission
                  SELECT @NumberRows=COUNT(*) FROM [HASAppealSubmission]
                  WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(@AppealID,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email') END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.isOriginalApplicant')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf') END,
                      CASE WHEN JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber')='' THEN NULL ELSE JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.ownsWholeSite')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.hasIssues')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues') END,
                      CASE WHEN JSON_VALUE(@Data,'$.yourAppealSection.appealStatement.hasSensitiveInformation')='TRUE' THEN 1 ELSE 0 END,
                      1,
                      CASE WHEN JSON_VALUE(@Data,'$.decisionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.decisionDate') END,
                      CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END
                      );

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [HASAppealSubmission]
                          ([ID],
                          [AppealID],
                          [CreatorEmailAddress],
                          [CreatorName],
                          [CreatorOriginalApplicant],
                          [CreatorOnBehalfOf],
                          [OriginalApplicationNumber],
                          [SiteOwnership],
                          [SiteInformOwners],
                          [SiteRestriction],
                          [SiteRestrictionDetails],
                          [SafetyConcern],
                          [SafetyConcernDetails],
                          [SensitiveInformation],
                          [TermsAgreed],
                          [DecisionDate],
                          [SubmissionDate],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES
                          (@ID,
                          @AppealID,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.isOriginalApplicant')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf') END,
                          CASE WHEN JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber')='' THEN NULL ELSE JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.ownsWholeSite')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.hasIssues')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues') END,
                          CASE WHEN JSON_VALUE(@Data,'$.yourAppealSection.appealStatement.hasSensitiveInformation')='TRUE' THEN 1 ELSE 0 END,
                          1,
                          CASE WHEN JSON_VALUE(@Data,'$.decisionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.decisionDate') END,
                          CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM');
                  END;

                  SELECT @NumberRows=COUNT(*) FROM [HASAppeal]
                  WHERE [AppealID] = @AppealID
                  AND [CheckSumRow] = CHECKSUM(@AppealID,
                      [RecommendedSiteVisitTypeID],
                      [SiteVisitTypeID],
                      [CaseOfficerName],
                      [CaseOfficerID],
                      [LPAQuestionnaireReviewOutcomeID],
                      [LPAIncompleteReasons],
                      [ValidationOfficerFirstName],
                      [ValidationOfficerSurname],
                      [ValidationOfficerID],
                      [ValidationOutcomeID],
                      [InvalidReasonOtherDetails],
                      [InvalidAppealReasons],
                      [InspectorFirstName],
                      [InspectorSurname],
                      [InspectorID],
                      [InspectorSpecialismID],
                      [ScheduledSiteVisitDate],
                      [DecisionOutcomeID],
                      [DecisionLetterID],
                      [DecisionDate],
                      [DescriptionDevelopment]);

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [HASAppeal]
                          ([ID],
                          [AppealID],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES(
                          @ID,
                          @AppealID,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM');
                  END;

                  -- Table AppealLink
                  SELECT @NumberRows=COUNT(*) FROM [AppealLink]
                  WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(@AppealID,
                      2,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                      CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                      1);

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [AppealLink]
                          ([ID],
                          [AppealID],
                          [CaseReference],
                          [CaseTypeID],
                          [AppellantName],
                          [SiteAddressLineOne],
                          [SiteAddressLineTwo],
                          [SiteAddressTown],
                          [SiteAddressCounty],
                          [SiteAddressPostCode],
                          [LocalPlanningAuthorityID],
                          [CaseStatusID],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES(
                          @ID,
                          @AppealID,
                          50000000+FLOOR((99999999-50000000+1)*RAND(CONVERT(VARBINARY,NEWID()))),                          2,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                          CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                          1,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM'
                          );
                  END;
              END
              ELSE
              BEGIN
                  IF (@QueueType = 2)
                  BEGIN
                      SELECT @NumberRows=COUNT(*) FROM [HASLPASubmission]
                      WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(
                          CASE WHEN JSON_VALUE(@Data,'$.id')='' THEN NULL ELSE JSON_VALUE(@Data,'$.id') END,
                          @AppealID,
                          CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.accurateSubmission')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.hasExtraConditions')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.adjacentAppeals')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers') END,
                          CASE WHEN JSON_VALUE(@Data,'$.siteSeenPublicLand')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.mustEnter')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.enterReasons')='' THEN NULL ELSE JSON_VALUE(@Data,'$.enterAppealSite.enterReasons') END,
                          CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.needsAccess')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason') END,
                          CASE WHEN JSON_VALUE(@Data,'$.healthSafety.hasHealthSafety')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues') END,
                          CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.affectSetting')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.buildingDetails')='' THEN NULL ELSE JSON_VALUE(@Data,'$.listedBuilding.buildingDetails') END,
                          CASE WHEN JSON_VALUE(@Data,'$.greenBelt')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.nearConservationArea')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.originalPlanningApplicationPublicised')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.hasPlanSubmitted')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges')='' THEN NULL ELSE JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges') END
                          );

                      IF (@NumberRows = 0)
                      BEGIN
                          INSERT INTO [HASLPASubmission]
                              ([ID],
                              [LPAQuestionnaireID],
                              [AppealID],
                              [SubmissionDate],
                              [SubmissionAccuracy],
                              [SubmissionAccuracyDetails],
                              [ExtraConditions],
                              [ExtraConditionsDetails],
                              [AdjacentAppeals],
                              [AdjacentAppealsNumbers],
                              [CannotSeeLand],
                              [SiteAccess],
                              [SiteAccessDetails],
                              [SiteNeighbourAccess],
                              [SiteNeighbourAccessDetails],
                              [HealthAndSafetyIssues],
                              [HealthAndSafetyDetails],
                              [AffectListedBuilding],
                              [AffectListedBuildingDetails],
                              [GreenBelt],
                              [ConservationArea],
                              [OriginalPlanningApplicationPublicised],
                              [DevelopmentNeighbourhoodPlanSubmitted],
                              [DevelopmentNeighbourhoodPlanChanges],
                              [LatestEvent],
                              [EventDateTime],
                              [EventUserID],
                              [EventUserName])
                          VALUES(
                              @ID,
                              CASE WHEN JSON_VALUE(@Data,'$.id')='' THEN NULL ELSE JSON_VALUE(@Data,'$.id') END,
                              @AppealID,
                              CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.accurateSubmission')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.hasExtraConditions')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.adjacentAppeals')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers') END,
                              CASE WHEN JSON_VALUE(@Data,'$.siteSeenPublicLand')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.mustEnter')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.enterReasons')='' THEN NULL ELSE JSON_VALUE(@Data,'$.enterAppealSite.enterReasons') END,
                              CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.needsAccess')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason') END,
                              CASE WHEN JSON_VALUE(@Data,'$.healthSafety.hasHealthSafety')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues') END,
                              CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.affectSetting')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.buildingDetails')='' THEN NULL ELSE JSON_VALUE(@Data,'$.listedBuilding.buildingDetails') END,
                              CASE WHEN JSON_VALUE(@Data,'$.greenBelt')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.nearConservationArea')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.originalPlanningApplicationPublicised')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.hasPlanSubmitted')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges')='' THEN NULL ELSE JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges') END,
                              1,
                              GETDATE(),
                              '00000000-0000-0000-0000-000000000000',
                              'SYSTEM');

                          IF EXISTS(SELECT 1 FROM AppealLink WHERE AppealID = @AppealID AND LatestEvent = 1)
                          BEGIN
                            UPDATE AppealLink SET QuestionnaireStatusID = 2 WHERE AppealID = @AppealID AND LatestEvent = 1
                          END;
                      END;
                  END;
              END;
          END;

          UPDATE [MessageQueue]
          SET [Processed] = 1
          WHERE [ID] = @RowID
              AND [Processed] = 0;
      END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[MessageQueue] ENABLE TRIGGER [AfterInsertMessageQueue]'
    );

    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppeal');

    await queryInterface.sequelize.query(`
        CREATE PROCEDURE [dbo].[CreateHASAppeal]
            @json VARCHAR(4000)
        AS
        DECLARE
            @appealId CHAR(36),
            @recommendedSiteVisitTypeId INT,
            @siteVisitTypeId INT,
            @caseOfficerName NVARCHAR(64),
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
                @caseOfficerName = CaseOfficerName,
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

            IF JSON_VALUE(@json, '$.caseOfficerName') IS NOT NULL
              SET @caseOfficerName = JSON_VALUE(@json, '$.caseOfficerName')

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
                CaseOfficerName,
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
                @caseOfficerName,
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

    await queryInterface.sequelize.query('DROP VIEW AppealData');

    await queryInterface.sequelize.query(`
      CREATE VIEW [dbo].[AppealData]
      AS
      SELECT
        HASAppealSubmission.AppealID as appealId,
        HASAppealSubmission.CreatorEmailAddress as creatorEmailAddress,
        HASAppealSubmission.CreatorName as creatorName,
        HASAppealSubmission.CreatorOriginalApplicant as creatorOriginalApplicant,
        HASAppealSubmission.CreatorOnBehalfOf as creatorOnBehalfOf,
        HASAppealSubmission.OriginalApplicationNumber as originalApplicationNumber,
        HASAppealSubmission.SiteOwnership as siteOwnership,
        HASAppealSubmission.SiteInformOwners as siteInformOwners,
        HASAppealSubmission.SiteRestriction as siteRestriction,
        HASAppealSubmission.SiteRestrictionDetails as siteRestrictionDetails,
        HASAppealSubmission.SafetyConcern as safetyConcern,
        HASAppealSubmission.SafetyConcernDetails as safetyConcernDetails,
        HASAppealSubmission.SensitiveInformation as sensitiveInformation,
        HASAppealSubmission.TermsAgreed as termsAgreed,
        HASAppealSubmission.DecisionDate as appealDecisionDate,
        HASAppealSubmission.SubmissionDate as submissionDate,
        AppealLink.CaseReference as caseReference,
        AppealLink.CaseStatusID as caseStatusId,
        AppealLink.AppellantName as appellantName,
        AppealLink.SiteAddressLineOne as siteAddressLineOne,
        AppealLink.SiteAddressLineTwo as siteAddressLineTwo,
        AppealLink.SiteAddressTown as siteAddressTown,
        AppealLink.SiteAddressCounty as siteAddressCounty,
        AppealLink.SiteAddressPostCode as siteAddressPostCode,
        AppealLink.LocalPlanningAuthorityID as localPlanningAuthorityId,
        HASAppeal.CaseOfficerName as caseOfficerName,
        HASAppeal.CaseOfficerEmail as caseOfficerEmail,
        HASAppeal.ValidationOfficerFirstName as validationOfficerFirstName,
        HASAppeal.ValidationOfficerSurname as validationOfficerSurname,
        HASAppeal.ValidationOfficerEmail as validationOfficerEmail,
        HASAppeal.ValidationOutcomeID as validationOutcomeId,
        HASAppeal.InvalidReasonOtherDetails as invalidReasonOtherDetails,
        HASAppeal.InvalidAppealReasons as invalidAppealReasons,
        HASAppeal.InspectorFirstName as inspectorFirstName,
        HASAppeal.InspectorSurname as inspectorSurname,
        HASAppeal.InspectorEmail as inspectorEmail,
        HASAppeal.ScheduledSiteVisitDate as scheduledSiteVisitDate,
        HASAppealSubmission.DecisionDate as questionnaireDecisionDate,
        HASAppeal.DescriptionDevelopment as descriptionDevelopment,
        HASAppeal.AppealStartDate as appealStartDate,
        HASAppeal.AppealValidationDate as appealValidationDate,
        HASAppeal.AppealValidDate as appealValidDate,
        HASAppeal.MissingOrWrongReasons as missingOrWrongReasons,
        HASAppeal.MissingOrWrongDocuments as missingOrWrongDocuments,
        HASAppeal.MissingOrWrongOtherReason as missingOrWrongOtherReason,
        LookUpCaseType.TypeName as caseTypeName,
        LookUpCaseStage.StageName as caseStageName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName,
        LookUpRecommendedSiteVisitType.TypeName as recommendedSiteVisitTypeName,
        LookUpSiteVisitType.TypeName as siteVisitTypeName,
        LookUpInspectorSpecialism.Specialism as inspectorSpecialismName,
        LookUpDecisionOutcome.Outcome as decisionOutcomeName,
        LookUpValidationOutcome.Outcome as validationOutcomeName
      FROM HASAppealSubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASAppealSubmission.AppealID = AppealLink.AppealId AND AppealLink.LatestEvent = 1
      LEFT JOIN HASAppeal (NOLOCK) ON HASAppealSubmission.AppealID = HASAppeal.AppealId AND HASAppeal.LatestEvent = 1
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStage (NOLOCK) ON AppealLink.CaseStageID = LookUpCaseStage.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      LEFT JOIN LookUpSiteVisitType AS LookUpRecommendedSiteVisitType (NOLOCK) ON HASAppeal.RecommendedSiteVisitTypeID = LookUpRecommendedSiteVisitType.ID
      LEFT JOIN LookUpSiteVisitType (NOLOCK) ON HASAppeal.SiteVisitTypeID = LookUpSiteVisitType.ID
      LEFT JOIN LookUpInspectorSpecialism (NOLOCK) ON HASAppeal.InspectorSpecialismID = LookUpInspectorSpecialism.ID
      LEFT JOIN LookUpDecisionOutcome (NOLOCK) ON HASAppeal.DecisionOutcomeID = LookUpDecisionOutcome.ID
      LEFT JOIN LookUpValidationOutcome (NOLOCK) ON HASAppeal.ValidationOutcomeID = LookUpValidationOutcome.ID
      WHERE HASAppealSubmission.LatestEvent = 1
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
                INSERTED.[CaseOfficerName],
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('HASAppeal', 'CaseOfficerName', 'CaseOfficerFirstName');

    await queryInterface.sequelize.query(
      'ALTER TABLE [HASAppeal] ALTER COLUMN CaseOfficerFirstName NVARCHAR(64)'
    );

    await queryInterface.addColumn('HASAppeal', 'CaseOfficerSurname', Sequelize.String(64));

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertMessageQueue]');

    await queryInterface.sequelize.query(`
      CREATE TRIGGER [dbo].[AfterInsertMessageQueue] ON [dbo].[MessageQueue]
      FOR INSERT
      AS DECLARE @ID CHAR(36),
          @RowID INT,
          @AppealID CHAR(36),
          @QueueType INT,
          @Data NVARCHAR(max),
          @NumberRows INT;
      BEGIN

          SET @NumberRows = 0;
          SET @ID = NEWID();

          SELECT @RowID = [INSERTED].[ID] FROM [INSERTED];
          SELECT @AppealID = [INSERTED].[AppealID] FROM [INSERTED];
          SELECT @QueueType = [INSERTED].[QueueType] FROM [INSERTED];
          SELECT @Data = [INSERTED].[DATA] FROM [INSERTED];
          SELECT @NumberRows=COUNT(*) FROM [MessageQueue]
          WHERE [AppealID] = @AppealID
              AND [QueueType] = @QueueType
              AND [Processed] = 1
              AND CHECKSUM(JSON_QUERY([Data])) = CHECKSUM(JSON_QUERY(@Data));

          IF (@NumberRows = 0)
          BEGIN
              IF (@QueueType = 1)
              BEGIN
                  -- Table HASAppealSubmission
                  SELECT @NumberRows=COUNT(*) FROM [HASAppealSubmission]
                  WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(@AppealID,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email') END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.isOriginalApplicant')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf') END,
                      CASE WHEN JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber')='' THEN NULL ELSE JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.ownsWholeSite')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.hasIssues')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues') END,
                      CASE WHEN JSON_VALUE(@Data,'$.yourAppealSection.appealStatement.hasSensitiveInformation')='TRUE' THEN 1 ELSE 0 END,
                      1,
                      CASE WHEN JSON_VALUE(@Data,'$.decisionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.decisionDate') END,
                      CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END
                      );

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [HASAppealSubmission]
                          ([ID],
                          [AppealID],
                          [CreatorEmailAddress],
                          [CreatorName],
                          [CreatorOriginalApplicant],
                          [CreatorOnBehalfOf],
                          [OriginalApplicationNumber],
                          [SiteOwnership],
                          [SiteInformOwners],
                          [SiteRestriction],
                          [SiteRestrictionDetails],
                          [SafetyConcern],
                          [SafetyConcernDetails],
                          [SensitiveInformation],
                          [TermsAgreed],
                          [DecisionDate],
                          [SubmissionDate],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES
                          (@ID,
                          @AppealID,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.email') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.isOriginalApplicant')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.appealingOnBehalfOf') END,
                          CASE WHEN JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber')='' THEN NULL ELSE JSON_VALUE(@Data,'$.requiredDocumentsSection.applicationNumber') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.ownsWholeSite')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAccess.howIsSiteAccessRestricted') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.hasIssues')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.healthAndSafety.healthAndSafetyIssues') END,
                          CASE WHEN JSON_VALUE(@Data,'$.yourAppealSection.appealStatement.hasSensitiveInformation')='TRUE' THEN 1 ELSE 0 END,
                          1,
                          CASE WHEN JSON_VALUE(@Data,'$.decisionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.decisionDate') END,
                          CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM');
                  END;

                  SELECT @NumberRows=COUNT(*) FROM [HASAppeal]
                  WHERE [AppealID] = @AppealID
                  AND [CheckSumRow] = CHECKSUM(@AppealID,
                      [RecommendedSiteVisitTypeID],
                      [SiteVisitTypeID],
                      [CaseOfficerFirstName],
                      [CaseOfficerSurname],
                      [CaseOfficerID],
                      [LPAQuestionnaireReviewOutcomeID],
                      [LPAIncompleteReasons],
                      [ValidationOfficerFirstName],
                      [ValidationOfficerSurname],
                      [ValidationOfficerID],
                      [ValidationOutcomeID],
                      [InvalidReasonOtherDetails],
                      [InvalidAppealReasons],
                      [InspectorFirstName],
                      [InspectorSurname],
                      [InspectorID],
                      [InspectorSpecialismID],
                      [ScheduledSiteVisitDate],
                      [DecisionOutcomeID],
                      [DecisionLetterID],
                      [DecisionDate],
                      [DescriptionDevelopment]);

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [HASAppeal]
                          ([ID],
                          [AppealID],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES(
                          @ID,
                          @AppealID,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM');
                  END;

                  -- Table AppealLink
                  SELECT @NumberRows=COUNT(*) FROM [AppealLink]
                  WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(@AppealID,
                      2,
                      CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                      CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                      CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                      1);

                  IF (@NumberRows = 0)
                  BEGIN
                      INSERT INTO [AppealLink]
                          ([ID],
                          [AppealID],
                          [CaseReference],
                          [CaseTypeID],
                          [AppellantName],
                          [SiteAddressLineOne],
                          [SiteAddressLineTwo],
                          [SiteAddressTown],
                          [SiteAddressCounty],
                          [SiteAddressPostCode],
                          [LocalPlanningAuthorityID],
                          [CaseStatusID],
                          [LatestEvent],
                          [EventDateTime],
                          [EventUserID],
                          [EventUserName])
                      VALUES(
                          @ID,
                          @AppealID,
                          50000000+FLOOR((99999999-50000000+1)*RAND(CONVERT(VARBINARY,NEWID()))),                          2,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                          CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                          CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                          1,
                          1,
                          GETDATE(),
                          '00000000-0000-0000-0000-000000000000',
                          'SYSTEM'
                          );
                  END;
              END
              ELSE
              BEGIN
                  IF (@QueueType = 2)
                  BEGIN
                      SELECT @NumberRows=COUNT(*) FROM [HASLPASubmission]
                      WHERE [AppealID] = @AppealID
                      AND [CheckSumRow] = CHECKSUM(
                          CASE WHEN JSON_VALUE(@Data,'$.id')='' THEN NULL ELSE JSON_VALUE(@Data,'$.id') END,
                          @AppealID,
                          CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.accurateSubmission')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.hasExtraConditions')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions') END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.adjacentAppeals')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers') END,
                          CASE WHEN JSON_VALUE(@Data,'$.siteSeenPublicLand')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.mustEnter')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.enterReasons')='' THEN NULL ELSE JSON_VALUE(@Data,'$.enterAppealSite.enterReasons') END,
                          CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.needsAccess')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason') END,
                          CASE WHEN JSON_VALUE(@Data,'$.healthSafety.hasHealthSafety')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues') END,
                          CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.affectSetting')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.buildingDetails')='' THEN NULL ELSE JSON_VALUE(@Data,'$.listedBuilding.buildingDetails') END,
                          CASE WHEN JSON_VALUE(@Data,'$.greenBelt')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.nearConservationArea')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.originalPlanningApplicationPublicised')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.hasPlanSubmitted')='TRUE' THEN 1 ELSE 0 END,
                          CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges')='' THEN NULL ELSE JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges') END
                          );

                      IF (@NumberRows = 0)
                      BEGIN
                          INSERT INTO [HASLPASubmission]
                              ([ID],
                              [LPAQuestionnaireID],
                              [AppealID],
                              [SubmissionDate],
                              [SubmissionAccuracy],
                              [SubmissionAccuracyDetails],
                              [ExtraConditions],
                              [ExtraConditionsDetails],
                              [AdjacentAppeals],
                              [AdjacentAppealsNumbers],
                              [CannotSeeLand],
                              [SiteAccess],
                              [SiteAccessDetails],
                              [SiteNeighbourAccess],
                              [SiteNeighbourAccessDetails],
                              [HealthAndSafetyIssues],
                              [HealthAndSafetyDetails],
                              [AffectListedBuilding],
                              [AffectListedBuildingDetails],
                              [GreenBelt],
                              [ConservationArea],
                              [OriginalPlanningApplicationPublicised],
                              [DevelopmentNeighbourhoodPlanSubmitted],
                              [DevelopmentNeighbourhoodPlanChanges],
                              [LatestEvent],
                              [EventDateTime],
                              [EventUserID],
                              [EventUserName])
                          VALUES(
                              @ID,
                              CASE WHEN JSON_VALUE(@Data,'$.id')='' THEN NULL ELSE JSON_VALUE(@Data,'$.id') END,
                              @AppealID,
                              CASE WHEN JSON_VALUE(@Data,'$.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.submissionDate') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.accurateSubmission')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.submissionAccuracy.inaccuracyReason') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.hasExtraConditions')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.extraConditions.extraConditions') END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.adjacentAppeals')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutAppealSection.otherAppeals.appealReferenceNumbers') END,
                              CASE WHEN JSON_VALUE(@Data,'$.siteSeenPublicLand')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.mustEnter')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.enterAppealSite.enterReasons')='' THEN NULL ELSE JSON_VALUE(@Data,'$.enterAppealSite.enterReasons') END,
                              CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.needsAccess')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.accessNeighboursLand.addressAndReason') END,
                              CASE WHEN JSON_VALUE(@Data,'$.healthSafety.hasHealthSafety')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.healthSafety.healthSafetyIssues') END,
                              CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.affectSetting')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.listedBuilding.buildingDetails')='' THEN NULL ELSE JSON_VALUE(@Data,'$.listedBuilding.buildingDetails') END,
                              CASE WHEN JSON_VALUE(@Data,'$.greenBelt')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.nearConservationArea')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.originalPlanningApplicationPublicised')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.hasPlanSubmitted')='TRUE' THEN 1 ELSE 0 END,
                              CASE WHEN JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges')='' THEN NULL ELSE JSON_VALUE(@Data,'$.developmentOrNeighbourhood.planChanges') END,
                              1,
                              GETDATE(),
                              '00000000-0000-0000-0000-000000000000',
                              'SYSTEM');

                          IF EXISTS(SELECT 1 FROM AppealLink WHERE AppealID = @AppealID AND LatestEvent = 1)
                          BEGIN
                            UPDATE AppealLink SET QuestionnaireStatusID = 2 WHERE AppealID = @AppealID AND LatestEvent = 1
                          END;
                      END;
                  END;
              END;
          END;

          UPDATE [MessageQueue]
          SET [Processed] = 1
          WHERE [ID] = @RowID
              AND [Processed] = 0;
      END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[MessageQueue] ENABLE TRIGGER [AfterInsertMessageQueue]'
    );

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

    await queryInterface.sequelize.query('DROP VIEW AppealData');

    await queryInterface.sequelize.query(`
      CREATE VIEW [dbo].[AppealData]
      AS
      SELECT
        HASAppealSubmission.AppealID as appealId,
        HASAppealSubmission.CreatorEmailAddress as creatorEmailAddress,
        HASAppealSubmission.CreatorName as creatorName,
        HASAppealSubmission.CreatorOriginalApplicant as creatorOriginalApplicant,
        HASAppealSubmission.CreatorOnBehalfOf as creatorOnBehalfOf,
        HASAppealSubmission.OriginalApplicationNumber as originalApplicationNumber,
        HASAppealSubmission.SiteOwnership as siteOwnership,
        HASAppealSubmission.SiteInformOwners as siteInformOwners,
        HASAppealSubmission.SiteRestriction as siteRestriction,
        HASAppealSubmission.SiteRestrictionDetails as siteRestrictionDetails,
        HASAppealSubmission.SafetyConcern as safetyConcern,
        HASAppealSubmission.SafetyConcernDetails as safetyConcernDetails,
        HASAppealSubmission.SensitiveInformation as sensitiveInformation,
        HASAppealSubmission.TermsAgreed as termsAgreed,
        HASAppealSubmission.DecisionDate as appealDecisionDate,
        HASAppealSubmission.SubmissionDate as submissionDate,
        AppealLink.CaseReference as caseReference,
        AppealLink.CaseStatusID as caseStatusId,
        AppealLink.AppellantName as appellantName,
        AppealLink.SiteAddressLineOne as siteAddressLineOne,
        AppealLink.SiteAddressLineTwo as siteAddressLineTwo,
        AppealLink.SiteAddressTown as siteAddressTown,
        AppealLink.SiteAddressCounty as siteAddressCounty,
        AppealLink.SiteAddressPostCode as siteAddressPostCode,
        AppealLink.LocalPlanningAuthorityID as localPlanningAuthorityId,
        HASAppeal.CaseOfficerFirstName as caseOfficerFirstName,
        HASAppeal.CaseOfficerSurname as caseOfficerSurname,
        HASAppeal.CaseOfficerEmail as caseOfficerEmail,
        HASAppeal.ValidationOfficerFirstName as validationOfficerFirstName,
        HASAppeal.ValidationOfficerSurname as validationOfficerSurname,
        HASAppeal.ValidationOfficerEmail as validationOfficerEmail,
        HASAppeal.ValidationOutcomeID as validationOutcomeId,
        HASAppeal.InvalidReasonOtherDetails as invalidReasonOtherDetails,
        HASAppeal.InvalidAppealReasons as invalidAppealReasons,
        HASAppeal.InspectorFirstName as inspectorFirstName,
        HASAppeal.InspectorSurname as inspectorSurname,
        HASAppeal.InspectorEmail as inspectorEmail,
        HASAppeal.ScheduledSiteVisitDate as scheduledSiteVisitDate,
        HASAppealSubmission.DecisionDate as questionnaireDecisionDate,
        HASAppeal.DescriptionDevelopment as descriptionDevelopment,
        HASAppeal.AppealStartDate as appealStartDate,
        HASAppeal.AppealValidationDate as appealValidationDate,
        HASAppeal.AppealValidDate as appealValidDate,
        HASAppeal.MissingOrWrongReasons as missingOrWrongReasons,
        HASAppeal.MissingOrWrongDocuments as missingOrWrongDocuments,
        HASAppeal.MissingOrWrongOtherReason as missingOrWrongOtherReason,
        LookUpCaseType.TypeName as caseTypeName,
        LookUpCaseStage.StageName as caseStageName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName,
        LookUpRecommendedSiteVisitType.TypeName as recommendedSiteVisitTypeName,
        LookUpSiteVisitType.TypeName as siteVisitTypeName,
        LookUpInspectorSpecialism.Specialism as inspectorSpecialismName,
        LookUpDecisionOutcome.Outcome as decisionOutcomeName,
        LookUpValidationOutcome.Outcome as validationOutcomeName
      FROM HASAppealSubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASAppealSubmission.AppealID = AppealLink.AppealId AND AppealLink.LatestEvent = 1
      LEFT JOIN HASAppeal (NOLOCK) ON HASAppealSubmission.AppealID = HASAppeal.AppealId AND HASAppeal.LatestEvent = 1
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStage (NOLOCK) ON AppealLink.CaseStageID = LookUpCaseStage.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      LEFT JOIN LookUpSiteVisitType AS LookUpRecommendedSiteVisitType (NOLOCK) ON HASAppeal.RecommendedSiteVisitTypeID = LookUpRecommendedSiteVisitType.ID
      LEFT JOIN LookUpSiteVisitType (NOLOCK) ON HASAppeal.SiteVisitTypeID = LookUpSiteVisitType.ID
      LEFT JOIN LookUpInspectorSpecialism (NOLOCK) ON HASAppeal.InspectorSpecialismID = LookUpInspectorSpecialism.ID
      LEFT JOIN LookUpDecisionOutcome (NOLOCK) ON HASAppeal.DecisionOutcomeID = LookUpDecisionOutcome.ID
      LEFT JOIN LookUpValidationOutcome (NOLOCK) ON HASAppeal.ValidationOutcomeID = LookUpValidationOutcome.ID
      WHERE HASAppealSubmission.LatestEvent = 1
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
};

module.exports = migration;

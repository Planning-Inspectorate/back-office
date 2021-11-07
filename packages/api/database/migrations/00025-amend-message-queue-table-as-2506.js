const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertMessageQueue]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertMessageQueue] ON [dbo].[MessageQueue]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @RowID INT,
            @AppealID UNIQUEIDENTIFIER,
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
                            0,
                            GETDATE(),
                            '00000000-0000-0000-0000-000000000000',
                            'SYSTEM');
                    END;
             
                    SELECT @NumberRows=COUNT(*) FROM [HASAppeal]
                    WHERE [AppealID] = @AppealID
                    AND [CheckSumRow] = CHECKSUM(@AppealID,
                        [MinisterialTargetDate],
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
                            [MinisterialTargetDate],
                            [LatestEvent],
                            [EventDateTime],
                            [EventUserID],
                            [EventUserName])
                        VALUES(
                            @ID,
                            @AppealID,
                            GETDATE(),
                            0,
                            GETDATE(),
                            '00000000-0000-0000-0000-000000000000',
                            'SYSTEM');
                    END;
                          
                    -- Table AppealLink
                    SELECT @NumberRows=COUNT(*) FROM [AppealLink]
                    WHERE [AppealID] = @AppealID
                        AND [CheckSumRow] = CHECKSUM(@AppealID,
                        CASE WHEN JSON_VALUE(@Data,'$.horizonId')='' THEN NULL ELSE JSON_VALUE(@Data,'$.horizonId') END,
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
                            CASE WHEN JSON_VALUE(@Data,'$.horizonId')='' THEN NULL ELSE JSON_VALUE(@Data,'$.horizonId') END,
                            2,
                            CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                            CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                            1,
                            0,
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
                                0,
                                GETDATE(),
                                '00000000-0000-0000-0000-000000000000',
                                'SYSTEM');
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

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertAppealLink]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertAppealLink] ON [dbo].[AppealLink]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
                
            SELECT @ID = INSERTED.[ID] FROM INSERTED;
            SELECT @AppealID = INSERTED.[AppealID] FROM INSERTED;
                
            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[CaseReference],
                INSERTED.[CaseTypeID],
                INSERTED.[AppellantName],
                INSERTED.[SiteAddressLineOne],
                INSERTED.[SiteAddressLineTwo],
                INSERTED.[SiteAddressTown],
                INSERTED.[SiteAddressCounty],
                INSERTED.[SiteAddressPostCode],
                INSERTED.[LocalPlanningAuthorityID],
                INSERTED.[CaseStatusID]) FROM INSERTED;
                    
            UPDATE [AppealLink]
            SET [LatestEvent] = 0
            WHERE [AppealID] = @AppealID
                AND [LatestEvent] = 1
                AND [ID] <> @ID;
             
            UPDATE [AppealLink]
            SET [CheckSumRow] = @CheckSumRow
            WHERE [ID] = @ID;
        END
        `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[AppealLink] ENABLE TRIGGER [AfterInsertAppealLink]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertMessageQueue]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertMessageQueue] ON [dbo].[MessageQueue]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @RowID INT,
            @AppealID UNIQUEIDENTIFIER,
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
                            0,
                            GETDATE(),
                            '00000000-0000-0000-0000-000000000000',
                            'SYSTEM');
                    END;
             
                    SELECT @NumberRows=COUNT(*) FROM [HASAppeal]
                    WHERE [AppealID] = @AppealID
                    AND [CheckSumRow] = CHECKSUM(@AppealID,
                        [MinisterialTargetDate],
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
                            [MinisterialTargetDate],
                            [LatestEvent],
                            [EventDateTime],
                            [EventUserID],
                            [EventUserName])
                        VALUES(
                            @ID,
                            @AppealID,
                            GETDATE(),
                            0,
                            GETDATE(),
                            '00000000-0000-0000-0000-000000000000',
                            'SYSTEM');
                    END;
                          
                    -- Table AppealLink
                    SELECT @NumberRows=COUNT(*) FROM [AppealLink]
                    WHERE [AppealID] = @AppealID
                        AND [CheckSumRow] = CHECKSUM(@AppealID,
                        CASE WHEN JSON_VALUE(@Data,'$.horizonId')='' THEN NULL ELSE JSON_VALUE(@Data,'$.horizonId') END,
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
                            CASE WHEN JSON_VALUE(@Data,'$.horizonId')='' THEN NULL ELSE JSON_VALUE(@Data,'$.horizonId') END,
                            CASE WHEN JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.aboutYouSection.yourDetails.name') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine1') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.addressLine2') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.town') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.county') END,
                            CASE WHEN JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appealSiteSection.siteAddress.postcode') END,
                            CASE WHEN JSON_VALUE(@Data,'$.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.lpaCode') END,
                            1,
                            0,
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
                                0,
                                GETDATE(),
                                '00000000-0000-0000-0000-000000000000',
                                'SYSTEM');
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

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertAppealLink]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertAppealLink] ON [dbo].[AppealLink]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
                
            SELECT @ID = INSERTED.[ID] FROM INSERTED;
            SELECT @AppealID = INSERTED.[AppealID] FROM INSERTED;
                
            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[CaseReference],
                INSERTED.[AppellantName],
                INSERTED.[SiteAddressLineOne],
                INSERTED.[SiteAddressLineTwo],
                INSERTED.[SiteAddressTown],
                INSERTED.[SiteAddressCounty],
                INSERTED.[SiteAddressPostCode],
                INSERTED.[LocalPlanningAuthorityID],
                INSERTED.[CaseStatusID]) FROM INSERTED;
                    
            UPDATE [AppealLink]
            SET [LatestEvent] = 0
            WHERE [AppealID] = @AppealID
                AND [LatestEvent] = 1
                AND [ID] <> @ID;
             
            UPDATE [AppealLink]
            SET [CheckSumRow] = @CheckSumRow
            WHERE [ID] = @ID;
        END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[AppealLink] ENABLE TRIGGER [AfterInsertAppealLink]'
    );
  },
};

module.exports = migration;

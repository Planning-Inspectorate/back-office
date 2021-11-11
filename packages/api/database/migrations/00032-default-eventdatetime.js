const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASAppealSubmission]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASAppealSubmission] ON [dbo].[HASAppealSubmission]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
        @AppealID UNIQUEIDENTIFIER,
        @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;

            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[CreatorEmailAddress],
                INSERTED.[CreatorName],
                INSERTED.[CreatorOriginalApplicant],
                INSERTED.[CreatorOnBehalfOf],
                INSERTED.[OriginalApplicationNumber],
                INSERTED.[SiteOwnership],
                INSERTED.[SiteInformOwners],
                INSERTED.[SiteRestriction],
                INSERTED.[SiteRestrictionDetails],
                INSERTED.[SafetyConcern],
                INSERTED.[SafetyConcernDetails],
                INSERTED.[SensitiveInformation],
                INSERTED.[TermsAgreed],
                INSERTED.[DecisionDate],
                INSERTED.[SubmissionDate]) FROM INSERTED;

                UPDATE [HASAppealSubmission]
                SET [LatestEvent] = 0
                WHERE [AppealID] = @AppealID
                    AND [LatestEvent] = 1
                    AND [ID] <> @ID;

                UPDATE [HASAppealSubmission]
                SET [CheckSumRow] = @CheckSumRow, [EventDateTime] = GETDATE()
                WHERE [ID] = @ID;
            END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASAppealSubmission] ENABLE TRIGGER [AfterInsertHASAppealSubmission]'
    );

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
                INSERTED.[MinisterialTargetDate],
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
                INSERTED.[DescriptionDevelopment]) FROM INSERTED;
                    
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
                INSERTED.[LocalPlanningAuthorityID]) FROM INSERTED;
                    
            UPDATE [AppealLink]
            SET [LatestEvent] = 0
            WHERE [AppealID] = @AppealID
                AND [LatestEvent] = 1
                AND [ID] <> @ID;
             
            UPDATE [AppealLink]
            SET [CheckSumRow] = @CheckSumRow, [EventDateTime] = GetDate()
            WHERE [ID] = @ID;
        END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[AppealLink] ENABLE TRIGGER [AfterInsertAppealLink]'
    );

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASLPASubmission]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASLPASubmission] ON [dbo].[HASLPASubmission]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
                
            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;
                
            SELECT @CheckSumRow = CHECKSUM(
                INSERTED.[LPAQuestionnaireID],
                INSERTED.[AppealID],
                INSERTED.[SubmissionDate],
                INSERTED.[SubmissionAccuracy],
                INSERTED.[SubmissionAccuracyDetails],
                INSERTED.[ExtraConditions],
                INSERTED.[ExtraConditionsDetails],
                INSERTED.[AdjacentAppeals],
                INSERTED.[AdjacentAppealsNumbers],
                INSERTED.[CannotSeeLand],
                INSERTED.[SiteAccess],
                INSERTED.[SiteAccessDetails],
                INSERTED.[SiteNeighbourAccess],
                INSERTED.[SiteNeighbourAccessDetails],
                INSERTED.[HealthAndSafetyIssues],
                INSERTED.[HealthAndSafetyDetails],
                INSERTED.[AffectListedBuilding],
                INSERTED.[AffectListedBuildingDetails],
                INSERTED.[GreenBelt],
                INSERTED.[ConservationArea],
                INSERTED.[OriginalPlanningApplicationPublicised],
                INSERTED.[DevelopmentNeighbourhoodPlanSubmitted],
                INSERTED.[DevelopmentNeighbourhoodPlanChanges]) FROM INSERTED;
             
            UPDATE [HASLPASubmission]
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
      'ALTER TABLE [dbo].[HASLPASubmission] ENABLE TRIGGER [AfterInsertHASLPASubmission]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASAppealSubmission]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASAppealSubmission] ON [dbo].[HASAppealSubmission]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
        @AppealID UNIQUEIDENTIFIER,
        @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;

            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

            SELECT @CheckSumRow = CHECKSUM(@AppealID,
                INSERTED.[CreatorEmailAddress],
                INSERTED.[CreatorName],
                INSERTED.[CreatorOriginalApplicant],
                INSERTED.[CreatorOnBehalfOf],
                INSERTED.[OriginalApplicationNumber],
                INSERTED.[SiteOwnership],
                INSERTED.[SiteInformOwners],
                INSERTED.[SiteRestriction],
                INSERTED.[SiteRestrictionDetails],
                INSERTED.[SafetyConcern],
                INSERTED.[SafetyConcernDetails],
                INSERTED.[SensitiveInformation],
                INSERTED.[TermsAgreed],
                INSERTED.[DecisionDate],
                INSERTED.[SubmissionDate]) FROM INSERTED;

                UPDATE [HASAppealSubmission]
                SET [LatestEvent] = 0
                WHERE [AppealID] = @AppealID
                    AND [LatestEvent] = 1
                    AND [ID] <> @ID;

                UPDATE [HASAppealSubmission]
                SET [CheckSumRow] = @CheckSumRow
                WHERE [ID] = @ID;
            END
    `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[MessageQueue] ENABLE TRIGGER [AfterInsertHASAppealSubmission]'
    );

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
                INSERTED.[MinisterialTargetDate],
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
                INSERTED.[DescriptionDevelopment]) FROM INSERTED;
                    
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
                INSERTED.[LocalPlanningAuthorityID]) FROM INSERTED;
                    
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

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASLPASubmission]');

    await queryInterface.sequelize.query(`
        CREATE TRIGGER [dbo].[AfterInsertHASLPASubmission] ON [dbo].[HASLPASubmission]
        FOR INSERT
        AS DECLARE @ID UNIQUEIDENTIFIER,
            @AppealID UNIQUEIDENTIFIER,
            @CheckSumRow INT;
        BEGIN
            SET NOCOUNT ON;
                
            SELECT @ID = INSERTED.ID FROM INSERTED;
            SELECT @AppealID = INSERTED.AppealID FROM INSERTED;
                
            SELECT @CheckSumRow = CHECKSUM(
                INSERTED.[LPAQuestionnaireID],
                INSERTED.[AppealID],
                INSERTED.[SubmissionDate],
                INSERTED.[SubmissionAccuracy],
                INSERTED.[SubmissionAccuracyDetails],
                INSERTED.[ExtraConditions],
                INSERTED.[ExtraConditionsDetails],
                INSERTED.[AdjacentAppeals],
                INSERTED.[AdjacentAppealsNumbers],
                INSERTED.[CannotSeeLand],
                INSERTED.[SiteAccess],
                INSERTED.[SiteAccessDetails],
                INSERTED.[SiteNeighbourAccess],
                INSERTED.[SiteNeighbourAccessDetails],
                INSERTED.[HealthAndSafetyIssues],
                INSERTED.[HealthAndSafetyDetails],
                INSERTED.[AffectListedBuilding],
                INSERTED.[AffectListedBuildingDetails],
                INSERTED.[GreenBelt],
                INSERTED.[ConservationArea],
                INSERTED.[OriginalPlanningApplicationPublicised],
                INSERTED.[DevelopmentNeighbourhoodPlanSubmitted],
                INSERTED.[DevelopmentNeighbourhoodPlanChanges]) FROM INSERTED;
             
            UPDATE [HASLPASubmission]
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
      'ALTER TABLE [dbo].[HASLPASubmission] ENABLE TRIGGER [AfterInsertHASLPASubmission]'
    );
  },
};

module.exports = migration;

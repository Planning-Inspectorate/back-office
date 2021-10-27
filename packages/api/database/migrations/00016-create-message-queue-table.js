const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MessageQueue', {
      ID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      AppealID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      QueueType: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      EventTimeStamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE,
        allowNull: false,
      },
      Processed: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      Data: {
        type: Sequelize.STRING(4000),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('MessageQueue', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_MessageQueue',
    });
    await queryInterface.addConstraint('MessageQueue', {
      fields: ['QueueType'],
      type: 'foreign key',
      name: 'FK_MessageQueue_LookUpQueueType',
      references: {
        table: 'LookUpQueueType',
        field: 'ID',
      },
    });
    await queryInterface.addIndex('MessageQueue', ['AppealID'], {
      name: 'IX_APPEALID',
    });
    await queryInterface.sequelize.query(`
      CREATE TRIGGER [dbo].[AfterInsertMessageQueue] ON [dbo].[MessageQueue]
      FOR INSERT
      AS DECLARE @ID UNIQUEIDENTIFIER,
          @RowID INT,
          @AppealID UNIQUEIDENTIFIER,
          @QueueType INT,
          @Data NVARCHAR(4000);
      BEGIN
          SET NOCOUNT ON;

          SET @ID = NEWID();
          SELECT @RowID = INSERTED.ID FROM INSERTED;
          SELECT @AppealID = INSERTED.AppealID FROM INSERTED;
          SELECT @QueueType = INSERTED.QueueType FROM INSERTED;
          SELECT @Data = INSERTED.DATA FROM INSERTED;

          IF (@QueueType = 1)
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
                  [SiteRestrictionsDetails],
                  [SafetyConcern],
                  [SafetyConcernDetails],
                  [SensitiveInformation],
                  [TermsAgreed],
                  [DecisionDate],
                  [SubmissionDate])
              VALUES
                  (@ID,
                  @AppealID,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.email')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.email') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.name') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.isOriginalApplicant')='TRUE' THEN 1 ELSE 0 END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.appealingOnBehalfOf') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.requiredDocumentsSection.applicationNumber')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.requiredDocumentsSection.applicationNumber') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteOwnership.ownsWholeSite')='TRUE' THEN 1 ELSE 0 END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold')='TRUE' THEN 1 ELSE 0 END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad')='TRUE' THEN 1 ELSE 0 END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.healthAndSafety.hasIssues')='TRUE' THEN 1 ELSE 0 END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.yourAppealSection.appealStatement.hasSensitiveInformation')='TRUE' THEN 1 ELSE 0 END,
                  1,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.decisionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.decisionDate') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.submissionDate') END
              );

              INSERT INTO [HASAppeal]
                  ([ID],
                  [AppealID])
              VALUES(
                  @ID,
                  @AppealID
              );

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
                  [LocalPlanningAuthorityID])
              VALUES(
                  @ID,
                  @AppealID,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.horizonId')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.horizonId') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.name')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.aboutYouSection.yourDetails.name') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.addressLine1')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.addressLine1') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.addressLine2')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.addressLine2') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.town')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.town') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.county')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.county') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.postcode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.appealSiteSection.siteAddress.postcode') END,
                  CASE WHEN JSON_VALUE(@Data,'$.appeal.lpaCode')='' THEN NULL ELSE JSON_VALUE(@Data,'$.appeal.lpaCode') END
              );
          END
          ELSE
          BEGIN
              IF (@QueueType = 2)
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
                      [DevelopmentNeighbourhoodPlanChanges]
                  )
                  VALUES(
                      @ID,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.id')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.id') END,
                      @AppealID,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.submissionDate')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.submissionDate') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.submissionAccuracy.accurateSubmission')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.submissionAccuracy.inaccuracyReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.aboutAppealSection.submissionAccuracy.inaccuracyReason') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.extraConditions.hasExtraConditions')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.extraConditions.extraConditions')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.aboutAppealSection.extraConditions.extraConditions') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.otherAppeals.adjacentAppeals')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.aboutAppealSection.otherAppeals.appealReferenceNumbers')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.aboutAppealSection.otherAppeals.appealReferenceNumbers') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.siteSeenPublicLand')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.enterAppealSite.mustEnter')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.enterAppealSite.enterReasons')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.enterAppealSite.enterReasons') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.accessNeighboursLand.needsAccess')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.accessNeighboursLand.addressAndReason')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.accessNeighboursLand.addressAndReason') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.healthSafety.hasHealthSafety')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.healthSafety.healthSafetyIssues')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.healthSafety.healthSafetyIssues') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.listedBuilding.affectSetting')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.listedBuilding.buildingDetails')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.listedBuilding.buildingDetails') END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.greenBelt')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.nearConservationArea')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.originalPlanningApplicationPublicised')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.developmentOrNeighbourhood.hasPlanSubmitted')='TRUE' THEN 1 ELSE 0 END,
                      CASE WHEN JSON_VALUE(@Data,'$.reply.developmentOrNeighbourhood.planChanges')='' THEN NULL ELSE JSON_VALUE(@Data,'$.reply.developmentOrNeighbourhood.planChanges') END
                  );
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
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('MessageQueue');
  },
};

module.exports = migration;

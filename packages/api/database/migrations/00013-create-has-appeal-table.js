const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HASAppeal', {
      ID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      AppealID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      MinisterialTargetDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE,
        allowNull: false,
      },
      RecommendedSiteVisitTypeID: {
        type: Sequelize.INTEGER,
      },
      SiteVisitTypeID: {
        type: Sequelize.INTEGER,
      },
      CaseOfficerFirstName: {
        type: Sequelize.STRING(64),
      },
      CaseOfficerSurname: {
        type: Sequelize.STRING(64),
      },
      CaseOfficerID: {
        type: Sequelize.UUID,
      },
      LPAQuestionnaireReviewOutcomeID: {
        type: Sequelize.INTEGER,
      },
      LPAIncompleteReasons: {
        type: Sequelize.STRING(4000),
      },
      ValidationOfficerFirstName: {
        type: Sequelize.STRING(64),
      },
      ValidationOfficerSurname: {
        type: Sequelize.STRING(64),
      },
      ValidationOfficerID: {
        type: Sequelize.UUID,
      },
      ValidationOutcomeID: {
        type: Sequelize.INTEGER,
      },
      InvalidReasonOtherDetails: {
        type: Sequelize.STRING(4000),
      },
      InvalidAppealReasons: {
        type: Sequelize.STRING(4000),
      },
      InspectorFirstName: {
        type: Sequelize.STRING(64),
      },
      InspectorSurname: {
        type: Sequelize.STRING(64),
      },
      InspectorID: {
        type: Sequelize.UUID,
      },
      InspectorSpecialismID: {
        type: Sequelize.INTEGER,
      },
      ScheduledSiteVisitDate: {
        type: Sequelize.DATE,
      },
      DecisionOutcomeID: {
        type: Sequelize.INTEGER,
      },
      DecisionLetterID: {
        type: Sequelize.UUID,
      },
      DecisionDate: {
        type: Sequelize.DATE,
      },
      DescriptionDevelopment: {
        type: Sequelize.STRING(4000),
      },
      LatestEvent: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1,
        allowNull: false,
      },
      EventDateTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE,
      },
      EventUserID: {
        type: Sequelize.UUID,
        defaultValue: '00000000-0000-0000-0000-000000000000',
      },
      EventUserName: {
        type: Sequelize.STRING(256),
        defaultValue: 'SYSTEM',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_HASAppeal',
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['RecommendedSiteVisitTypeID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpSiteVisitType_Recommended',
      references: {
        table: 'LookUpSiteVisitType',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['SiteVisitTypeID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpSiteVisitType',
      references: {
        table: 'LookUpSiteVisitType',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['ValidationOutcomeID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpValidationOutcome',
      references: {
        table: 'LookUpValidationOutcome',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['DecisionOutcomeID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpDecisionOutcome',
      references: {
        table: 'LookUpDecisionOutcome',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['LPAQuestionnaireReviewOutcomeID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpQuestionnaireOutcome',
      references: {
        table: 'LookUpQuestionnaireOutcome',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('HASAppeal', {
      fields: ['InspectorSpecialismID'],
      type: 'foreign key',
      name: 'FK_HASAppeal_LookUpInspectorSpecialism',
      references: {
        table: 'LookUpInspectorSpecialism',
        field: 'ID',
      },
    });
    await queryInterface.addIndex('HASAppeal', ['AppealID'], {
      name: 'IX_APPEALID',
    });
    await queryInterface.sequelize.query(`
      CREATE TRIGGER [dbo].[AfterInsertHASAppeal] ON [dbo].[HASAppeal]
      FOR INSERT
      AS DECLARE @ID UNIQUEIDENTIFIER,
          @AppealID UNIQUEIDENTIFIER;
      BEGIN
          SET NOCOUNT ON

          SELECT @ID = INSERTED.ID FROM INSERTED;
          SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

          UPDATE [HASAppeal]
          SET [LatestEvent] = 0
          WHERE [AppealID] = @AppealID
              AND [LatestEvent] = 1
              AND [ID] <> @ID
      END
    `);
    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASAppeal] ENABLE TRIGGER [AfterInsertHASAppeal]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('HASAppeal');
  },
};

module.exports = migration;

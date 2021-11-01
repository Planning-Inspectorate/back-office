const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HASLPASubmission', {
      ID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      LPAQuestionnaireID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      AppealID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      SubmissionDate: {
        type: Sequelize.DATE,
      },
      SubmissionAccuracy: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SubmissionAccuracyDetails: {
        type: Sequelize.STRING(4000),
      },
      ExtraConditions: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      ExtraConditionsDetails: {
        type: Sequelize.STRING(4000),
      },
      AdjacentAppeals: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      AdjacentAppealsNumbers: {
        type: Sequelize.STRING(100),
      },
      CannotSeeLand: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteAccess: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteAccessDetails: {
        type: Sequelize.STRING(4000),
      },
      SiteNeighbourAccess: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteNeighbourAccessDetails: {
        type: Sequelize.STRING(4000),
      },
      HealthAndSafetyIssues: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      HealthAndSafetyDetails: {
        type: Sequelize.STRING(4000),
      },
      AffectListedBuilding: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      AffectListedBuildingDetails: {
        type: Sequelize.STRING(4000),
      },
      GreenBelt: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      ConservationArea: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      OriginalPlanningApplicationPublicised: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      DevelopmentNeighbourhoodPlanSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      DevelopmentNeighbourhoodPlanChanges: {
        type: Sequelize.STRING(4000),
      },
      QuestionnaireStatusID: {
        type: Sequelize.INTEGER,
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
      CheckSumRow: {
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint('HASLPASubmission', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_HASLPASubmission',
    });
    await queryInterface.addConstraint('HASLPASubmission', {
      fields: ['QuestionnaireStatusID'],
      type: 'foreign key',
      name: 'FK_HASLPASubmission_LookUpQuestionnaireStatus',
      references: {
        table: 'LookUpQuestionnaireStatus',
        field: 'ID',
      },
    });
    await queryInterface.addIndex('HASLPASubmission', ['LPAQuestionnaireID'], {
      name: 'IX_LPAQUESTIONNAIREID',
    });
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('HASLPASubmission');
  },
};

module.exports = migration;

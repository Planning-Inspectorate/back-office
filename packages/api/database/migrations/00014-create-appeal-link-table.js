const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AppealLink', {
      ID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      AppealID: {
        type: Sequelize.UUID,
      },
      LPAQuestionnaireID: {
        type: Sequelize.UUID,
      },
      CaseReference: {
        type: Sequelize.INTEGER,
      },
      CaseTypeID: {
        type: Sequelize.INTEGER,
      },
      CaseStageID: {
        type: Sequelize.INTEGER,
      },
      CaseStatusID: {
        type: Sequelize.INTEGER,
      },
      AppellantName: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      SiteAddressLineOne: {
        type: Sequelize.STRING(60),
      },
      SiteAddressLineTwo: {
        type: Sequelize.STRING(60),
      },
      SiteAddressTown: {
        type: Sequelize.STRING(60),
      },
      SiteAddressCounty: {
        type: Sequelize.STRING(60),
      },
      SiteAddressPostCode: {
        type: Sequelize.STRING(8),
      },
      LocalPlanningAuthorityID: {
        type: Sequelize.STRING(9),
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
    await queryInterface.addConstraint('AppealLink', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_AppealLink',
    });
    await queryInterface.addConstraint('AppealLink', {
      fields: ['CaseTypeID'],
      type: 'foreign key',
      name: 'FK_AppealLink_LookUpCaseType',
      references: {
        table: 'LookUpCaseType',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('AppealLink', {
      fields: ['CaseStageID'],
      type: 'foreign key',
      name: 'FK_AppealLink_LookUpCaseStage',
      references: {
        table: 'LookUpCaseStage',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('AppealLink', {
      fields: ['CaseStatusID'],
      type: 'foreign key',
      name: 'FK_AppealLink_LookUpCaseStatus',
      references: {
        table: 'LookUpCaseStatus',
        field: 'ID',
      },
    });
    await queryInterface.addConstraint('AppealLink', {
      fields: ['LocalPlanningAuthorityID'],
      type: 'foreign key',
      name: 'FK_AppealLink_LookUpLPA',
      references: {
        table: 'LookUpLPA',
        field: 'LPA19Code',
      },
    });
    await queryInterface.addIndex('AppealLink', ['AppealID'], {
      name: 'IX_APPEALID',
    });
    await queryInterface.sequelize.query(`
      CREATE TRIGGER [dbo].[AfterInsertAppealLink] ON [dbo].[AppealLink]
      FOR INSERT
      AS DECLARE @ID UNIQUEIDENTIFIER,
          @AppealID UNIQUEIDENTIFIER;
      BEGIN
          SET NOCOUNT ON

          SELECT @ID = INSERTED.ID FROM INSERTED;
          SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

          UPDATE [AppealLink]
          SET [LatestEvent] = 0
          WHERE [AppealID] = @AppealID
              AND [LatestEvent] = 1
              AND [ID] <> @ID
      END
    `);
    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[AppealLink] ENABLE TRIGGER [AfterInsertAppealLink]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('AppealLink');
  },
};

module.exports = migration;

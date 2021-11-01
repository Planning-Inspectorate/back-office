const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HASAppealSubmission', {
      ID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      AppealID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      CreatorEmailAddress: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      CreatorName: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      CreatorOriginalApplicant: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      CreatorOnBehalfOf: {
        type: Sequelize.STRING(80),
      },
      OriginalApplicationNumber: {
        type: Sequelize.STRING(30),
      },
      SiteOwnership: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteInformOwners: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteRestriction: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SiteRestrictionDetails: {
        type: Sequelize.STRING(255),
      },
      SafetyConcern: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      SafetyConcernDetails: {
        type: Sequelize.STRING(255),
      },
      SensitiveInformation: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      TermsAgreed: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        allowNull: false,
      },
      DecisionDate: {
        type: Sequelize.DATE,
      },
      SubmissionDate: {
        type: Sequelize.DATE,
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
    await queryInterface.addConstraint('HASAppealSubmission', {
      fields: ['ID'],
      type: 'primary key',
      name: 'PK_HASAppealSubmission',
    });
    await queryInterface.addIndex('HASAppealSubmission', ['AppealID'], { name: 'IX_APPEALID' });
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
                AND [ID] <> @ID
         
            UPDATE [HASAppealSubmission]
            SET [CheckSumRow] = @CheckSumRow
            WHERE [ID] = @ID;
        END
    `);
    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASAppealSubmission] ENABLE TRIGGER [AfterInsertHASAppealSubmission]'
    );
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('HASAppealSubmission');
  },
};

module.exports = migration;

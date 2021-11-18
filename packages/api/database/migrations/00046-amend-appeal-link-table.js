const migration = {
  up: async (queryInterface) => {
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
                  INSERTED.[CaseTypeId],
                  INSERTED.[CaseStageId],
                  INSERTED.[CaseStatusId],
                  INSERTED.[AppellantName],
                  INSERTED.[SiteAddressLineOne],
                  INSERTED.[SiteAddressLineTwo],
                  INSERTED.[SiteAddressTown],
                  INSERTED.[SiteAddressCounty],
                  INSERTED.[SiteAddressPostCode],
                  INSERTED.[LocalPlanningAuthorityID],
                  INSERTED.[EventUserID],
                  INSERTED.[EventUserName],
                  INSERTED.[QuestionnaireStatusID]) FROM INSERTED;

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
  },
};

module.exports = migration;

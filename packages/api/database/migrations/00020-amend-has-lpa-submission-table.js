const migration = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('HASLPASubmission', 'CheckSumRow', Sequelize.INTEGER);

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
  down: async (queryInterface) => {
    await queryInterface.removeColumn('HASLPASubmission', 'CheckSumRow');

    await queryInterface.sequelize.query('DROP TRIGGER [AfterInsertHASLPASubmission]');

    await queryInterface.sequelize.query(`
            CREATE TRIGGER [dbo].[AfterInsertHASLPASubmission] ON [dbo].[HASLPASubmission]
            FOR INSERT
            AS DECLARE @ID UNIQUEIDENTIFIER,
                @AppealID UNIQUEIDENTIFIER;
            BEGIN
                SET NOCOUNT ON;
    
                SELECT @ID = INSERTED.ID FROM INSERTED;
                SELECT @AppealID = INSERTED.AppealID FROM INSERTED;
    
                UPDATE [HASLPASubmission]
                SET [LatestEvent] = 0
                WHERE [AppealID] = @AppealID
                    AND [LatestEvent] = 1
                    AND [ID] <> @ID
            END
        `);

    await queryInterface.sequelize.query(
      'ALTER TABLE [dbo].[HASLPASubmission] ENABLE TRIGGER [AfterInsertHASLPASubmission]'
    );
  },
};

module.exports = migration;

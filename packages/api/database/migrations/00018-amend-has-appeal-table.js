const migration = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.addColumn('HASAppeal',
            'CheckSumRow',
            {
                type: Sequelize.INT,
            });

        await queryInterface.sequelize.query(
            'DROP TRIGGER [AfterInsertHASAppeal]'
        );

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
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('HASAppeal',
            'CheckSumRow');

        await queryInterface.sequelize.query(
            'DROP TRIGGER [AfterInsertHASAppealSubmission]'
        );

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
};

module.exports = migration;

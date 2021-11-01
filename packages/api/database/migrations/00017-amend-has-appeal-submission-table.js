const migration = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('HASAppealSubmission',
            'SiteRestrictionsDetails',
            'SiteRestrictionDetails');

        await queryInterface.addColumn('HASAppealSubmission',
            'CheckSumRow',
            {
                type: Sequelize.INT,
            });

        await queryInterface.sequelize.query(
            'DROP TRIGGER [AfterInsertHASAppealSubmission]'
        );

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
            'ALTER TABLE [dbo].[HASAppealSubmission] ENABLE TRIGGER [AfterInsertHASAppealSubmission]'
        );
    },
    down: async (queryInterface) => {
        await queryInterface.renameColumn('HASAppealSubmission',
            'SiteRestrictionDetails',
            'SiteRestrictionsDetails');

        await queryInterface.removeColumn('HASAppealSubmission',
            'CheckSumRow');

        await queryInterface.sequelize.query(
            'DROP TRIGGER [AfterInsertHASAppealSubmission]'
        );

        await queryInterface.sequelize.query(`
            CREATE TRIGGER [dbo].[AfterInsertHASAppealSubmission] ON [dbo].[HASAppealSubmission]  
            FOR INSERT
            AS DECLARE @ID UNIQUEIDENTIFIER,
                @AppealID UNIQUEIDENTIFIER;
            BEGIN
                SET NOCOUNT ON

                SELECT @ID = INSERTED.ID FROM INSERTED;
                SELECT @AppealID = INSERTED.AppealID FROM INSERTED;

                UPDATE [HASAppealSubmission]
                SET [LatestEvent] = 0
                WHERE [AppealID] = @AppealID
                    AND [LatestEvent] = 1
                    AND [ID] <> @ID
            END
        `);

        await queryInterface.sequelize.query(
            'ALTER TABLE [dbo].[HASAppealSubmission] ENABLE TRIGGER [AfterInsertHASAppealSubmission]'
        );
    },
};

module.exports = migration;

const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
        CREATE OR ALTER PROCEDURE [dbo].[ViewAppealSearch]       
            (@strFind AS VARCHAR(MAX))
        AS
        BEGIN
            SET NOCOUNT ON; 
            SELECT  AppealID, SiteAddressLineOne, SiteAddressPostCode FROM APPEALLINK 
                WHERE (PATINDEX('%'+@strFind+'%', SiteAddressPostcode) > 0
                    OR PATINDEX('%'+@strFind+'%', SiteAddressLineOne) > 0
                    OR PATINDEX('%'+@strFind+'%', CAST(CaseReference AS NVARCHAR)) > 0
                    OR PATINDEX('%'+@strFind+'%', AppellantName) > 0)
                AND APPEALLINK.LATESTEVENT = 1
        END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE ViewAppealSearch');
  },
};

module.exports = migration;

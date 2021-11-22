const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE ViewAppealSearch');
    await queryInterface.sequelize.query(`
        CREATE OR ALTER PROCEDURE [dbo].[ViewAppealSearch]
            (@strFind AS VARCHAR(MAX))
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT
                AppealLink.AppealID AS appealId,
                AppealLink.CaseReference AS caseReference,
                AppealLink.AppellantName AS appellantName,
                STUFF(ISNULL(', '+AppealLink.SiteAddressLineOne,'')+ISNULL(', '+AppealLink.SiteAddressLineTwo,'')+ISNULL(', '+AppealLink.SiteAddressTown,'')+ISNULL(', '+AppealLink.SiteAddressCounty,'')+ISNULL(', '+AppealLink.SiteAddressPostCode,''),1,2,'') AS siteAddress
            FROM APPEALLINK
            INNER JOIN HASAppealSubmission on AppealLink.AppealID = HASAppealSubmission.AppealID AND HASAppealSubmission.LatestEvent = 1
            WHERE (PATINDEX('%'+@strFind+'%', AppealLink.SiteAddressPostcode) > 0
                OR PATINDEX('%'+@strFind+'%', AppealLink.SiteAddressLineOne) > 0
                OR PATINDEX('%'+@strFind+'%', CAST(AppealLink.CaseReference AS NVARCHAR)) > 0
                OR PATINDEX('%'+@strFind+'%', AppealLink.AppellantName) > 0
                OR PATINDEX('%'+@strFind+'%', HASAppealSubmission.OriginalApplicationNumber) > 0)
            AND APPEALLINK.LATESTEVENT = 1
            ORDER BY HASAppealSubmission.SubmissionDate ASC, AppealLink.AppellantName ASC
        END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE ViewAppealSearch');
    await queryInterface.sequelize.query(`
        CREATE OR ALTER PROCEDURE [dbo].[ViewAppealSearch]
            (@strFind AS VARCHAR(MAX))
        AS
        BEGIN
            SET NOCOUNT ON;
            SELECT  AppealID, CaseReference, AppellantName, STUFF(ISNULL(', '+SiteAddressLineOne,'')+ISNULL(', '+SiteAddressLineTwo,'')+ISNULL(', '+SiteAddressTown,'')+ISNULL(', '+SiteAddressCounty,'')+ISNULL(', '+SiteAddressPostCode,''),1,2,'') AS Address FROM APPEALLINK
            WHERE (PATINDEX('%'+@strFind+'%', SiteAddressPostcode) > 0
                OR PATINDEX('%'+@strFind+'%', SiteAddressLineOne) > 0
                OR PATINDEX('%'+@strFind+'%', CAST(CaseReference AS NVARCHAR)) > 0
                OR PATINDEX('%'+@strFind+'%', AppellantName) > 0)
            AND APPEALLINK.LATESTEVENT = 1
        END
    `);
  },
};

module.exports = migration;

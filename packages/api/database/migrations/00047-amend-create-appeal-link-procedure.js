const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateAppealLink');
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE CreateAppealLink
      @json NVARCHAR(4000)
    AS
    DECLARE
      @appealId CHAR(36),
      @lpaQuestionnaireId CHAR(36),
      @caseReference INT,
      @caseTypeId INT,
      @caseStageId INT,
      @caseStatusId INT,
      @appellantName NVARCHAR(80),
      @siteAddressLineOne NVARCHAR(60),
      @siteAddressLineTwo NVARCHAR(60),
      @siteAddressTown NVARCHAR(60),
      @siteAddressCounty NVARCHAR(60),
      @siteAddressPostcode NVARCHAR(8),
      @localPlanningAuthorityId NVARCHAR(9),
      @eventUserId CHAR(36),
      @eventUserName NVARCHAR(256),
      @questionnaireStatusId INT
    BEGIN
      SET @appealId = JSON_VALUE(@json, '$.appealId')

      SELECT
        @lpaQuestionnaireId = LPAQuestionnaireID,
        @caseReference = CaseReference,
        @caseTypeId = CaseTypeID,
        @caseStageId = CaseStageID,
        @caseStatusId = CaseStatusID,
        @appellantName = AppellantName,
        @siteAddressLineOne = SiteAddressLineOne,
        @siteAddressLineTwo = SiteAddressLineTwo,
        @siteAddressTown = SiteAddressTown,
        @siteAddressCounty = SiteAddressCounty,
        @siteAddressPostcode = SiteAddressPostcode,
        @localPlanningAuthorityId = LocalPlanningAuthorityID,
        @questionnaireStatusId = QuestionnaireStatusID
      FROM AppealLink (NOLOCK)
      WHERE AppealID = @appealId AND LatestEvent = 1;

      IF JSON_VALUE(@json, '$.lpaQuestionnaireId') IS NOT NULL
        SET @lpaQuestionnaireId = JSON_VALUE(@json, '$.lpaQuestionnaireId')

      IF JSON_VALUE(@json, '$.caseReference') IS NOT NULL
        SET @caseReference = JSON_VALUE(@json, '$.caseReference')

      IF JSON_VALUE(@json, '$.caseTypeId') IS NOT NULL
        SET @caseTypeId = JSON_VALUE(@json, '$.caseTypeId')

      IF JSON_VALUE(@json, '$.caseStageId') IS NOT NULL
        SET @caseStageId = JSON_VALUE(@json, '$.caseStageId')

      IF JSON_VALUE(@json, '$.caseStatusId') IS NOT NULL
        SET @caseStatusId = JSON_VALUE(@json, '$.caseStatusId')

      IF JSON_VALUE(@json, '$.appellantName') IS NOT NULL
        SET @appellantName = JSON_VALUE(@json, '$.appellantName')

      IF JSON_VALUE(@json, '$.siteAddressLineOne') IS NOT NULL
        SET @siteAddressLineOne = JSON_VALUE(@json, '$.siteAddressLineOne')

      IF JSON_VALUE(@json, '$.siteAddressLineTwo') IS NOT NULL
        SET @siteAddressLineTwo = JSON_VALUE(@json, '$.siteAddressLineTwo')

      IF JSON_VALUE(@json, '$.siteAddressTown') IS NOT NULL
        SET @siteAddressTown = JSON_VALUE(@json, '$.siteAddressTown')

      IF JSON_VALUE(@json, '$.siteAddressCounty') IS NOT NULL
        SET @siteAddressCounty = JSON_VALUE(@json, '$.siteAddressCounty')

      IF JSON_VALUE(@json, '$.siteAddressPostcode') IS NOT NULL
        SET @siteAddressPostcode = JSON_VALUE(@json, '$.siteAddressPostcode')

      IF JSON_VALUE(@json, '$.localPlanningAuthorityId') IS NOT NULL
        SET @localPlanningAuthorityId = JSON_VALUE(@json, '$.localPlanningAuthorityId')

      IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
        SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

      IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
        SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

      IF JSON_VALUE(@json, '$.questionnaireStatusId') IS NOT NULL
        SET @questionnaireStatusId = JSON_VALUE(@json, '$.questionnaireStatusId')

      INSERT INTO AppealLink (
        ID,
        AppealID,
        LPAQuestionnaireID,
        CaseReference,
        CaseTypeID,
        CaseStageID,
        CaseStatusID,
        AppellantName,
        SiteAddressLineOne,
        SiteAddressLineTwo,
        SiteAddressTown,
        SiteAddressCounty,
        SiteAddressPostcode,
        LocalPlanningAuthorityID,
        EventUserID,
        EventUserName,
        QuestionnaireStatusID
      )
      VALUES (
        newid(),
        @appealId,
        @lpaQuestionnaireId,
        @caseReference,
        @caseTypeId,
        @caseStageId,
        @caseStatusId,
        @appellantName,
        @siteAddressLineOne,
        @siteAddressLineTwo,
        @siteAddressTown,
        @siteAddressCounty,
        @siteAddressPostcode,
        @localPlanningAuthorityId,
        @eventUserId,
        @eventUserName,
        @questionnaireStatusId
      );
    END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateAppealLink');
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE CreateAppealLink
        @json NVARCHAR(4000)
      AS
      DECLARE
        @appealId CHAR(36),
        @lpaQuestionnaireId CHAR(36),
        @caseReference INT,
        @caseTypeId INT,
        @caseStageId INT,
        @caseStatusId INT,
        @appellantName NVARCHAR(80),
        @siteAddressLineOne NVARCHAR(60),
        @siteAddressLineTwo NVARCHAR(60),
        @siteAddressTown NVARCHAR(60),
        @siteAddressCounty NVARCHAR(60),
        @siteAddressPostcode NVARCHAR(8),
        @localPlanningAuthorityId NVARCHAR(9),
        @eventUserId CHAR(36),
        @eventUserName NVARCHAR(256)
      BEGIN
        SET @appealId = JSON_VALUE(@json, '$.appealId')

        SELECT
          @lpaQuestionnaireId = LPAQuestionnaireID,
          @caseReference = CaseReference,
          @caseTypeId = CaseTypeID,
          @caseStageId = CaseStageID,
          @caseStatusId = CaseStatusID,
          @appellantName = AppellantName,
          @siteAddressLineOne = SiteAddressLineOne,
          @siteAddressLineTwo = SiteAddressLineTwo,
          @siteAddressTown = SiteAddressTown,
          @siteAddressCounty = SiteAddressCounty,
          @siteAddressPostcode = SiteAddressPostcode,
          @localPlanningAuthorityId = LocalPlanningAuthorityID
        FROM AppealLink (NOLOCK)
        WHERE AppealID = @appealId AND LatestEvent = 1;

        IF JSON_VALUE(@json, '$.lpaQuestionnaireId') IS NOT NULL
          SET @lpaQuestionnaireId = JSON_VALUE(@json, '$.lpaQuestionnaireId')

        IF JSON_VALUE(@json, '$.caseReference') IS NOT NULL
          SET @caseReference = JSON_VALUE(@json, '$.caseReference')

        IF JSON_VALUE(@json, '$.caseTypeId') IS NOT NULL
          SET @caseTypeId = JSON_VALUE(@json, '$.caseTypeId')

        IF JSON_VALUE(@json, '$.caseStageId') IS NOT NULL
          SET @caseStageId = JSON_VALUE(@json, '$.caseStageId')

        IF JSON_VALUE(@json, '$.caseStatusId') IS NOT NULL
          SET @caseStatusId = JSON_VALUE(@json, '$.caseStatusId')

        IF JSON_VALUE(@json, '$.appellantName') IS NOT NULL
          SET @appellantName = JSON_VALUE(@json, '$.appellantName')

        IF JSON_VALUE(@json, '$.siteAddressLineOne') IS NOT NULL
          SET @siteAddressLineOne = JSON_VALUE(@json, '$.siteAddressLineOne')

        IF JSON_VALUE(@json, '$.siteAddressLineTwo') IS NOT NULL
          SET @siteAddressLineTwo = JSON_VALUE(@json, '$.siteAddressLineTwo')

        IF JSON_VALUE(@json, '$.siteAddressTown') IS NOT NULL
          SET @siteAddressTown = JSON_VALUE(@json, '$.siteAddressTown')

        IF JSON_VALUE(@json, '$.siteAddressCounty') IS NOT NULL
          SET @siteAddressCounty = JSON_VALUE(@json, '$.siteAddressCounty')

        IF JSON_VALUE(@json, '$.siteAddressPostcode') IS NOT NULL
          SET @siteAddressPostcode = JSON_VALUE(@json, '$.siteAddressPostcode')

        IF JSON_VALUE(@json, '$.localPlanningAuthorityId') IS NOT NULL
          SET @localPlanningAuthorityId = JSON_VALUE(@json, '$.localPlanningAuthorityId')

        IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
          SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

        IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
          SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

        INSERT INTO AppealLink (
          ID,
          AppealID,
          LPAQuestionnaireID,
          CaseReference,
          CaseTypeID,
          CaseStageID,
          CaseStatusID,
          AppellantName,
          SiteAddressLineOne,
          SiteAddressLineTwo,
          SiteAddressTown,
          SiteAddressCounty,
          SiteAddressPostcode,
          LocalPlanningAuthorityID,
          EventUserID,
          EventUserName
        )
        VALUES (
          newid(),
          @appealId,
          @lpaQuestionnaireId,
          @caseReference,
          @caseTypeId,
          @caseStageId,
          @caseStatusId,
          @appellantName,
          @siteAddressLineOne,
          @siteAddressLineTwo,
          @siteAddressTown,
          @siteAddressCounty,
          @siteAddressPostcode,
          @localPlanningAuthorityId,
          @eventUserId,
          @eventUserName
        );
      END
    `);
  },
};

module.exports = migration;

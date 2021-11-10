const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
    CREATE PROCEDURE CreateHASAppeal
      @json VARCHAR(4000)
    AS
    DECLARE
      @appealId CHAR(36),
      @ministerialTargetDate DATE,
      @recommendedSiteVisitTypeId INT,
      @siteVisitTypeId INT,
      @caseOfficerFirstName NVARCHAR(64),
      @caseOfficerSurname NVARCHAR(64),
      @caseOfficerId CHAR(36),
      @LpaQuestionnaireReviewOutcomeId INT,
      @LpaIncompleteReasons NVARCHAR(4000),
      @validationOfficerFirstName NVARCHAR(64),
      @validationOfficerSurname NVARCHAR(64),
      @validationOfficerId CHAR(36),
      @validationOutcomeId INT,
      @invalidReasonOtherDetails NVARCHAR(4000),
      @invalidAppealReasons NVARCHAR(4000),
      @inspectorFirstName NVARCHAR(64),
      @inspectorSurname NVARCHAR(64),
      @inspectorId CHAR(36),
      @inspectorSpecialismId INT,
      @scheduledSiteVisitDate DATE,
      @decisionOutcomeId INT,
      @decisionLetterId CHAR(36),
      @decisionDate DATE,
      @descriptionDevelopment NVARCHAR(4000)
    BEGIN
      SET @appealId = JSON_VALUE(@json, '$.appealId')

      SELECT
        @ministerialTargetDate = MinisterialTargetDate,
        @recommendedSiteVisitTypeId = RecommendedSiteVisitTypeID,
        @siteVisitTypeId = SiteVisitTypeID,
        @caseOfficerFirstName = CaseOfficerFirstName,
        @caseOfficerSurname = CaseOfficerSurname,
        @caseOfficerId = CaseOfficerID,
        @lpaQuestionnaireReviewOutcomeId = LPAQuestionnaireReviewOutcomeID,
        @lpaIncompleteReasons = LPAIncompleteReasons,
        @validationOfficerFirstName = ValidationOfficerFirstName,
        @validationOfficerSurname = ValidationOfficerSurname,
        @validationOfficerId = ValidationOfficerID,
        @validationOutcomeId = ValidationOutcomeID,
        @invalidReasonOtherDetails = InvalidReasonOtherDetails,
        @invalidAppealReasons = InvalidAppealReasons,
        @inspectorFirstName = InspectorFirstName,
        @inspectorSurname = InspectorSurname,
        @inspectorId = InspectorID,
        @inspectorSpecialismId = InspectorSpecialismID,
        @scheduledSiteVisitDate = ScheduledSiteVisitDate,
        @decisionOutcomeId = DecisionOutcomeID,
        @decisionLetterId = DecisionLetterID,
        @decisionDate = DecisionDate,
        @descriptionDevelopment = DescriptionDevelopment
      FROM HASAppeal (NOLOCK)
      WHERE AppealID = @appealId AND LatestEvent = 1;

      IF JSON_VALUE(@json, '$.ministerialTargetDate') IS NOT NULL
        SET @ministerialTargetDate = JSON_VALUE(@json, '$.ministerialTargetDate')

      IF JSON_VALUE(@json, '$.recommendedSiteVisitTypeId') IS NOT NULL
        SET @recommendedSiteVisitTypeId = JSON_VALUE(@json, '$.recommendedSiteVisitTypeId')

      IF JSON_VALUE(@json, '$.siteVisitTypeId') IS NOT NULL
        SET @siteVisitTypeId = JSON_VALUE(@json, '$.siteVisitTypeId')

      IF JSON_VALUE(@json, '$.caseOfficerFirstName') IS NOT NULL
        SET @caseOfficerFirstName = JSON_VALUE(@json, '$.caseOfficerFirstName')

      IF JSON_VALUE(@json, '$.caseOfficerSurname') IS NOT NULL
        SET @caseOfficerSurname = JSON_VALUE(@json, '$.caseOfficerSurname')

      IF JSON_VALUE(@json, '$.caseOfficerId') IS NOT NULL
        SET @caseOfficerId = JSON_VALUE(@json, '$.caseOfficerId')

      IF JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId') IS NOT NULL
        SET @lpaQuestionnaireReviewOutcomeId = JSON_VALUE(@json, '$.lpaQuestionnaireReviewOutcomeId')

      IF JSON_VALUE(@json, '$.lpaIncompleteReasons') IS NOT NULL
        SET @lpaIncompleteReasons = JSON_VALUE(@json, '$.lpaIncompleteReasons')

      IF JSON_VALUE(@json, '$.validationOfficerFirstName') IS NOT NULL
        SET @validationOfficerFirstName = JSON_VALUE(@json, '$.validationOfficerFirstName')

      IF JSON_VALUE(@json, '$.validationOfficerSurname') IS NOT NULL
        SET @validationOfficerSurname = JSON_VALUE(@json, '$.validationOfficerSurname')

      IF JSON_VALUE(@json, '$.validationOfficerId') IS NOT NULL
        SET @validationOfficerId = JSON_VALUE(@json, '$.validationOfficerId')

      IF JSON_VALUE(@json, '$.validationOutcomeId') IS NOT NULL
        SET @validationOutcomeId = JSON_VALUE(@json, '$.validationOutcomeId')

      IF JSON_VALUE(@json, '$.invalidReasonOtherDetails') IS NOT NULL
        SET @invalidReasonOtherDetails = JSON_VALUE(@json, '$.invalidReasonOtherDetails')

      IF JSON_VALUE(@json, '$.invalidAppealReasons') IS NOT NULL
        SET @invalidAppealReasons = JSON_VALUE(@json, '$.invalidAppealReasons')

      IF JSON_VALUE(@json, '$.inspectorFirstName') IS NOT NULL
        SET @inspectorFirstName = JSON_VALUE(@json, '$.inspectorFirstName')

      IF JSON_VALUE(@json, '$.inspectorSurname') IS NOT NULL
        SET @inspectorSurname = JSON_VALUE(@json, '$.inspectorSurname')

      IF JSON_VALUE(@json, '$.inspectorId') IS NOT NULL
        SET @inspectorId = JSON_VALUE(@json, '$.inspectorId')

      IF JSON_VALUE(@json, '$.inspectorSpecialismId') IS NOT NULL
        SET @inspectorSpecialismId = JSON_VALUE(@json, '$.inspectorSpecialismId')

      IF JSON_VALUE(@json, '$.scheduledSiteVisitDate') IS NOT NULL
        SET @scheduledSiteVisitDate = JSON_VALUE(@json, '$.scheduledSiteVisitDate')

      IF JSON_VALUE(@json, '$.decisionOutcomeId') IS NOT NULL
        SET @decisionOutcomeId = JSON_VALUE(@json, '$.decisionOutcomeId')

      IF JSON_VALUE(@json, '$.decisionLetterId') IS NOT NULL
        SET @decisionLetterId = JSON_VALUE(@json, '$.decisionLetterId')

      IF JSON_VALUE(@json, '$.decisionDate') IS NOT NULL
        SET @decisionDate = JSON_VALUE(@json, '$.decisionDate')

      IF JSON_VALUE(@json, '$.descriptionDevelopment') IS NOT NULL
        SET @descriptionDevelopment = JSON_VALUE(@json, '$.descriptionDevelopment')

      INSERT INTO HASAppeal (
        ID,
        AppealID,
        MinisterialTargetDate,
        RecommendedSiteVisitTypeID,
        SiteVisitTypeID,
        CaseOfficerFirstName,
        CaseOfficerSurname,
        CaseOfficerID,
        LPAQuestionnaireReviewOutcomeID,
        LPAIncompleteReasons,
        ValidationOfficerFirstName,
        ValidationOfficerSurname,
        ValidationOfficerID,
        ValidationOutcomeID,
        InvalidReasonOtherDetails,
        InvalidAppealReasons,
        InspectorFirstName,
        InspectorSurname,
        InspectorID,
        InspectorSpecialismID,
        ScheduledSiteVisitDate,
        DecisionOutcomeID,
        DecisionLetterID,
        DecisionDate,
        DescriptionDevelopment
      )
      VALUES (
        newid(),
        @appealId,
        @ministerialTargetDate,
        @recommendedSiteVisitTypeId,
        @siteVisitTypeId,
        @caseOfficerFirstName,
        @caseOfficerSurname,
        @caseOfficerId,
        @LpaQuestionnaireReviewOutcomeId,
        @LpaIncompleteReasons,
        @validationOfficerFirstName,
        @validationOfficerSurname,
        @validationOfficerId,
        @validationOutcomeId,
        @invalidReasonOtherDetails,
        @invalidAppealReasons,
        @inspectorFirstName,
        @inspectorSurname,
        @inspectorId,
        @inspectorSpecialismId,
        @scheduledSiteVisitDate,
        @decisionOutcomeId,
        @decisionLetterId,
        @decisionDate,
        @descriptionDevelopment
      );
    END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASAppeal');
  },
};

module.exports = migration;

const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE PROCEDURE CreateHASLPASubmission
        @json NVARCHAR(4000)
      AS
      DECLARE
        @appealId CHAR(36),
        @lpaQuestionnaireId CHAR(36),
        @submissionDate DATE,
        @submissionAccuracy BIT,
        @submissionaccuracyDetails NVARCHAR(4000),
        @extraConditions BIT,
        @extraConditionsDetails NVARCHAR(4000),
        @adjacentAppeals BIT,
        @adjacentAppealsNumbers NVARCHAR(100),
        @cannotSeeLand BIT,
        @siteAccess BIT,
        @siteAccessDetails NVARCHAR(4000),
        @siteNeighbourAccess BIT,
        @siteNeighbourAccessDetails NVARCHAR(4000),
        @healthAndSafetyIssues BIT,
        @healthAndSafetyDetails NVARCHAR(4000),
        @affectListedBuilding BIT,
        @affectListedBuildingDetails NVARCHAR(4000),
        @greenBelt BIT,
        @conservationArea BIT,
        @originalPlanningApplicationPublicised BIT,
        @developmentNeighbourhoodPlanSubmitted BIT,
        @developmentNeighbourhoodPlanChanges NVARCHAR(4000),
        @questionnaireStatusId INT,
        @eventUserId CHAR(36),
        @eventUserName NVARCHAR(256)
      BEGIN
        SET @appealId = JSON_VALUE(@json, '$.appealId')

        SELECT
          @lpaQuestionnaireId = LPAQuestionnaireID,
          @submissionDate = SubmissionDate,
          @submissionAccuracy = SubmissionAccuracy,
          @submissionaccuracyDetails = SubmissionaccuracyDetails,
          @extraConditions = ExtraConditions,
          @extraConditionsDetails = ExtraConditionsDetails,
          @adjacentAppeals = AdjacentAppeals,
          @adjacentAppealsNumbers = AdjacentAppealsNumbers,
          @cannotSeeLand = CannotSeeLand,
          @siteAccess = SiteAccess,
          @siteAccessDetails = SiteAccessDetails,
          @siteNeighbourAccess = SiteNeighbourAccess,
          @siteNeighbourAccessDetails = SiteNeighbourAccessDetails,
          @healthAndSafetyIssues = HealthAndSafetyIssues,
          @healthAndSafetyDetails = HealthAndSafetyDetails,
          @affectListedBuilding = AffectListedBuilding,
          @affectListedBuildingDetails = AffectListedBuildingDetails,
          @greenBelt = GreenBelt,
          @conservationArea = ConservationArea,
          @originalPlanningApplicationPublicised = OriginalPlanningApplicationPublicised,
          @developmentNeighbourhoodPlanSubmitted = DevelopmentNeighbourhoodPlanSubmitted,
          @developmentNeighbourhoodPlanChanges = DevelopmentNeighbourhoodPlanChanges,
          @questionnaireStatusId = QuestionnaireStatusID,
          @eventUserId = EventUserID,
          @eventUserName = EventUserName
        FROM HASLPASubmission (NOLOCK)
        WHERE AppealID = @appealId AND LatestEvent = 1;

        IF JSON_VALUE(@json, '$.lpaQuestionnaireId') IS NOT NULL
          SET @lpaQuestionnaireId = JSON_VALUE(@json, '$.lpaQuestionnaireId')

        IF JSON_VALUE(@json, '$.submissionDate') IS NOT NULL
          SET @submissionDate = JSON_VALUE(@json, '$.submissionDate')

        IF JSON_VALUE(@json, '$.submissionAccuracy') IS NOT NULL
          SET @submissionAccuracy = JSON_VALUE(@json, '$.submissionAccuracy')

        IF JSON_VALUE(@json, '$.submissionaccuracyDetails') IS NOT NULL
          SET @submissionaccuracyDetails = JSON_VALUE(@json, '$.submissionaccuracyDetails')

        IF JSON_VALUE(@json, '$.extraConditions') IS NOT NULL
          SET @extraConditions = JSON_VALUE(@json, '$.extraConditions')

        IF JSON_VALUE(@json, '$.extraConditionsDetails') IS NOT NULL
          SET @extraConditionsDetails = JSON_VALUE(@json, '$.extraConditionsDetails')

        IF JSON_VALUE(@json, '$.adjacentAppeals') IS NOT NULL
          SET @adjacentAppeals = JSON_VALUE(@json, '$.adjacentAppeals')

        IF JSON_VALUE(@json, '$.adjacentAppealsNumbers') IS NOT NULL
          SET @adjacentAppealsNumbers = JSON_VALUE(@json, '$.adjacentAppealsNumbers')

        IF JSON_VALUE(@json, '$.cannotSeeLand') IS NOT NULL
          SET @cannotSeeLand = JSON_VALUE(@json, '$.cannotSeeLand')

        IF JSON_VALUE(@json, '$.siteAccess') IS NOT NULL
          SET @siteAccess = JSON_VALUE(@json, '$.siteAccess')

        IF JSON_VALUE(@json, '$.siteAccessDetails') IS NOT NULL
          SET @siteAccessDetails = JSON_VALUE(@json, '$.siteAccessDetails')

        IF JSON_VALUE(@json, '$.siteNeighbourAccess') IS NOT NULL
          SET @siteNeighbourAccess = JSON_VALUE(@json, '$.siteNeighbourAccess')

        IF JSON_VALUE(@json, '$.siteNeighbourAccessDetails') IS NOT NULL
          SET @siteNeighbourAccessDetails = JSON_VALUE(@json, '$.siteNeighbourAccessDetails')

        IF JSON_VALUE(@json, '$.healthAndSafetyIssues') IS NOT NULL
          SET @healthAndSafetyIssues = JSON_VALUE(@json, '$.healthAndSafetyIssues')

        IF JSON_VALUE(@json, '$.healthAndSafetyDetails') IS NOT NULL
          SET @healthAndSafetyDetails = JSON_VALUE(@json, '$.healthAndSafetyDetails')

        IF JSON_VALUE(@json, '$.affectListedBuilding') IS NOT NULL
          SET @affectListedBuilding = JSON_VALUE(@json, '$.affectListedBuilding')

        IF JSON_VALUE(@json, '$.affectListedBuildingDetails') IS NOT NULL
          SET @affectListedBuildingDetails = JSON_VALUE(@json, '$.affectListedBuildingDetails')

        IF JSON_VALUE(@json, '$.greenBelt') IS NOT NULL
          SET @greenBelt = JSON_VALUE(@json, '$.greenBelt')

        IF JSON_VALUE(@json, '$.conservationArea') IS NOT NULL
          SET @conservationArea = JSON_VALUE(@json, '$.conservationArea')

        IF JSON_VALUE(@json, '$.originalPlanningApplicationPublicised') IS NOT NULL
          SET @originalPlanningApplicationPublicised = JSON_VALUE(@json, '$.originalPlanningApplicationPublicised')

        IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted') IS NOT NULL
          SET @developmentNeighbourhoodPlanSubmitted = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanSubmitted')

        IF JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges') IS NOT NULL
          SET @developmentNeighbourhoodPlanChanges = JSON_VALUE(@json, '$.developmentNeighbourhoodPlanChanges')

        IF JSON_VALUE(@json, '$.questionnaireStatusId') IS NOT NULL
          SET @questionnaireStatusId = JSON_VALUE(@json, '$.questionnaireStatusId')

        IF JSON_VALUE(@json, '$.eventUserId') IS NOT NULL
          SET @eventUserId = JSON_VALUE(@json, '$.eventUserId')

        IF JSON_VALUE(@json, '$.eventUserName') IS NOT NULL
          SET @eventUserName = JSON_VALUE(@json, '$.eventUserName')

        INSERT INTO HASLPASubmission (
          ID,
          AppealID,
          LPAQuestionnaireID,
          SubmissionDate,
          SubmissionAccuracy,
          SubmissionaccuracyDetails,
          ExtraConditions,
          ExtraConditionsDetails,
          AdjacentAppeals,
          AdjacentAppealsNumbers,
          CannotSeeLand,
          SiteAccess,
          SiteAccessDetails,
          SiteNeighbourAccess,
          SiteNeighbourAccessDetails,
          HealthAndSafetyIssues,
          HealthAndSafetyDetails,
          AffectListedBuilding,
          AffectListedBuildingDetails,
          GreenBelt,
          ConservationArea,
          OriginalPlanningApplicationPublicised,
          DevelopmentNeighbourhoodPlanSubmitted,
          DevelopmentNeighbourhoodPlanChanges,
          QuestionnaireStatusID,
          EventUserID,
          EventUserName
        )
        VALUES (
          newid(),
          @appealId,
          @lpaQuestionnaireId,
          @submissionDate,
          @submissionAccuracy,
          @submissionaccuracyDetails,
          @extraConditions,
          @extraConditionsDetails,
          @adjacentAppeals,
          @adjacentAppealsNumbers,
          @cannotSeeLand,
          @siteAccess,
          @siteAccessDetails,
          @siteNeighbourAccess,
          @siteNeighbourAccessDetails,
          @healthAndSafetyIssues,
          @healthAndSafetyDetails,
          @affectListedBuilding,
          @affectListedBuildingDetails,
          @greenBelt,
          @conservationArea,
          @originalPlanningApplicationPublicised,
          @developmentNeighbourhoodPlanSubmitted,
          @developmentNeighbourhoodPlanChanges,
          @questionnaireStatusId,
          @eventUserId,
          @eventUserName
        );
      END
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP PROCEDURE CreateHASLPASubmission');
  },
};

module.exports = migration;

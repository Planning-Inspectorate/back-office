const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE VIEW QuestionnaireData
      AS
      SELECT
        HASLPASubmission.LPAQuestionnaireID as lpaQuestionnaireId,
        HASLPASubmission.AppealID as appealId,
        HASLPASubmission.SubmissionDate as submissionDate,
        HASLPASubmission.SubmissionAccuracy as submissionAccuracy,
        HASLPASubmission.SubmissionAccuracyDetails as submissionAccuracyDetails,
        HASLPASubmission.ExtraConditions as extraConditions,
        HASLPASubmission.ExtraConditionsDetails as extraConditionsDetails,
        HASLPASubmission.AdjacentAppeals as adjacentAppeals,
        HASLPASubmission.AdjacentAppealsNumbers as adjacentAppealsNumbers,
        HASLPASubmission.CannotSeeLand as cannotSeeLand,
        HASLPASubmission.SiteAccess as siteAccess,
        HASLPASubmission.SiteAccessDetails as siteAccessDetails,
        HASLPASubmission.SiteNeighbourAccess as siteNeighbourAccess,
        HASLPASubmission.SiteNeighbourAccessDetails as siteNeighbourAccessDetails,
        HASLPASubmission.HealthAndSafetyIssues as healthAndSafetyIssues,
        HASLPASubmission.HealthAndSafetyDetails as healthAndSafetyDetails,
        HASLPASubmission.AffectListedBuilding as affectListedBuilding,
        HASLPASubmission.AffectListedBuildingDetails as affectListedBuildingDetails,
        HASLPASubmission.GreenBelt as greenBelt,
        HASLPASubmission.ConservationArea as conservationArea,
        HASLPASubmission.OriginalPlanningApplicationPublicised as originalPlanningApplicationPublicised,
        HASLPASubmission.DevelopmentNeighbourhoodPlanSubmitted as developmentNeighbourhoodPlanSubmitted,
        HASLPASubmission.DevelopmentNeighbourhoodPlanChanges as developmentNeighbourhoodPlanChanges,
        AppealLink.CaseReference as caseReference,
        AppealLink.AppellantName as appellantName,
        AppealLink.SiteAddressLineOne as siteAddressLineOne,
        AppealLink.SiteAddressLineTwo as siteAddressLineTwo,
        AppealLink.SiteAddressTown as siteAddressTown,
        AppealLink.SiteAddressCounty as siteAddressCounty,
        AppealLink.SiteAddressPostCode as siteAddressPostCode,
        AppealLink.LocalPlanningAuthorityID as localPlanningAuthorityId,
        LookUpQuestionnaireStatus.Status as questionnaireStatus,
        LookUpCaseType.TypeName as caseTypeName,
        LookUpCaseStage.StageName as caseStageName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName
      FROM HASLPASubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASLPASubmission.AppealId = AppealLink.AppealID AND AppealLink.LatestEvent = 1
      LEFT JOIN LookUpQuestionnaireStatus (NOLOCK) ON HASLPASubmission.QuestionnaireStatusID = LookUpQuestionnaireStatus.ID
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStage (NOLOCK) ON AppealLink.CaseStageID = LookUpCaseStage.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      WHERE HASLPASubmission.LPAQuestionnaireID = AppealLink.LPAQuestionnaireID
      AND HASLPASubmission.LatestEvent = 1
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP VIEW QuestionnaireData');
  },
};

module.exports = migration;

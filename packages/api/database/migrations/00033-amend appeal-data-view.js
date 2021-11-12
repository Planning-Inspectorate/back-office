const migration = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP VIEW AppealData');

    await queryInterface.sequelize.query(`
CREATE VIEW [dbo].[AppealData]
      AS
      SELECT
        HASAppealSubmission.AppealID as appealId,
        HASAppealSubmission.CreatorEmailAddress as creatorEmailAddress,
        HASAppealSubmission.CreatorName as creatorName,
        HASAppealSubmission.CreatorOriginalApplicant as creatorOriginalApplicant,
        HASAppealSubmission.CreatorOnBehalfOf as creatorOnBehalfOf,
        HASAppealSubmission.OriginalApplicationNumber as originalApplicationNumber,
        HASAppealSubmission.SiteOwnership as siteOwnership,
        HASAppealSubmission.SiteInformOwners as siteInformOwners,
        HASAppealSubmission.SiteRestriction as siteRestriction,
        HASAppealSubmission.SiteRestrictionDetails as siteRestrictionDetails,
        HASAppealSubmission.SafetyConcern as safetyConcern,
        HASAppealSubmission.SafetyConcernDetails as safetyConcernDetails,
        HASAppealSubmission.SensitiveInformation as sensitiveInformation,
        HASAppealSubmission.TermsAgreed as termsAgreed,
        HASAppealSubmission.DecisionDate as decisionDate,
        HASAppealSubmission.SubmissionDate as submissionDate,
        AppealLink.CaseReference as caseReference,
        AppealLink.CaseStatusID as caseStatusId,
        AppealLink.AppellantName as appellantName,
        AppealLink.SiteAddressLineOne as siteAddressLineOne,
        AppealLink.SiteAddressLineTwo as siteAddressLineTwo,
        AppealLink.SiteAddressTown as siteAddressTown,
        AppealLink.SiteAddressCounty as siteAddressCounty,
        AppealLink.SiteAddressPostCode as siteAddressPostCode,
        AppealLink.LocalPlanningAuthorityID as localPlanningAuthorityId,
        LookUpCaseType.TypeName as typeName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName
      FROM HASAppealSubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASAppealSubmission.AppealID = AppealLink.AppealId AND AppealLink.LatestEvent = 1
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      WHERE HASAppealSubmission.LatestEvent = 1
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.query('DROP VIEW AppealData');

    await queryInterface.sequelize.query(`
      CREATE VIEW AppealData
      AS
      SELECT
        HASAppealSubmission.AppealID as appealId,
        HASAppealSubmission.CreatorEmailAddress as creatorEmailAddress,
        HASAppealSubmission.CreatorName as creatorName,
        HASAppealSubmission.CreatorOriginalApplicant as creatorOriginalApplicant,
        HASAppealSubmission.CreatorOnBehalfOf as creatorOnBehalfOf,
        HASAppealSubmission.OriginalApplicationNumber as originalApplicationNumber,
        HASAppealSubmission.SiteOwnership as siteOwnership,
        HASAppealSubmission.SiteInformOwners as siteInformOwners,
        HASAppealSubmission.SiteRestriction as siteRestriction,
        HASAppealSubmission.SiteRestrictionDetails as siteRestrictionDetails,
        HASAppealSubmission.SafetyConcern as safetyConcern,
        HASAppealSubmission.SafetyConcernDetails as safetyConcernDetails,
        HASAppealSubmission.SensitiveInformation as sensitiveInformation,
        HASAppealSubmission.TermsAgreed as termsAgreed,
        HASAppealSubmission.DecisionDate as decisionDate,
        HASAppealSubmission.SubmissionDate as submissionDate,
        AppealLink.CaseReference as caseReference,
        AppealLink.CaseStageID as caseStageId,
        AppealLink.AppellantName as appellantName,
        AppealLink.SiteAddressLineOne as siteAddressLineOne,
        AppealLink.SiteAddressLineTwo as siteAddressLineTwo,
        AppealLink.SiteAddressTown as siteAddressTown,
        AppealLink.SiteAddressCounty as siteAddressCounty,
        AppealLink.SiteAddressPostCode as siteAddressPostCode,
        AppealLink.LocalPlanningAuthorityID as localPlanningAuthorityId,
        LookUpCaseType.TypeName as typeName,
        LookUpCaseStage.StageName as caseStageName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName
      FROM HASAppealSubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASAppealSubmission.AppealID = AppealLink.AppealId AND AppealLink.LatestEvent = 1
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStage (NOLOCK) ON AppealLink.CaseStageID = LookUpCaseStage.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      WHERE HASAppealSubmission.LatestEvent = 1
    `);
  },
};

module.exports = migration;

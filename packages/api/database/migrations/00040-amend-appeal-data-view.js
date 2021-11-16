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
        HASAppealSubmission.DecisionDate as appealDecisionDate,
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
        HASAppeal.CaseOfficerFirstName as caseOfficerFirstName,
        HASAppeal.CaseOfficerSurname as caseOfficerSurname,
        HASAppeal.CaseOfficerEmail as caseOfficerEmail,
        HASAppeal.ValidationOfficerFirstName as validationOfficerFirstName,
        HASAppeal.ValidationOfficerSurname as validationOfficerSurname,
        HASAppeal.ValidationOfficerEmail as validationOfficerEmail,
        HASAppeal.InvalidReasonOtherDetails as invalidReasonOtherDetails,
        HASAppeal.InvalidAppealReasons as invalidAppealReasons,
        HASAppeal.InspectorFirstName as inspectorFirstName,
        HASAppeal.InspectorSurname as inspectorSurname,
        HASAppeal.InspectorEmail as inspectorEmail,
        HASAppeal.ScheduledSiteVisitDate as scheduledSiteVisitDate,
        HASAppealSubmission.DecisionDate as questionnaireDecisionDate,
        HASAppeal.DescriptionDevelopment as descriptionDevelopment,
        HASAppeal.AppealStartDate as appealStartDate,
        HASAppeal.AppealValidationDate as appealValidationDate,
        LookUpCaseType.TypeName as caseTypeName,
        LookUpCaseStage.StageName as caseStageName,
        LookUpCaseStatus.StatusName as caseStatusName,
        LookUpLPA.LPA19Name as localPlanningAuthorityName,
        LookUpRecommendedSiteVisitType.TypeName as recommendedSiteVisitTypeName,
        LookUpSiteVisitType.TypeName as siteVisitTypeName,
        LookUpInspectorSpecialism.Specialism as inspectorSpecialismName,
        LookUpDecisionOutcome.Outcome as decisionOutcomeName
      FROM HASAppealSubmission (NOLOCK)
      LEFT JOIN AppealLink (NOLOCK) ON HASAppealSubmission.AppealID = AppealLink.AppealId AND AppealLink.LatestEvent = 1
      LEFT JOIN HASAppeal (NOLOCK) ON HASAppealSubmission.AppealID = HASAppeal.AppealId AND HASAppeal.LatestEvent = 1
      LEFT JOIN LookUpCaseType (NOLOCK) ON AppealLink.CaseTypeID = LookUpCaseType.ID
      LEFT JOIN LookUpCaseStage (NOLOCK) ON AppealLink.CaseStageID = LookUpCaseStage.ID
      LEFT JOIN LookUpCaseStatus (NOLOCK) ON AppealLink.CaseStatusID = LookUpCaseStatus.ID
      LEFT JOIN LookUpLPA (NOLOCK) ON AppealLink.LocalPlanningAuthorityID = LookUpLPA.LPA19Code
      LEFT JOIN LookUpSiteVisitType AS LookUpRecommendedSiteVisitType (NOLOCK) ON HASAppeal.RecommendedSiteVisitTypeID = LookUpRecommendedSiteVisitType.ID
      LEFT JOIN LookUpSiteVisitType (NOLOCK) ON HASAppeal.SiteVisitTypeID = LookUpSiteVisitType.ID
      LEFT JOIN LookUpInspectorSpecialism (NOLOCK) ON HASAppeal.InspectorSpecialismID = LookUpInspectorSpecialism.ID
      LEFT JOIN LookUpDecisionOutcome (NOLOCK) ON HASAppeal.DecisionOutcomeID = LookUpDecisionOutcome.ID
      WHERE HASAppealSubmission.LatestEvent = 1
    `);
  },
  down: async (queryInterface) => {
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
};

module.exports = migration;

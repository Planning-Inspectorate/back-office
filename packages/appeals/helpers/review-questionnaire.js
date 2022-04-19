/** @typedef {import('../types').DocumentType} DocumentType */
/** @typedef {import('../types').Lpa.Questionnaire} ReviewQuestionnaire */

/**
 * Determine if a review questionnaire has acknowledged is missing a given
 * `documentType` on an appeal.
 *
 * @param {ReviewQuestionnaire} reviewQuestionnaire 
 * @param {DocumentType} documentType
 * @returns {boolean}
 */
export const getReviewQuestionnaireDocumentTypeRequired = (reviewQuestionnaire, documentType) => {
  switch (documentType) {
    case 'appeal notification':
      return reviewQuestionnaire.thirdPartyAppealNotificationMissingOrIncorrect;
    case 'application notification':
      return reviewQuestionnaire.thirdPartyApplicationNotificationMissingOrIncorrect;
    case 'application publicity':
      return reviewQuestionnaire.thirdPartyApplicationPublicityMissingOrIncorrect;
    case 'conservation area guidance':
      return reviewQuestionnaire.siteConservationAreaMapAndGuidanceMissingOrIncorrect;
    case 'listed building description':
      return reviewQuestionnaire.siteListedBuildingDescriptionMissingOrIncorrect;
    case 'other relevant policy':
      return reviewQuestionnaire.policiesOtherRelevantPoliciesMissingOrIncorrect;
    case 'planning officers report':
      return reviewQuestionnaire.applicationPlanningOfficersReportMissingOrIncorrect;
    case 'plans used to reach decision':
      return reviewQuestionnaire.applicationPlansToReachDecisionMissingOrIncorrect;
    case 'representation':
      return reviewQuestionnaire.thirdPartyRepresentationsMissingOrIncorrect;
    case 'statutory development plan policy':
      return reviewQuestionnaire.policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect;
    case 'supplementary planning document':
      return reviewQuestionnaire.policiesSupplementaryPlanningDocumentsMissingOrIncorrect;
    default:
      throw new Error(`Unknown document type '${documentType}'.`)
  }
};

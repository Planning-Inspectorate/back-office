/** @typedef {import('@pins/appeals').DocumentType} AppealDocumentType */
/** @typedef {import('@pins/appeals').Lpa.Questionnaire} LpaQuestionnaire */
/** @typedef {keyof LpaQuestionnaire} QuestionnaireKey */

/** @type {Partial<Record<QuestionnaireKey, AppealDocumentType>>} */
const answerTypeDocumentTypeMap = {
	thirdPartyAppealNotificationMissingOrIncorrect: 'appeal notification',
	thirdPartyApplicationNotificationMissingOrIncorrect: 'application notification',
	thirdPartyApplicationPublicityMissingOrIncorrect: 'application publicity',
	siteConservationAreaMapAndGuidanceMissingOrIncorrect: 'conservation area guidance',
	siteListedBuildingDescriptionMissingOrIncorrect: 'listed building description',
	policiesOtherRelevantPoliciesMissingOrIncorrect: 'other relevant policy',
	applicationPlanningOfficersReportMissingOrIncorrect: 'planning officers report',
	applicationPlansToReachDecisionMissingOrIncorrect: 'plans used to reach decision',
	thirdPartyRepresentationsMissingOrIncorrect: 'representation',
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: 'statutory development plan policy',
	policiesSupplementaryPlanningDocumentsMissingOrIncorrect: 'supplementary planning document'
};

/** @type {Record<string, Array<AppealDocumentType | QuestionnaireKey>>} */
const labelData = {
	'Appeal notification': ['appeal notification', 'thirdPartyAppealNotificationMissingOrIncorrect'],
	'Application notification': [
		'application notification',
		'thirdPartyApplicationNotificationMissingOrIncorrect'
	],
	'Application publicity': [
		'application publicity',
		'thirdPartyApplicationPublicityMissingOrIncorrect'
	],
	'Conservation area map and guidance': [
		'conservation area guidance',
		'siteConservationAreaMapAndGuidanceMissingOrIncorrect'
	],
	'Listed building description': [
		'listed building description',
		'siteListedBuildingDescriptionMissingOrIncorrect'
	],
	'Other relevant policies': [
		'other relevant policy',
		'policiesOtherRelevantPoliciesMissingOrIncorrect'
	],
	"Planning Officer's report": [
		'planning officers report',
		'applicationPlanningOfficersReportMissingOrIncorrect'
	],
	'Plans used to reach decision': [
		'plans used to reach decision',
		'applicationPlansToReachDecisionMissingOrIncorrect'
	],
	Representations: ['representation', 'thirdPartyRepresentationsMissingOrIncorrect'],
	'Statutory development plan policies': [
		'statutory development plan policy',
		'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect'
	],
	'Supplementary planning documents': [
		'supplementary planning document',
		'policiesSupplementaryPlanningDocumentsMissingOrIncorrect'
	],
	'Copy of letter or site notice': [
		'thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice',
		'thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice'
	],
	'List of addresses': [
		'thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses',
		'thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses'
	],
	'Final comments': [
		/** @type {*} – documentType currently not created @ May 2022 */ ('fpa final comment')
	],
	Statements: [/** @type {*} – documentType currently not created @ May 2022 */ ('fpa statement')]
};

/** @type {Partial<Record<AppealDocumentType | QuestionnaireKey, string>>} */
const lpaLabelMap = {};

for (const [key, values] of Object.entries(labelData)) {
	for (const value of values) {
		lpaLabelMap[value] = key;
	}
}

/**
 * Map an answerType to its associated documentType.
 *
 * @param {QuestionnaireKey} key
 * @returns {string}
 */
export function lpaDocumentType(key) {
	return /** @type {string} */ (answerTypeDocumentTypeMap[key]);
}

/**
 * Map a label key to a human readable string.
 *
 * @param {AppealDocumentType | QuestionnaireKey} key
 * @returns {string=}
 */
export function lpaLabel(key) {
	return lpaLabelMap[key];
}

/**
 * Determine if a review questionnaire has acknowledged is missing a given
 * `documentType` on an appeal.
 *
 * @param {LpaQuestionnaire} reviewQuestionnaire
 * @param {AppealDocumentType} documentType
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
			throw new Error(`Unknown document type '${documentType}'.`);
	}
};

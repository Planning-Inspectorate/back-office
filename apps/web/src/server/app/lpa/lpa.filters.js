/** @typedef {import('@pins/appeals').DocumentType} AppealDocumentType */
/** @typedef {keyof import('@pins/appeals').Lpa.Questionnaire} QuestionnaireKey */

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

/** @type {Record<string, Array<AppealDocumentType | QuestionnaireKey>} */
const labelData = {
	'Appeal notification': [
		'appeal notification',
		'thirdPartyAppealNotificationMissingOrIncorrect'
	],
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
		'fpa final comment'
	],
	'Statements' : [
		'fpa statement'
	]
};

const lpaLabelMap = Object.entries(labelData).reduce(
	(labels, [label, keys]) => ({
		...labels,
		// eslint-disable-next-line unicorn/prefer-object-from-entries
		...keys.reduce((labelsForKey, key) => ({ ...labelsForKey, [key]: label }), {})
	}),
	/** @type {Record<AppealDocumentType | QuestionnaireKey, string>} */ ({})
);

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
 * @returns {string}
 */
export function lpaLabel(key) {
	return lpaLabelMap[key];
}

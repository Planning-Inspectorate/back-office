import { faker } from '@faker-js/faker';
import { createUniqueId, randomBoolean } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.ReviewQuestionnaire} ReviewQuestionnaire */

/**
 * @param {Partial<Omit<ReviewQuestionnaire, 'complete'>>} [options={}]
 * @returns {ReviewQuestionnaire}
 */
export function createReviewQuestionnaire({
	id = createUniqueId(),
	appealId = createUniqueId(),
	createdAt = new Date(),
	applicationPlanningOfficersReportMissingOrIncorrect = randomBoolean(),
	applicationPlansToReachDecisionMissingOrIncorrect = randomBoolean(),
	applicationPlansToReachDecisionMissingOrIncorrectDescription = createDescriptionFor(
		applicationPlansToReachDecisionMissingOrIncorrect
	),
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect = randomBoolean(),
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription = createDescriptionFor(
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect
	),
	policiesOtherRelevantPoliciesMissingOrIncorrect = randomBoolean(),
	policiesOtherRelevantPoliciesMissingOrIncorrectDescription = createDescriptionFor(
		policiesOtherRelevantPoliciesMissingOrIncorrect
	),
	policiesSupplementaryPlanningDocumentsMissingOrIncorrect = randomBoolean(),
	policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription = createDescriptionFor(
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect
	),
	siteConservationAreaMapAndGuidanceMissingOrIncorrect = randomBoolean(),
	siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription = createDescriptionFor(
		siteConservationAreaMapAndGuidanceMissingOrIncorrect
	),
	siteListedBuildingDescriptionMissingOrIncorrect = randomBoolean(),
	siteListedBuildingDescriptionMissingOrIncorrectDescription = createDescriptionFor(
		siteListedBuildingDescriptionMissingOrIncorrect
	),
	thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses = randomBoolean(),
	thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice = randomBoolean(),
	thirdPartyApplicationNotificationMissingOrIncorrect = thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses ||
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice,
	thirdPartyApplicationPublicityMissingOrIncorrect = randomBoolean(),
	thirdPartyRepresentationsMissingOrIncorrect = randomBoolean(),
	thirdPartyRepresentationsMissingOrIncorrectDescription = createDescriptionFor(
		thirdPartyRepresentationsMissingOrIncorrect
	),
	thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses = randomBoolean(),
	thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice = randomBoolean(),
	thirdPartyAppealNotificationMissingOrIncorrect = thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses ||
		thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice
} = {}) {
	const reviewQuestionnaire = /** @type {ReviewQuestionnaire} */ ({
		applicationPlanningOfficersReportMissingOrIncorrect,
		applicationPlansToReachDecisionMissingOrIncorrect,
		applicationPlansToReachDecisionMissingOrIncorrectDescription,
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect,
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription,
		policiesOtherRelevantPoliciesMissingOrIncorrect,
		policiesOtherRelevantPoliciesMissingOrIncorrectDescription,
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect,
		policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription,
		siteConservationAreaMapAndGuidanceMissingOrIncorrect,
		siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription,
		siteListedBuildingDescriptionMissingOrIncorrect,
		siteListedBuildingDescriptionMissingOrIncorrectDescription,
		thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses,
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice,
		thirdPartyApplicationNotificationMissingOrIncorrect,
		thirdPartyApplicationPublicityMissingOrIncorrect,
		thirdPartyRepresentationsMissingOrIncorrect,
		thirdPartyRepresentationsMissingOrIncorrectDescription,
		thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses,
		thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice,
		thirdPartyAppealNotificationMissingOrIncorrect
	});
	const complete = Object.values(reviewQuestionnaire).every((value) => !value);

	return { ...reviewQuestionnaire, id, appealId, createdAt, complete };
}

/**
 * @param {boolean} descriptionRequired
 * @returns {string}
 */
function createDescriptionFor(descriptionRequired) {
	return descriptionRequired ? faker.lorem.sentences(2) : '';
}

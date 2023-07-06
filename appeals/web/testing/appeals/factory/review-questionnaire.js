import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';

/** @typedef {import('@pins/appeals.api').Schema.ReviewQuestionnaire} ReviewQuestionnaire */

/**
 * @param {Partial<Omit<ReviewQuestionnaire, 'complete'>>} [options={}]
 * @returns {ReviewQuestionnaire}
 */
export function createReviewQuestionnaire({
	id = fake.createUniqueId(),
	appealId = fake.createUniqueId(),
	createdAt = new Date(),
	applicationPlanningOfficersReportMissingOrIncorrect = fake.randomBoolean(),
	applicationPlansToReachDecisionMissingOrIncorrect = fake.randomBoolean(),
	applicationPlansToReachDecisionMissingOrIncorrectDescription = createDescriptionFor(
		applicationPlansToReachDecisionMissingOrIncorrect
	),
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect = fake.randomBoolean(),
	policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription = createDescriptionFor(
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect
	),
	policiesOtherRelevantPoliciesMissingOrIncorrect = fake.randomBoolean(),
	policiesOtherRelevantPoliciesMissingOrIncorrectDescription = createDescriptionFor(
		policiesOtherRelevantPoliciesMissingOrIncorrect
	),
	policiesSupplementaryPlanningDocumentsMissingOrIncorrect = fake.randomBoolean(),
	policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription = createDescriptionFor(
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect
	),
	siteConservationAreaMapAndGuidanceMissingOrIncorrect = fake.randomBoolean(),
	siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription = createDescriptionFor(
		siteConservationAreaMapAndGuidanceMissingOrIncorrect
	),
	siteListedBuildingDescriptionMissingOrIncorrect = fake.randomBoolean(),
	siteListedBuildingDescriptionMissingOrIncorrectDescription = createDescriptionFor(
		siteListedBuildingDescriptionMissingOrIncorrect
	),
	thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses = fake.randomBoolean(),
	thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice = fake.randomBoolean(),
	thirdPartyApplicationNotificationMissingOrIncorrect = thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses ||
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice,
	thirdPartyApplicationPublicityMissingOrIncorrect = fake.randomBoolean(),
	thirdPartyRepresentationsMissingOrIncorrect = fake.randomBoolean(),
	thirdPartyRepresentationsMissingOrIncorrectDescription = createDescriptionFor(
		thirdPartyRepresentationsMissingOrIncorrect
	),
	thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses = fake.randomBoolean(),
	thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice = fake.randomBoolean(),
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

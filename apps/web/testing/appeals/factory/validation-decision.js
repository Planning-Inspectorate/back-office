import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';

/** @typedef {import('@pins/api').Schema.ValidValidationDecision} ValidValidationDecision */
/** @typedef {import('@pins/api').Schema.InvalidValidationDecision} InvalidValidationDecision */
/** @typedef {import('@pins/api').Schema.IncompleteValidationDecision} IncompleteValidationDecision */

/**
 * @param {Partial<ValidValidationDecision>} [options={}]
 * @returns {ValidValidationDecision}
 */
export function createValidValidationDecision({
	id = fake.createUniqueId(),
	appealId = fake.createUniqueId(),
	createdAt = new Date(),
	decision = 'complete',
	descriptionOfDevelopment = faker.lorem.paragraph()
} = {}) {
	return {
		id,
		appealId,
		createdAt,
		decision,
		descriptionOfDevelopment
	};
}

/**
 * @param {Partial<InvalidValidationDecision>} [options={}]
 * @returns {InvalidValidationDecision}
 */
export function createInvalidValidationDecision({
	id = fake.createUniqueId(),
	appealId = fake.createUniqueId(),
	decision = 'invalid',
	createdAt = new Date(),
	outOfTime = fake.randomBoolean(),
	noRightOfAppeal = fake.randomBoolean(),
	notAppealable = fake.randomBoolean(),
	lPADeemedInvalid = fake.randomBoolean(),
	otherReasons = null
}) {
	const hasInvalidReason = outOfTime || noRightOfAppeal || notAppealable || lPADeemedInvalid;
	const otherReasonsRequired = !hasInvalidReason || fake.randomBoolean();

	return {
		id,
		appealId,
		decision,
		createdAt,
		outOfTime,
		noRightOfAppeal,
		notAppealable,
		lPADeemedInvalid,
		otherReasons: otherReasons || (otherReasonsRequired ? faker.lorem.paragraph() : null)
	};
}

/**
 * @param {Partial<IncompleteValidationDecision>} [options={}]
 * @returns {IncompleteValidationDecision}
 */
export function createIncompleteValidationDecision({
	id = fake.createUniqueId(),
	appealId = fake.createUniqueId(),
	createdAt = new Date(),
	decision = 'incomplete',
	namesDoNotMatch = fake.randomBoolean(),
	sensitiveInfo = fake.randomBoolean(),
	missingApplicationForm = fake.randomBoolean(),
	missingDecisionNotice = fake.randomBoolean(),
	missingGroundsForAppeal = fake.randomBoolean(),
	missingSupportingDocuments = fake.randomBoolean(),
	inflammatoryComments = fake.randomBoolean(),
	openedInError = fake.randomBoolean(),
	wrongAppealTypeUsed = fake.randomBoolean(),
	otherReasons = null
} = {}) {
	const hasInvalidReason =
		namesDoNotMatch ||
		sensitiveInfo ||
		missingApplicationForm ||
		missingDecisionNotice ||
		missingGroundsForAppeal ||
		missingSupportingDocuments ||
		inflammatoryComments ||
		openedInError ||
		wrongAppealTypeUsed;
	const otherReasonsRequired = !hasInvalidReason || fake.randomBoolean();

	return {
		id,
		appealId,
		createdAt,
		decision,
		namesDoNotMatch,
		sensitiveInfo,
		missingApplicationForm,
		missingDecisionNotice,
		missingGroundsForAppeal,
		missingSupportingDocuments,
		inflammatoryComments,
		openedInError,
		wrongAppealTypeUsed,
		otherReasons: otherReasons || (otherReasonsRequired ? faker.lorem.paragraph() : null)
	};
}

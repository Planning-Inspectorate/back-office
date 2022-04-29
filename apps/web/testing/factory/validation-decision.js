import { createUniqueId, randomBoolean } from '@pins/platform/testing';
import { faker } from '@faker-js/faker';

/** @typedef {import('@pins/api').Schema.ValidValidationDecision} ValidValidationDecision */
/** @typedef {import('@pins/api').Schema.InvalidValidationDecision} InvalidValidationDecision */
/** @typedef {import('@pins/api').Schema.IncompleteValidationDecision} IncompleteValidationDecision */

/**
 * @param {Partial<ValidValidationDecision>} [options={}]
 * @returns {ValidValidationDecision}
 */
export function createValidValidationDecision({
	id = createUniqueId(),
	appealId = createUniqueId(),
	createdAt = new Date(),
	decision = 'valid',
	descriptionOfDevelopment = faker.lorem.paragraph()
}) {
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
	id = createUniqueId(),
	appealId = createUniqueId(),
	decision = 'invalid',
	createdAt = new Date(),
	outOfTime = randomBoolean(),
	noRightOfAppeal = randomBoolean(),
	notAppealable = randomBoolean(),
	lPADeemedInvalid = randomBoolean(),
	otherReasons = null
}) {
	const hasInvalidReason = outOfTime || noRightOfAppeal || notAppealable || lPADeemedInvalid;
	const otherReasonsRequired = !hasInvalidReason || randomBoolean();

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
	id = createUniqueId(),
	appealId = createUniqueId(),
	createdAt = new Date(),
	decision = 'incomplete',
	namesDoNotMatch = randomBoolean(),
	sensitiveInfo = randomBoolean(),
	missingApplicationForm = randomBoolean(),
	missingDecisionNotice = randomBoolean(),
	missingGroundsForAppeal = randomBoolean(),
	missingSupportingDocuments = randomBoolean(),
	inflammatoryComments = randomBoolean(),
	openedInError = randomBoolean(),
	wrongAppealTypeUsed = randomBoolean(),
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
	const otherReasonsRequired = !hasInvalidReason || randomBoolean();

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

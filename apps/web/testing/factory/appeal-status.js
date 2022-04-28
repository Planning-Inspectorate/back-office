import { createUniqueId } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.AppealStatus} AppealStatus */

/**
 * @param {Partial<AppealStatus>} [options={}]
 * @returns {AppealStatus}
 */
export function createAppealStatus({
	appealId = createUniqueId(),
	id = createUniqueId(),
	status = 'received_appeal',
	createdAt = new Date(),
	subStateMachineName = 'lpaQuestionnaireAndInspectorPickup',
	compoundStateName = null,
	valid = true
} = {}) {
	return {
		id,
		appealId,
		status,
		createdAt,
		compoundStateName,
		subStateMachineName,
		valid
	};
}

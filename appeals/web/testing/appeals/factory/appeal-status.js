import { fake } from '@pins/platform';

/** @typedef {import('@pins/api').Schema.AppealStatus} AppealStatus */

/**
 * @param {Partial<AppealStatus>} options
 * @returns {AppealStatus}
 */
export function createAppealStatus({
	appealId = fake.createUniqueId(),
	id = fake.createUniqueId(),
	status = 'received_appeal',
	createdAt = new Date(),
	subStateMachineName = null,
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

import { createUniqueId } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.AppealType} AppealType */

/**
 * @param {Partial<AppealType>} [options={}]
 * @returns {AppealType}
 */
export function createAppealType({ id = createUniqueId(), shorthand = 'HAS', type = '' }) {
	return {
		id,
		shorthand,
		type
	};
}

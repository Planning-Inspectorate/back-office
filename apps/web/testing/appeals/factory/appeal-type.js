import { fake } from '@pins/platform';

/** @typedef {import('@pins/api').Schema.AppealType} AppealType */

/**
 * @param {Partial<AppealType>} [options={}]
 * @returns {AppealType}
 */
export function createAppealType({
	id = fake.createUniqueId(),
	shorthand = 'HAS',
	type = ''
} = {}) {
	return {
		id,
		shorthand,
		type
	};
}

import { join, map, pick } from 'lodash-es';

/** @typedef {import('../applications/applications.types').Applicant} Applicant */

/**
 * converts a multi part person name to a single string
 *
 * @param {Applicant} applicant
 * @returns {string}
 */
export const nameToString = (applicant) => {
	return join(
		map(pick(applicant, ['firstName', 'lastName']), (value) => {
			return value?.trim();
		}),
		' '
	);
};

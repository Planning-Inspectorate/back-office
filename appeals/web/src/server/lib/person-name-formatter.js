import { join, map, pick } from 'lodash-es';

/**
 * converts a multi part person name to a single string
 *
 * @param {{firstName:string, lastName:string}} applicant
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

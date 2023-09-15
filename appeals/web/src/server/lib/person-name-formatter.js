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

/**
 * converts a string comprising a name in the surname first format (i.e. "Surname, Firstname") to full name format (i.e. "Firstname Surname")
 * in the event the name parameter doesn't match the expected format, the unmodified name is returned
 *
 * @param {string} name - name in the format "Surname, Firstname"
 * @returns {string} - name in the format "Firstname Surname"
 */
export const surnameFirstToFullName = (name) => {
	const nameFragments = name.split(',');

	if (nameFragments.length !== 2) {
		return name;
	}

	return `${nameFragments[1]} ${nameFragments[0]}`;
};

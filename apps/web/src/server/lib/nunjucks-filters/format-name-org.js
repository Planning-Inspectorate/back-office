/**
 * Accepts a first name, last name and organisation (all optional)
 * and formats them nicely into a single string.
 *
 * @param {{ firstName?: string, lastName?: string, organisation?: string }} _
 * @returns {string}
 * */
export function formatNameOrg({ firstName, lastName, organisation }) {
	if (firstName && lastName && organisation) {
		return `${firstName} ${lastName}, ${organisation}`;
	}

	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}

	if (organisation) {
		return organisation;
	}

	return '';
}

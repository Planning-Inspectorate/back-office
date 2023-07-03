/**
 * @typedef {import('./application-representation-details.view-model.js').Representation} Representation
 */

/**
 *
 * @param {*} errors
 * @returns {object}
 */
export const getFormattedErrorSummary = (errors) =>
	Object.keys(errors).map((error) => ({
		text: errors[error].msg,
		href: `#${error}`
	}));

/**
 * @param {Representation} representation
 * @returns organisation name or firstname + lastname
 */
export const getOrgOrNameForRepresentation = ({ contacts }) => {
	/**
	 * @type {string|null}
	 */
	let nameOrOrg = '';

	for (let index = 0; index < contacts.length; index++) {
		const contact = contacts[index];

		switch (contact.type.toLowerCase()) {
			case 'organisation':
				nameOrOrg = contact.organisationName || '';
				break;

			case 'person':
				nameOrOrg = `${contact.firstName} ${contact.lastName}`;
				break;

			case 'agent':
				nameOrOrg = `${contact.firstName} ${contact.lastName}`;
				break;
		}

		if (nameOrOrg.length) break;
	}

	return nameOrOrg;
};

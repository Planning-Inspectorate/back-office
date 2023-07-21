import formatAddress from './format-address.js';

/** @typedef {import('@pins/appeals.api').Schema.NeighbouringSiteContact} NeighbouringSiteContact */
/** @typedef {import('@pins/appeals.api').Appeals.NeighbouringSiteContactsResponse} NeighbouringSiteContactsResponse */

/**
 * @param {NeighbouringSiteContact[] | null} [contacts]
 * @returns {NeighbouringSiteContactsResponse[] | null}
 */
const formatNeighbouringSiteContacts = (contacts) =>
	(contacts &&
		contacts.map((contact) => ({
			address: formatAddress(contact.address),
			contactId: contact.id,
			email: contact.email,
			firstName: contact.firstName,
			lastName: contact.lastName,
			telephone: contact.telephone
		}))) ||
	null;

export default formatNeighbouringSiteContacts;

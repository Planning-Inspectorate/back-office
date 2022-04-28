import { faker } from '@faker-js/faker';
import { createPostcode, createUniqueId } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.Address} AddressData */

/**
 * @param {Partial<AddressData>} options
 * @returns {AddressData}
 */
export function createAddress({
	id = createUniqueId(),
	addressLine1 = faker.address.streetAddress(),
	addressLine2 = '',
	town = faker.address.city(),
	county = '',
	postcode = createPostcode()
} = {}) {
	return {
		id,
		addressLine1,
		addressLine2,
		town,
		county,
		postcode
	};
}

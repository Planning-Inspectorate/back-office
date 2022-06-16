import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';

/** @typedef {import('@pins/api').Schema.Address} AddressData */

/**
 * @param {Partial<AddressData>} options
 * @returns {AddressData}
 */
export function createAddress({
	id = fake.createUniqueId(),
	addressLine1 = faker.address.streetAddress(),
	addressLine2 = '',
	town = faker.address.city(),
	county = '',
	postcode = fake.createPostcode()
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

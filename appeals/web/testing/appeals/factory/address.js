import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';

<<<<<<< HEAD
/** @typedef {import('@pins/appeals.api').Schema.Address} AddressData */
=======
/** @typedef {import('@pins/applications.api').Schema.Address} AddressData */
>>>>>>> 8eb59656 (chore(web/applications): .updated lock-file and refs (boas-971))

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
	postcode = fake.createPostcode(),
	country = ''
} = {}) {
	return {
		id,
		addressLine1,
		addressLine2,
		town,
		county,
		postcode,
		country
	};
}

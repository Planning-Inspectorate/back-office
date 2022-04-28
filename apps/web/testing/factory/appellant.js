import { faker } from '@faker-js/faker';
import { createUniqueId } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.Appellant} AppellantData */

/**
 * @param {Partial<AppellantData>} [options={}]
 * @returns {AppellantData}
 */
export function createAppellant({
	id = createUniqueId(),
	name = `${faker.name.firstName()} ${faker.name.lastName()}`,
	email = faker.internet.exampleEmail(),
	agentName = `${faker.name.firstName()} ${faker.name.lastName()}`
} = {}) {
	return { id, name, email, agentName };
}

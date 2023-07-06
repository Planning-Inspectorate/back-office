import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';
import { snakeCase } from 'lodash-es';

/** @typedef {import('@pins/appeals.api').Schema.Appellant} AppellantData */

/**
 * @param {Partial<AppellantData>} [options={}]
 * @returns {AppellantData}
 */
export function createAppellant({
	id = fake.createUniqueId(),
	name = `${faker.name.firstName()} ${faker.name.lastName()}`,
	email = `${snakeCase(name)}@example.com`,
	agentName = 'Agent Alma Adamson'
} = {}) {
	return { id, name, email, agentName, company: `${name} Ltd` };
}

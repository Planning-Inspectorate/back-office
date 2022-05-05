import { faker } from '@faker-js/faker';
import { createUniqueId } from '@pins/platform/testing';
import { snakeCase } from 'lodash-es';

/** @typedef {import('@pins/api').Schema.Appellant} AppellantData */

/**
 * @param {Partial<AppellantData>} [options={}]
 * @returns {AppellantData}
 */
export function createAppellant({
	id = createUniqueId(),
	name = `${faker.name.firstName()} ${faker.name.lastName()}`,
	email = `${snakeCase(name)}@example.com`,
	agentName = 'Agent Alma Adamson'
} = {}) {
	return { id, name, email, agentName };
}

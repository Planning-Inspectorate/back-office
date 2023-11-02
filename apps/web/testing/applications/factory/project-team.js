/** @typedef {import("apps/web/src/server/applications/applications.types.js").ProjectTeamMember} ProjectTeamMember */

import { faker } from '@faker-js/faker';
import { fake } from '@pins/platform';

/**
 * @param {Partial<ProjectTeamMember>} [options={}]
 * @returns {ProjectTeamMember}
 */
export function createProjectTeamMember({ id = fake.createUniqueId() } = {}) {
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();

	const name = `${firstName} ${lastName}`;

	const email = `${firstName}.${lastName}@planninginspectorate.gov.uk`;

	return {
		name,
		email,
		id
	};
}

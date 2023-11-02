/** @typedef {import("apps/web/src/server/applications/applications.types.js").ProjectTeamMember} ProjectTeamMember */

import { fake } from '@pins/platform';
import { createRandomDescription, createUniqueRandomNumberFromSeed } from './util.js';

/**
 * @param {Partial<ProjectTeamMember>} [options={}]
 * @returns {ProjectTeamMember}
 */
export function createProjectTeamMember({ id = fake.createUniqueId() } = {}) {
	const firstName = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, id)
	})}`;

	const lastName = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(4, 12, id)
	})}`;

	const name = `${firstName} ${lastName}`;

	const email = `${firstName}.${lastName}@planninginspectorate.gov.uk`;

	return {
		name,
		email,
		id
	};
}

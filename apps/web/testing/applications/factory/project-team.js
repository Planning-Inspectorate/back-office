/** @typedef {import("apps/web/src/server/applications/applications.types.js").ProjectTeamMember} ProjectTeamMember */

import { fake } from '@pins/platform';
import { createRandomDescription, createUniqueRandomNumberFromSeed } from './util.js';

/**
 * @param {Partial<ProjectTeamMember>} [options={}]
 * @returns {ProjectTeamMember}
 */
export function createProjectTeamMember({ id = `${fake.createUniqueId()}` } = {}) {
	const givenName = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(3, 12, Number(id))
	})}`;

	const surname = `${createRandomDescription({
		wordsNumber: 1,
		startOffset: createUniqueRandomNumberFromSeed(4, 12, Number(id))
	})}`;

	const userPrincipalName = `${givenName}.${surname}@planninginspectorate.gov.uk`;

	const role = 'inspector';

	return {
		givenName,
		surname,
		userPrincipalName,
		id,
		role
	};
}

import { fake } from '@pins/platform';

/** @typedef {import('../../../src/server/applications/applications.types').Region} Region */

/**
 * @param {Partial<Region>} [options={}]
 * @returns {Region}
 */
export function createRegion({
	id = fake.createUniqueId(),
	name = `region_${id}`,
	displayNameEn = `Region EN ${id}`,
	displayNameCy = `Region CY ${id}`
} = {}) {
	return {
		id,
		name,
		displayNameEn,
		displayNameCy
	};
}

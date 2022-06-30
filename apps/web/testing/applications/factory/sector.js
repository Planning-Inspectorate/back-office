import { fake } from '@pins/platform';

// While the interface of an `Application` is not fully determined, just use
// enough properties to form the application summary

/** @typedef {import('../../../src/server/applications/applications.types').Sector} Sector */

/**
 * @param {Partial<Sector>} [options={}]
 * @returns {Sector}
 */
export function createSector({
	id = fake.createUniqueId(),
	abbreviation = `${id}`,
	displayNameEn = `Sector ${id}`,
	name = `sector_${id}`
} = {}) {
	return {
		id,
		abbreviation,
		displayNameEn,
		name
	};
}

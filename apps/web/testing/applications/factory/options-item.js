import { fake } from '@pins/platform';

/** @typedef {import('../../../src/server/applications/applications.types').OptionsItem} OptionsItem */

/**
 * @param {Partial<OptionsItem>} [options={}]
 * @returns {OptionsItem}
 */
export function createOptionsItem({
	id = fake.createUniqueId(),
	abbreviation = `ITEM${id}`,
	displayNameEn = `Item EN ${id}`,
	displayNameCy = `Item CY ${id}`,
	displayOrder = 100,
	name
} = {}) {
	return {
		id,
		abbreviation: name ? name.slice(0, 3).toUpperCase() : abbreviation,
		displayNameEn: name ? `${name.charAt(0).toUpperCase()}${name.slice(1)} EN` : displayNameEn,
		displayNameCy: name ? `${name.charAt(0).toUpperCase()}${name.slice(1)} CY` : displayNameCy,
		name: name ?? `item_${id}`,
		displayOrder
	};
}

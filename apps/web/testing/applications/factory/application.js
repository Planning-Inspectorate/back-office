import { fake } from '@pins/platform';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';
import { createSector } from './sector.js';
import { createApplicationReference } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').Application} Application */

/**
 * @param {Partial<Application>} [options={}]
 * @returns {Application}
 */
export function createApplication({
	id = fake.createUniqueId(),
	modifiedDate = sub(new Date(), { weeks: random(1, 6) }).toISOString(),
	reference = createApplicationReference(),
	sector = createSector(),
	subSector = createSector()
} = {}) {
	return {
		id,
		reference,
		title: `Title ${reference}`,
		description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
		status: `Status ${id}000`,
		modifiedDate,
		sector,
		subSector
	};
}

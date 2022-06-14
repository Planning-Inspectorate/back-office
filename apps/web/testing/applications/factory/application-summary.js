import { fake } from '@pins/platform';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';
import { createSector } from './sector.js';
import { createApplicationReference } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').ApplicationSummary} ApplicationSummary */

/**
 * @param {Partial<ApplicationSummary>} [options={}]
 * @returns {ApplicationSummary}
 */
export function createApplicationSummary({
	id = fake.createUniqueId(),
	modifiedDate = sub(new Date(), { weeks: random(1, 6) }).toISOString(),
	reference = createApplicationReference(),
	sector = createSector(),
	subSector = createSector()
} = {}) {
	return {
		id,
		modifiedDate,
		reference,
		sector,
		subSector
	};
}

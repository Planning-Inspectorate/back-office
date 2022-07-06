import { fake } from '@pins/platform';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';
import { createOptionsItem } from './options-item.js';
import { createApplicationReference, createRandomDescription } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').Application} Application */

/**
 * @param {Partial<Application>} [options={}]
 * @returns {Application}
 */
export function createApplication({
	id = fake.createUniqueId(),
	modifiedDate = sub(new Date(), { weeks: random(1, 6) }).toISOString(),
	reference = createApplicationReference(),
	sector = createOptionsItem(),
	subSector = createOptionsItem()
} = {}) {
	return {
		id,
		reference,
		title: `Title ${reference}`,
		description: createRandomDescription({ wordsNumber: 40, startOffset: id }),
		status: `Status ${id}000`,
		modifiedDate,
		sector,
		subSector
	};
}

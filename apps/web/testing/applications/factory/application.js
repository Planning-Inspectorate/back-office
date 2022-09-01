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
	modifiedDate = `${sub(new Date(), { weeks: random(1, 6) }).getTime() / 1000}`,
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
		subSector,
		applicants: [
			{
				id: 2,
				organisationName: 'Org name',
				firstName: 'John',
				lastName: 'Smith',
				website: 'website.web',
				email: 'email@email.co',
				phoneNumber: '001'
			}
		]
	};
}

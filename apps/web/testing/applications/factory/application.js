import { fake } from '@pins/platform';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';
import { createOptionsItem } from './options-item.js';
import { createCaseReference, createRandomDescription } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').Case} Case */

/**
 * @param {Partial<Case>} [options={}]
 * @returns {Case}
 */
export function createCase({
	id = fake.createUniqueId(),
	modifiedDate = `${sub(new Date(), { weeks: random(1, 6) }).getTime() / 1000}`,
	reference = createCaseReference(),
	sector = createOptionsItem(),
	subSector = createOptionsItem(),
	status = `Status ${id}000`
} = {}) {
	return {
		id,
		reference,
		title: `Title ${reference}`,
		description: createRandomDescription({ wordsNumber: 40, startOffset: id }),
		status,
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

import { fake } from '@pins/platform';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';
import { fixtureRegions, fixtureZoomLevels } from '../fixtures/options-item.js';
import { createOptionsItem } from './options-item.js';
import { createCaseReference, createRandomDescription } from './util.js';

/** @typedef {import('../../../src/server/applications/applications.types').Case} Case */
/** @typedef {import('../../../src/server/applications/applications.types').Applicant} Applicant */

/**
 * @param {boolean} showAddress
 * @returns {Applicant}
 */
export const createApplicant = (showAddress = false) => {
	return {
		id: 2,
		organisationName: 'Org name',
		firstName: 'John',
		lastName: 'Smith',
		website: 'website.web',
		email: 'email@email.co',
		phoneNumber: '001',
		...(showAddress
			? { address: { addressLine1: 'Applicant address', postCode: 'ABC123', town: 'London' } }
			: {})
	};
};

/**
 * @param {Partial<Case>} [options={}]
 * @returns {Case}
 */
export const createCase = ({
	id = fake.createUniqueId(),
	modifiedDate = `${sub(new Date(), { weeks: random(1, 6) }).getTime() / 1000}`,
	publishedDate,
	reference = createCaseReference(),
	sector = createOptionsItem(),
	subSector = createOptionsItem(),
	status = `Status ${id}000`,
	applicant = createApplicant(true),
	caseEmail
} = {}) => {
	return {
		id,
		reference,
		title: `Title ${reference}`,
		description: createRandomDescription({ wordsNumber: 40, startOffset: id }),
		status,
		modifiedDate,
		publishedDate,
		sector,
		subSector,
		applicant,
		geographicalInformation: {
			locationDescription: 'London',
			gridReference: {
				easting: '123456',
				northing: '987654'
			},
			regions: [fixtureRegions[0], fixtureRegions[1]],
			mapZoomLevel: fixtureZoomLevels[0]
		},
		caseEmail
	};
};

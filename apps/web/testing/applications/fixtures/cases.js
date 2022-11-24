import { createCase } from '../factory/application.js';
import {
	fixtureRegions,
	fixtureSectors,
	fixtureSubSectors,
	fixtureZoomLevels
} from './options-item.js';

/** @typedef {import('../../../src/server/applications/applications.types').Case} Case */

/** @type {Case[]} */
export const fixtureCases = [
	{
		...createCase({
			id: 1,
			modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
			reference: 'CASE/01',
			sector: fixtureSectors[0],
			subSector: fixtureSubSectors[0],
			status: 'Draft'
		}),
		geographicalInformation: {
			locationDescription: 'London',
			gridReference: {
				easting: '123456',
				northing: '987654'
			},
			regions: [fixtureRegions[0], fixtureRegions[1]],
			mapZoomLevel: fixtureZoomLevels[0]
		},
		caseEmail: 'some@ema.il'
	},
	createCase({
		id: 2,
		modifiedDate: `${new Date(2022, 0, 31).getTime() / 1000}`,
		reference: 'CASE/02',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1],
		status: 'Draft'
	}),
	createCase({
		id: 3,
		modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
		reference: 'CASE/03',
		sector: fixtureSectors[2],
		subSector: fixtureSectors[3],
		status: 'Draft'
	}),
	{
		id: 4,
		reference: 'CASE/04',
		title: `Case with no sector`,
		description: 'Case with no sector description',
		status: 'Draft',
		applicants: [
			{
				id: 2,
				organisationName: 'Org name',
				firstName: 'Lorem',
				lastName: 'Ipsum',
				website: 'website.web',
				email: 'email@email.co',
				phoneNumber: '001',
				address: { addressLine1: 'Applicant address', postCode: 'ABC123', town: 'London' }
			}
		]
	},
	{
		id: 5,
		reference: 'CASE/05',
		title: `Case with no subsector`,
		description: 'Case with no subsector description',
		sector: fixtureSectors[0],
		status: 'Draft'
	},
	createCase({
		id: 6,
		modifiedDate: `${new Date(2022, 0, 31).getTime() / 1000}`,
		reference: 'CASE/06',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1],
		status: 'Pre-Application'
	})
];

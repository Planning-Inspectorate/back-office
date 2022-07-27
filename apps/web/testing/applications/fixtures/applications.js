import {createApplication} from '../factory/application.js';
import {fixtureRegions, fixtureSectors, fixtureSubSectors, fixtureZoomLevels} from './options-item.js';

/** @typedef {import('../../../src/server/applications/applications.types').Application} Application */


/** @type {Application[]} */
export const fixtureApplications = [
	{
		...createApplication({
			id: 1,
			modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
			reference: 'APPLICATION/01',
			sector: fixtureSectors[0],
			subSector: fixtureSubSectors[0]
		}),
		applicants: [{ id: 2 }],
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
	createApplication({
		id: 2,
		modifiedDate: `${new Date(2022, 0, 31).getTime() / 1000}`,
		reference: 'APPLICATION/02',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1]
	}),
	createApplication({
		id: 3,
		modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
		reference: 'APPLICATION/03',
		sector: fixtureSectors[2],
		subSector: fixtureSectors[3]
	}),
	{
		id: 4,
		reference: 'APPLICATION/04',
		title: `Application with no sector`,
		description: 'Application with no sector description',
		status: 'draft'
	},
	{
		id: 5,
		reference: 'APPLICATION/05',
		title: `Application with no subsector`,
		description: 'Application with no subsector description',
		sector: fixtureSectors[0],
		status: 'draft'
	},
];

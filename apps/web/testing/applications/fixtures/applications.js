import {createApplication} from '../factory/application.js';
import {fixtureSectors} from './options-item.js';

export const fixtureApplications = [
	{
		...createApplication({
			id: 1,
			modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
			reference: 'APPLICATION/01',
			sector: fixtureSectors[0],
			subSector: fixtureSectors[1]
		}),
		geographicalInformation: {
			locationDescription: 'London',
			gridReference: {
				easting: '123456',
				northing: '987654'
			}
		}
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
		status: 'draft'
	},
	{
		id: 5,
		reference: 'APPLICATION/05',
		title: `Application with no subsector`,
		sector: fixtureSectors[0],
		status: 'draft'
	},
];

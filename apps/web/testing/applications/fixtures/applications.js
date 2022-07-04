import { createApplication } from '../factory/application.js';
import { fixtureSectors } from './sectors.js';

export const fixtureApplications = [
	createApplication({
		id: 1,
		modifiedDate: new Date(2022, 0, 1).toISOString(),
		reference: 'APPLICATION/01',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1]
	}),
	createApplication({
		id: 2,
		modifiedDate: new Date(2022, 0, 31).toISOString(),
		reference: 'APPLICATION/02',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1]
	}),
	createApplication({
		id: 3,
		modifiedDate: new Date(2022, 0, 1).toISOString(),
		reference: 'APPLICATION/03',
		sector: fixtureSectors[2],
		subSector: fixtureSectors[3]
	})
];

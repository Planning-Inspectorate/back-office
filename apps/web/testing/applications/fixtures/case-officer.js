import { createApplicationSummary } from '../factory/application-summary.js';
import { createSector } from '../factory/sector.js';

const sectors = [
	createSector({ id: 1 }),
	createSector({ id: 2 }),
	createSector({ id: 3 }),
	createSector({ id: 4 }),
	createSector({ id: 5 })
];

export const mockedApplication = {
	...createApplicationSummary({
		id: 1,
		modifiedDate: new Date(2022, 0, 1).toISOString(),
		reference: 'APPLICATION/01',
		sector: sectors[0],
		subSector: sectors[1]
	}),
	name: 'Bridge',
	description: 'Description of the bridge application'
};

export const applicationSummaries = [
	createApplicationSummary({
		id: 1,
		modifiedDate: new Date(2022, 0, 1).toISOString(),
		reference: 'APPLICATION/01',
		sector: sectors[0],
		subSector: sectors[1]
	}),
	createApplicationSummary({
		id: 2,
		modifiedDate: new Date(2022, 0, 31).toISOString(),
		reference: 'APPLICATION/02',
		sector: sectors[0],
		subSector: sectors[1]
	}),
	createApplicationSummary({
		id: 3,
		modifiedDate: new Date(2022, 0, 1).toISOString(),
		reference: 'APPLICATION/03',
		sector: sectors[2],
		subSector: sectors[3]
	})
];

export const applicationsSectors = [...Array.from({ length: 10 }).keys()].map((k) =>
	createSector({ id: k })
);

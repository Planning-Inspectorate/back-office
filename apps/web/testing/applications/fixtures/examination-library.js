import { createCase } from '../factory/application.js';
import { fixtureSectors, fixtureSubSectors } from './options-item.js';

const baseCase = createCase({
	id: 123,
	modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
	title: 'Test case for examination library',
	reference: 'CASE/123',
	sector: fixtureSectors[0],
	subSector: fixtureSubSectors[0],
	status: 'Examination',
	caseEmail: 'some@ema.il'
});

export const fixtureExaminationLibraryIndex = {
	caseData: baseCase
};

export const fixtureDynamicSections = [
	{
		slug: 'change-requests',
		items: [
			{
				title: 'Change request 1',
				href: 'change-request-1'
			},
			{
				title: 'Change request 2',
				href: 'change-request-2'
			}
		]
	},
	{
		slug: 'events-and-hearings',
		items: [
			{
				title: 'Events and hearings 1',
				href: 'events-and-hearings-1'
			},
			{
				title: 'Events and hearings 2',
				href: 'events-and-hearings-2'
			}
		]
	},
	{
		slug: 'procedural-deadlines',
		items: [
			{
				title: 'Procedural deadlines 1',
				href: 'procedural-deadlines-1'
			},
			{
				title: 'Procedural deadlines 2',
				href: 'procedural-deadlines-2'
			}
		]
	},
	{
		slug: 'deadlines',
		items: [
			{
				title: 'Deadlines 1',
				href: 'deadlines-1'
			},
			{
				title: 'Deadlines 2',
				href: 'deadlines-2'
			}
		]
	}
];

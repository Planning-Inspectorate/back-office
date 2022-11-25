import { createApplicant, createCase } from '../factory/application.js';
import { fixtureSectors, fixtureSubSectors } from './options-item.js';

/** @typedef {import('../../../src/server/applications/applications.types').Case} Case */

/** @type {Case[]} */
export const fixtureCases = [
	createCase({
		id: 1,
		modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
		reference: 'CASE/01',
		sector: fixtureSectors[0],
		subSector: fixtureSubSectors[0],
		status: 'Draft'
	}),
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
		status: 'Draft'
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
		modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
		reference: 'CASE/06',
		sector: fixtureSectors[0],
		subSector: fixtureSubSectors[0],
		status: 'Pre-Application'
	}),
	createCase({
		id: 7,
		modifiedDate: `${new Date(2022, 0, 31).getTime() / 1000}`,
		reference: 'CASE/07',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1],
		status: 'Pre-application',
		applicants: [createApplicant(false)]
	})
];

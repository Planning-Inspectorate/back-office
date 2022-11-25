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
		status: 'Draft',
		caseEmail: 'some@ema.il'
	}),
	{
		id: 2,
		reference: 'CASE/02',
		title: `Case with no subsector`,
		description: 'Case with no subsector description',
		sector: fixtureSectors[0],
		status: 'Draft'
	},
	{
		id: 3,
		reference: 'CASE/03',
		title: `Case with no sector`,
		description: 'Case with no sector description',
		status: 'Draft'
	},
	createCase({
		id: 4,
		modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
		reference: 'CASE/04',
		sector: fixtureSectors[0],
		subSector: fixtureSubSectors[0],
		status: 'Pre-Application',
		caseEmail: 'some@ema.il'
	}),
	createCase({
		id: 5,
		modifiedDate: `${new Date(2022, 0, 31).getTime() / 1000}`,
		reference: 'CASE/05',
		sector: fixtureSectors[0],
		subSector: fixtureSectors[1],
		status: 'Pre-application',
		applicants: [createApplicant(false)]
	})
];

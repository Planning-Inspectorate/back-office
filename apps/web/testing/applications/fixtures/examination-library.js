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

import { createCase } from '../factory/application.js';
import { fixtureSectors, fixtureSubSectors } from './options-item.js';

const baseCase = createCase({
	id: 4,
	modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
	title: 'Unpublished case with no applicant and case email',
	reference: 'CASE/04',
	sector: fixtureSectors[0],
	subSector: fixtureSubSectors[0],
	status: 'Pre-Application',
	caseEmail: 'some@ema.il'
});

const fixtureFeesForecastingCase = {
	...baseCase,
	additionalDetails: {
		newMaturity: 'C',
		numberBand2Inspectors: 2,
		numberBand3Inspectors: 1,
		additionalComments: 'Some comments'
	},
	keyDates: {
		preApplication: {
			memLastUpdated: 1710000000
		}
	}
};

export default fixtureFeesForecastingCase;

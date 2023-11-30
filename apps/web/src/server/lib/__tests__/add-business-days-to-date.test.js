import dateUtils from '../add-business-days-to-date.js';

import nock from 'nock';

const nocks = () => {
	nock('https://www.gov.uk/bank-holidays.json')
		.get('')
		.reply(200, {
			'england-and-wales': {
				events: [{ date: '2023-11-22' }, { date: '2023-11-23' }, { date: '2023-11-24' }]
			}
		});
};

describe('apps/web/src/server/lib/add-business-days-to-date', () => {
	describe('#addBusinessDaysToDate', () => {
		describe('When adding business days to a date', () => {
			describe('and there is an error', () => {
				const dateFrom = new Date('2023-11-01');
				const businessDaysToAdd = 10;
				const region = 'england-and-wales';

				beforeEach(() => {
					nock('https://www.gov.uk/bank-holidays.json')
						.get('')
						.replyWithError('something went wrong');
				});
				it('should throw an error', async () => {
					await expect(
						dateUtils.addBusinessDaysToDate(dateFrom, businessDaysToAdd, region)
					).rejects.toThrow('Unable to retrieve bank holidays');
				});
			});

			describe('and there are no bank holidays between date from and and date to', () => {
				const dateFrom = new Date('2023-11-01');
				const businessDaysToAdd = 10;
				const region = 'england-and-wales';

				let dateWithBusinessDaysAdded = new Date();

				beforeEach(async () => {
					nocks();

					dateWithBusinessDaysAdded = await dateUtils.addBusinessDaysToDate(
						dateFrom,
						businessDaysToAdd,
						region
					);
				});
				it('should return the date with the the number of business days added', () => {
					expect(dateWithBusinessDaysAdded).toEqual(new Date('2023-11-15'));
				});
			});

			describe('and there are bank holidays between date from and and date to', () => {
				const dateFrom = new Date('2023-11-20');
				const businessDaysToAdd = 2;
				const region = 'england-and-wales';

				let dateWithBusinessDaysAdded = new Date();

				beforeEach(async () => {
					nocks();

					dateWithBusinessDaysAdded = await dateUtils.addBusinessDaysToDate(
						dateFrom,
						businessDaysToAdd,
						region
					);
				});
				it('should return the date with the the number of business days and bank holidays added', () => {
					expect(dateWithBusinessDaysAdded).toEqual(new Date('2023-11-27'));
				});
			});
		});
	});
});

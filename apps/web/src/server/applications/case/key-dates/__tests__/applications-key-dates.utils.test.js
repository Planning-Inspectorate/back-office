//@ts-nocheck
import { jest } from '@jest/globals';

describe('apps/web/src/server/applications/case/key-dates/applications-key-dates.utils.js', () => {
	describe('#isRelevantRepresentationsReOpened', () => {
		const dateYesterdayTimeStamp = 1704067200; // '2024-01-01'
		const dateToday = '2024-01-02';
		const dateTodayTimeStamp = 1704153600;
		const dateTomorrowTimeStamp = 1704240000; // '2024-01-03'

		beforeEach(() => {
			jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(new Date(dateToday));
		});

		describe(`When the 're-open closes date' is set to yesterday's date`, () => {
			const reOpenClosesDate = dateYesterdayTimeStamp;
			it('should return false', async () => {
				const { isRelevantRepresentationsReOpened } = await import(
					'../applications-key-dates.utils.js'
				);

				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(false);
			});
		});

		describe(`When the 're-open closes date' is set to today's date`, () => {
			const reOpenClosesDate = dateTodayTimeStamp;
			it('should return true', async () => {
				const { isRelevantRepresentationsReOpened } = await import(
					'../applications-key-dates.utils.js'
				);

				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(true);
			});
		});

		describe(`When the 're-open closes date' is set to tomorrow's date`, () => {
			const reOpenClosesDate = dateTomorrowTimeStamp;
			it('should return true', async () => {
				const { isRelevantRepresentationsReOpened } = await import(
					'../applications-key-dates.utils.js'
				);

				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(true);
			});
		});
	});

	describe('#getProjectFormLink', () => {
		const mockProjectData = {
			reference: 'mock-reference'
		};
		it('should return the project form link', async () => {
			const { getProjectFormLink } = await import('../applications-key-dates.utils.js');

			expect(getProjectFormLink(mockProjectData)).toContain(
				'/projects/mock-reference/register/register-have-your-say'
			);
		});
	});

	describe('#getSectionValuesForDisplay', () => {
		const sectionValues = {
			testSection: 1704067200,
			anotherTestSection: 1704153600
		};

		it('should return the original section values if section name does NOT exist', async () => {
			const { getSectionValuesForDisplay } = await import('../applications-key-dates.utils.js');
			const sectionName = '';

			expect(getSectionValuesForDisplay(sectionValues, sectionName)).toEqual(sectionValues);
		});

		it('should return the original section values if they do NOT include the given section name', async () => {
			const { getSectionValuesForDisplay } = await import('../applications-key-dates.utils.js');
			const sectionName = 'differentTestSection';

			expect(getSectionValuesForDisplay(sectionValues, sectionName)).toEqual(sectionValues);
		});

		it('should return the section values for the given section name if it is included in the original section values', async () => {
			const { getSectionValuesForDisplay } = await import('../applications-key-dates.utils.js');
			const sectionName = 'testSection';

			expect(getSectionValuesForDisplay(sectionValues, sectionName)).toEqual({
				testSection: 1704067200
			});
		});
	});

	describe('#getBackLink', () => {
		const caseId = 4;
		const mockKeyDatesUrl = '/applications-service/case/4/mock-key-dates/';
		const mockFeesForecastingUrl = '/applications-service/case/4/mock-fees-forecasting/';

		jest.unstable_mockModule('./src/server/lib/nunjucks-filters/url.js', () => {
			return {
				__esModule: true,
				url: jest.fn()
			};
		});

		it('should return the url for the fees forecasting index page if section name exists', async () => {
			const { url } = await import('../../../../lib/nunjucks-filters/url.js');
			url.mockReturnValueOnce(mockKeyDatesUrl).mockReturnValueOnce(mockFeesForecastingUrl);

			const { getBackLink } = await import('../applications-key-dates.utils.js');
			const sectionName = 'testSection';

			expect(getBackLink(sectionName, caseId)).toEqual(mockFeesForecastingUrl);
		});

		it('should return the url for the key dates index page if section name does NOT exist', async () => {
			const { url } = await import('../../../../lib/nunjucks-filters/url.js');
			url.mockReturnValueOnce(mockKeyDatesUrl).mockReturnValueOnce(mockFeesForecastingUrl);

			const { getBackLink } = await import('../applications-key-dates.utils.js');
			const sectionName = '';

			expect(getBackLink(sectionName, caseId)).toEqual(mockKeyDatesUrl);
		});
	});
});

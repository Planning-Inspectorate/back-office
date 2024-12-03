import { jest } from '@jest/globals';
import {
	getProjectFormLink,
	isRelevantRepresentationsReOpened
} from '../applications-key-dates.utils.js';

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
			it('should return false', () => {
				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(false);
			});
		});

		describe(`When the 're-open closes date' is set to today's date`, () => {
			const reOpenClosesDate = dateTodayTimeStamp;
			it('should return true', () => {
				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(true);
			});
		});

		describe(`When the 're-open closes date' is set to tomorrow's date`, () => {
			const reOpenClosesDate = dateTomorrowTimeStamp;
			it('should return true', () => {
				expect(isRelevantRepresentationsReOpened(reOpenClosesDate)).toEqual(true);
			});
		});
	});

	describe('#getProjectFormLink', () => {
		const mockProjectData = {
			reference: 'mock-reference'
		};
		it('should return the project form link', () => {
			expect(getProjectFormLink(mockProjectData)).toContain(
				'/projects/mock-reference/register/register-have-your-say'
			);
		});
	});
});

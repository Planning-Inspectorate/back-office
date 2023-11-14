import { jest } from '@jest/globals';

import { getKeyDates } from '../utils/get-key-dates.js';

const mockDateYesterday = '2023-01-09';
const mockDateYesterdayUnix = '1673222400'; // '2023-01-09'

const mockDateToday = '2023-01-10';
const mockDateTodayUnix = '1673308800'; // '2023-01-10'

const mockDateTomorrow = '2023-01-11';
const mockDateTomorrowUnix = '1673395200'; // '2023-01-11'

describe('applications/case/representations/utils/get-key-dates', () => {
	describe('#getKeyDates', () => {
		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date(mockDateToday));
		});
		afterEach(() => {
			jest.useRealTimers();
		});
		describe('When getting the key dates', () => {
			describe('and there are no set dates', () => {
				let keyDates = {};
				const mockPublishedDate = null;
				const mockRepsPeriodCloseDate = null;
				const mockRepsPeriodCloseDateExtension = null;

				beforeEach(() => {
					keyDates = getKeyDates(
						mockPublishedDate,
						mockRepsPeriodCloseDate,
						mockRepsPeriodCloseDateExtension
					);
				});
				it('should set the state to open', () => {
					expect(keyDates).toEqual({
						closingDate: '',
						publishedDate: '',
						reviewDate: '',
						state: 'open'
					});
				});
			});

			describe('and the closing date is today', () => {
				let keyDates = {};
				const mockPublishedDate = null;
				const mockRepsPeriodCloseDate = mockDateTodayUnix;
				const mockRepsPeriodCloseDateExtension = null;

				beforeEach(() => {
					keyDates = getKeyDates(
						mockPublishedDate,
						mockRepsPeriodCloseDate,
						mockRepsPeriodCloseDateExtension
					);
				});
				it('should set the state to open', () => {
					expect(keyDates).toEqual({
						closingDate: '10 January 2023',
						publishedDate: '',
						reviewDate: '24 January 2023',
						state: 'open'
					});
				});
			});

			describe('and the closing date is after today', () => {
				let keyDates = {};
				const mockPublishedDate = null;
				const mockRepsPeriodCloseDate = mockDateTomorrowUnix;
				const mockRepsPeriodCloseDateExtension = null;

				beforeEach(() => {
					keyDates = getKeyDates(
						mockPublishedDate,
						mockRepsPeriodCloseDate,
						mockRepsPeriodCloseDateExtension
					);
				});
				it('should set the state to open', () => {
					expect(keyDates).toEqual({
						closingDate: '11 January 2023',
						publishedDate: '',
						reviewDate: '25 January 2023',
						state: 'open'
					});
				});
			});

			describe('and the closing date is before today', () => {
				let keyDates = {};
				const mockPublishedDate = null;
				const mockRepsPeriodCloseDate = mockDateYesterdayUnix;
				const mockRepsPeriodCloseDateExtension = null;

				beforeEach(() => {
					keyDates = getKeyDates(
						mockPublishedDate,
						mockRepsPeriodCloseDate,
						mockRepsPeriodCloseDateExtension
					);
				});
				it('should set the state to closed', () => {
					expect(keyDates).toEqual({
						closingDate: '9 January 2023',
						publishedDate: '',
						reviewDate: '23 January 2023',
						state: 'closed'
					});
				});
			});

			describe('and the published date is present', () => {
				describe('and the published date is after today', () => {
					let keyDates = {};
					const mockPublishedDate = mockDateTomorrow;
					const mockRepsPeriodCloseDate = null;
					const mockRepsPeriodCloseDateExtension = null;

					beforeEach(() => {
						keyDates = getKeyDates(
							mockPublishedDate,
							mockRepsPeriodCloseDate,
							mockRepsPeriodCloseDateExtension
						);
					});
					it('should not set the state to published', () => {
						expect(keyDates).toEqual({
							closingDate: '',
							publishedDate: '11 January 2023',
							reviewDate: '',
							state: 'open'
						});
					});
				});

				describe('and the published date is today', () => {
					let keyDates = {};
					const mockPublishedDate = mockDateToday;
					const mockRepsPeriodCloseDate = null;
					const mockRepsPeriodCloseDateExtension = null;

					beforeEach(() => {
						keyDates = getKeyDates(
							mockPublishedDate,
							mockRepsPeriodCloseDate,
							mockRepsPeriodCloseDateExtension
						);
					});
					it('should set the state to published', () => {
						expect(keyDates).toEqual({
							closingDate: '',
							publishedDate: '10 January 2023',
							reviewDate: '',
							state: 'published'
						});
					});
				});

				describe('and the published date is before today', () => {
					let keyDates = {};
					const mockPublishedDate = mockDateYesterday;
					const mockRepsPeriodCloseDate = null;
					const mockRepsPeriodCloseDateExtension = null;

					beforeEach(() => {
						keyDates = getKeyDates(
							mockPublishedDate,
							mockRepsPeriodCloseDate,
							mockRepsPeriodCloseDateExtension
						);
					});
					it('should set the state to published', () => {
						expect(keyDates).toEqual({
							closingDate: '',
							publishedDate: '9 January 2023',
							reviewDate: '',
							state: 'published'
						});
					});
				});
			});
		});
	});
});

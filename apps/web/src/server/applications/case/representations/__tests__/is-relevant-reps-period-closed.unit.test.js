import { isRelevantRepsPeriodClosed } from '../utils/is-relevant-reps-period-closed.js';
import { getUnixTime } from 'date-fns';

describe('is relevant representation period closed', () => {
	describe('#isRelevantRepsPeriodClosed', () => {
		describe('and the dates are invalid or null', () => {
			it('should return false if isRelevantRepsPeriodClosed AND extensionToDateRelevantRepresentationsClose are NULL', () => {
				const result = isRelevantRepsPeriodClosed(null, null);

				expect(result).toEqual(false);
			});

			it('should return false if isRelevantRepsPeriodClosed is an invalid date', () => {
				const result = isRelevantRepsPeriodClosed('invalid date', null);

				expect(result).toEqual(false);
			});
		});

		describe('and the dates are valid', () => {
			it('should return false if isRelevantRepsPeriodClosed AND extensionToDateRelevantRepresentationsClose are NOT in the past', () => {
				const result = isRelevantRepsPeriodClosed(
					getUnixTime(new Date('2099-01-01')),
					getUnixTime(new Date('2099-01-01'))
				);

				expect(result).toEqual(false);
			});
			it('should return false if isRelevantRepsPeriodClosed is in the past, but extensionToDateRelevantRepresentationsClose is NOT in the past', () => {
				const result = isRelevantRepsPeriodClosed(
					getUnixTime(new Date('2001-01-01')),
					getUnixTime(new Date('2099-01-01'))
				);

				expect(result).toEqual(false);
			});
			it('should return true if isRelevantRepsPeriodClosed AND extensionToDateRelevantRepresentationsClose dates are in the past', () => {
				const result = isRelevantRepsPeriodClosed(
					getUnixTime(new Date('2020-01-01')),
					getUnixTime(new Date('2021-01-01'))
				);

				expect(result).toEqual(true);
			});
			it('should return true if isRelevantRepsPeriodClosed date is in the past', () => {
				const result = isRelevantRepsPeriodClosed(getUnixTime(new Date('2020-01-01')), null);

				expect(result).toEqual(true);
			});
		});
	});
});

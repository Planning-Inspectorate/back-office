import { jest } from '@jest/globals';
import { formatDateForDisplay } from '../dates.js';
import logger from '../logger.js';

describe('dates', () => {
	describe('#formatDateForDisplay', () => {
		it('should return the date in dd MMM yyyy format when a valid timestamp is passed in', () => {
			const dateToFormat = 1710000000;
			const result = formatDateForDisplay(dateToFormat);

			expect(result).toEqual('09 Mar 2024');
		});

		it('should return the date in the correct format when a valid timestamp and format string are passed in', () => {
			const dateToFormat = 1710000000;
			const formatString = 'd MMM yy';
			const result = formatDateForDisplay(dateToFormat, formatString);

			expect(result).toEqual('9 Mar 24');
		});

		it('should return the date in dd MMM yyy format when a valid date string is passed in', () => {
			const dateToFormat = '2025-10-05T00:00:00.000';
			const result = formatDateForDisplay(dateToFormat);

			expect(result).toEqual('05 Oct 2025');
		});

		it('should return the date in the correct format when a valid date string and format string are passed in', () => {
			const dateToFormat = '2025-10-05T00:00:00.000';
			const formatString = 'd MMM yy';
			const result = formatDateForDisplay(dateToFormat, formatString);

			expect(result).toEqual('5 Oct 25');
		});

		it('should return an empty string if a falsy date value is passed in', () => {
			const dateToFormat = null;
			const result = formatDateForDisplay(dateToFormat);

			expect(result).toEqual('');
		});

		it('should return an empty string if an invalid format string is passed in', () => {
			jest.spyOn(logger, 'error').mockImplementation(() => {});
			const dateToFormat = '2025-10-05T00:00:00.000';
			const formatString = 'not-valid';
			const result = formatDateForDisplay(dateToFormat, formatString);

			expect(result).toEqual('');
		});
	});
});

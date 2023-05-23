import { addressToString } from '../address-formatter.js';
import asyncRoute from '../async-route.js';
import { bodyToPayload } from '../body-formatter.js';
import { dateIsValid, isDateInstance } from '../dates.js';
import { appealShortReference } from '../nunjucks-filters/appeals.js';
import { datestamp, displayDate } from '../nunjucks-filters/date.js';
import { nameToString } from '../person-name-formatter.js';

describe('Libraries', () => {
	describe('addressFormatter', () => {
		it('should converts a multi part address to a single string', () => {
			const address = {
				postCode: 'postcode',
				addressLine1: 'address 1',
				addressLine2: 'address 2',
				town: 'town'
			};

			const adressFormatted = addressToString(address);

			expect(typeof adressFormatted).toBe('string');
		});
	});

	describe('appeals', () => {
		describe('appealShortRef', () => {
			const tests = [
				{
					name: 'null',
					ref: null,
					want: null
				},
				{
					name: 'undefined'
				},
				{
					name: 'empty',
					ref: '',
					want: ''
				},
				{
					name: 'invalid',
					ref: 'APP/5141/9999',
					want: 'APP/5141/9999'
				},
				{
					name: 'valid 1',
					ref: 'APP/Q9999/D/21/1345264',
					want: '1345264'
				},
				{
					name: 'valid 2',
					ref: 'APP/Q9999/D/21/5463281',
					want: '5463281'
				}
			];

			for (const { name, ref, want } of tests) {
				it(`should handle ${name}`, () => {
					const got = appealShortReference(ref);

					expect(got).toEqual(want);
				});
			}
		});
	});

	describe('async-route helper', () => {
		it('should throw error if route throws error', () => {
			const error = new Error('some error');

			const route = async () => {
				throw error;
			};

			expect(asyncRoute(route)).rejects.toThrowError(error);
		});

		it('should throw error if route returns rejected promise', () => {
			const error = new Error('some error');

			const route = async () => {
				await Promise.reject(error);
			};

			expect(asyncRoute(route)).rejects.toThrowError(error);
		});
	});

	describe('BodyToPayload', () => {
		it('should format correct the body', () => {
			const body = {
				'A1.B1.C1': 'a1b1c1',
				'A1.B2.C2': 'a1b2c2',
				'A1.B1.C3': 'a1b1c3',
				'A1.C3': 'a1c3',
				'A2.B2': 'a2b2',
				'A2.B1': 'a2b1',
				A3: 'a3'
			};

			const payload = bodyToPayload(body);
			const expectPayload = {
				A1: {
					B1: {
						C1: 'a1b1c1',
						C3: 'a1b1c3'
					},
					B2: {
						C2: 'a1b2c2'
					},
					C3: 'a1c3'
				},
				A2: {
					B2: 'a2b2',
					B1: 'a2b1'
				},
				A3: 'a3'
			};

			expect(payload).toMatchObject(expectPayload);
		});
	});

	describe('dates', () => {
		describe('dateIsValid', () => {
			it('should return true if day, month and year params form a date that is semantically valid and real', () => {
				expect(dateIsValid(2024, 2, 29)).toBe(true);
			});
			it('should return false if day, month and year params form a date that is semantically valid but not real', () => {
				expect(dateIsValid(2023, 2, 29)).toBe(false);
			});
			it('should return true if day, month and year params form a valid real date', () => {
				expect(dateIsValid(2023, 2, 1)).toBe(true);
			});
			it('should return false if day parameter is outside the valid range', () => {
				expect(dateIsValid(2023, 1, 0)).toBe(false);
				expect(dateIsValid(2023, 1, 32)).toBe(false);
			});
			it('should return false if month parameter is outside the valid range', () => {
				expect(dateIsValid(2023, 0, 1)).toBe(false);
				expect(dateIsValid(2023, 13, 1)).toBe(false);
			});
		});

		describe('isDateInstance', () => {
			it('should determine if a date is an instance of Date', () => {
				const year = 1989;
				const month = 3;
				const day = 25;
				const date = new Date(year, month - 1, day);

				const instanceOfDate = isDateInstance(date);

				expect(typeof instanceOfDate).toEqual('boolean');
			});
		});

		describe('datestamp', () => {
			it('should return BST date if date between March-October', () => {
				// 05/02/2023 @ 8:54am
				const unixTimestamp = '1683017640';
				const options = { format: 'yyyy-MM-dd HH:mm:ss zzz' };

				const gmtDate = datestamp(unixTimestamp, options);

				expect(gmtDate).toEqual('2023-05-02 09:54:00 BST');
			});

			it('should return GMT date if date between November-February', () => {
				// 12/02/2023 @ 8:54am
				const unixTimestamp = '1701507240';
				const options = { format: 'yyyy-MM-dd HH:mm:ss zzz' };

				const gmtDate = datestamp(unixTimestamp, options);

				expect(gmtDate).toEqual('2023-12-02 08:54:00 GMT');
			});
		});

		describe('displayDate', () => {
			it('should return BST date if between last Sunday in March and last Sunday of October', () => {
				const date = '2023-03-26T23:00:00+00:00';

				const gmtDate = displayDate(date);

				expect(gmtDate).toEqual('27 March 2023');
			});

			it('should return GMT date if not if between last Sunday in March and last Sunday of October', () => {
				const date = '2023-10-29T23:00:00+00:00';

				const gmtDate = displayDate(date);

				expect(gmtDate).toEqual('29 October 2023');
			});
		});
	});

	describe('nameToString', () => {
		it('should converts a multi part person name to a single string', () => {
			const applicant = {
				firstName: 'firstName',
				lastName: 'lastName',
				id: 1,
				organisationName: 'organisationName',
				email: 'email',
				website: 'website',
				phoneNumber: 'phoneNumber'
			};

			const formattedApplicant = nameToString(applicant);

			expect(typeof formattedApplicant).toEqual('string');
		});
	});
});

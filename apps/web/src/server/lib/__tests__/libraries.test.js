import { addressToString } from '../address-formatter.js';
import asyncRoute from '../async-route.js';
import { bodyToPayload } from '../body-formatter.js';
import { dateIsValid, isDateInstance } from '../dates.js';
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

	describe('async-route helper', () => {
		it('should throw error if route throws error', () => {
			const error = new Error('some error');

			// @ts-ignore
			const route = async (req, res) => {
				throw error;
			};

			expect(asyncRoute(route)).rejects.toThrowError(error);
		});

		it('should throw error if route returns rejected promise', () => {
			const error = new Error('some error');

			// @ts-ignore
			const route = async (req, res) => {
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
			it('should determine if a date is valid', () => {
				const year = 1989;
				const month = 3;
				const day = 25;

				const validDate = dateIsValid(year, month, day);

				expect(typeof validDate).toEqual('boolean');
			});

			it('should return true if a date is valid', () => {
				const year = 1989;
				const month = 3;
				const day = 25;

				const validDate = dateIsValid(year, month, day);

				expect(validDate).toEqual(true);
			});

			it('should return false if a date is invalid', () => {
				const year = 190;
				const month = 33;
				const day = 255;

				const validDate = dateIsValid(year, month, day);

				expect(validDate).toEqual(false);
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

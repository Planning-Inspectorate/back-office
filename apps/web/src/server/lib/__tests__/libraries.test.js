import asyncRoute from '../async-route.js';
import { bodyToPayload } from '../body-formatter.js';

describe('Libraries', () => {
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
});

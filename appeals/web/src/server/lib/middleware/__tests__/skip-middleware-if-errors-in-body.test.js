// @ts-nocheck
import { jest } from '@jest/globals';
import { skipMiddlewareIfErrorsInRequest } from '../skip-middleware-if-errors-in-body.js';

describe('skip-middleware-if-errors-in-body', () => {
	let conditionalMiddleware;

	beforeEach(() => {
		conditionalMiddleware = jest.fn();
	});

	it('should return an express middleware function which takes three parameters', () => {
		const result = skipMiddlewareIfErrorsInRequest(conditionalMiddleware);

		expect(typeof result).toBe('function');
		expect(result.length).toBe(3);
	});

	describe('the returned middleware function', () => {
		let next;

		beforeEach(() => {
			next = jest.fn();
			conditionalMiddleware = jest.fn();
		});

		it('should skip the supplied middleware if errors are present in the request body', () => {
			const result = skipMiddlewareIfErrorsInRequest(conditionalMiddleware);
			const req = {
				errors: {
					'test-error': {}
				}
			};
			const res = {};

			result(req, res, next);

			expect(conditionalMiddleware).not.toHaveBeenCalled();
			expect(next).toHaveBeenCalledTimes(1);
		});

		it('should execute the supplied middleware if errors are not present in the body', () => {
			const result = skipMiddlewareIfErrorsInRequest(conditionalMiddleware);
			const req = {};
			const res = {};

			result(req, res, next);

			expect(conditionalMiddleware).toHaveBeenCalledTimes(1);
			expect(next).not.toHaveBeenCalled();
		});
	});
});

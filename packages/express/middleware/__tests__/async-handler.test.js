import { jest } from '@jest/globals';
import { asyncHandler } from '../async-handler.js';

const error = new Error('some error');
const req = {};
const res = {};
describe('async-handler helper', () => {
	describe('when route is synchronous', () => {
		it('should call next if route throws an error', async () => {
			const next = jest.fn();
			const route = asyncHandler(() => {
				throw error;
			});

			// @ts-ignore
			route(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
		it('should not call next if route does not throw an error', async () => {
			const req = {};
			const res = {};
			const next = jest.fn();
			const route = asyncHandler(() => {});

			// @ts-ignore
			route(req, res, next);

			expect(next).not.toHaveBeenCalled();
		});
	});

	describe('when route is asynchronous', () => {
		it('should call next if route throws an error', async () => {
			const next = jest.fn();
			const route = asyncHandler(async () => {
				throw error;
			});

			// @ts-ignore
			await route(req, res, next);

			expect(next).toHaveBeenCalledWith(error);
		});
		it('should not call next if route does not throw an error', async () => {
			const next = jest.fn();
			const route = asyncHandler(async () => {});

			// @ts-ignore
			await route(req, res, next);

			expect(next).not.toHaveBeenCalled();
		});
	});
});

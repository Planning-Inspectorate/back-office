// @ts-nocheck
import { expect } from 'chai';
import { validateSchema } from '../../utils/schema-validation.js';
import { endpoint, request, schema } from './index.js';

describe(`GET - ${endpoint}`, () => {
	beforeEach(() => {
		request.clear();
	});

	describe('Positive', () => {
		it('should return 200 status and match schema', async () => {
			const { body, statusCode } = await request.get();
			expect(statusCode).to.equal(200);
			validateSchema(schema, body);
		});
	});

	describe('Negative', () => {
		it('should return 200 with invalid query params', async () => {
			const { body, statusCode } = await request.get({ path: `${endpoint}?foo=bar` });
			expect(statusCode).to.equal(200);
			validateSchema(schema, body);
		});

		it('should return a 404 status code and an error message indicating that the requested method is not found', async () => {
			const { body, statusCode } = await request.post();
			expect(statusCode).to.equal(404);
		});
	});
});

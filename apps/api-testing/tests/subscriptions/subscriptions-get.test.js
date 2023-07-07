// @ts-nocheck
import { expect } from 'chai';
import { validateSchema } from '../../utils/schema-validation.js';
import { endpoint, request, getResponse400, getResponse404 } from './index.js';

describe(`GET ${endpoint}`, () => {
	beforeEach(() => {
		request.clear();
	});

	describe('Negative', () => {
		it('should return a 400 status code and error response for missing required parameters', async () => {
			const { body, statusCode } = await request.get({});
			expect(statusCode).to.equal(400);
			validateSchema(getResponse400, body);
		});

		it('should return a 400 status code and error response for missing required parameters - (missing email)', async () => {
			const { body, statusCode } = await request.get({
				query: {
					caseReference: 'non-existent-case-reference'
				}
			});
			expect(statusCode).to.equal(400);
			validateSchema(getResponse400, body);
		});

		it('should return a 400 status code and error response for missing required parameters - (missing case reference)', async () => {
			const { body, statusCode } = await request.get({
				query: {
					emailAddress: 'non-existent-email@example.com'
				}
			});
			expect(statusCode).to.equal(400);
			validateSchema(getResponse400, body);
		});

		it('should return a 404 status code and error response for a non-existent subscription', async () => {
			const { body, statusCode } = await request.get({
				query: {
					caseReference: 'non-existent-case-reference',
					emailAddress: 'non-existent-email@example.com'
				}
			});
			expect(statusCode).to.equal(404);
			validateSchema(getResponse404, body);
		});
	});
});

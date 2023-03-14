// @ts-nocheck
import { expect } from 'chai';
import schemas from '../../schemas/schema.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';
import { validateSchema } from '../../utils/schema-validation.js';

describe('Appeals - Case Officer', () => {
	it('Schema Validation', async () => {
		const endpoint = '/appeals/case-officer';
		const request = new TestService(endpoint);
		const { body, statusCode } = await request.get();
		expect(statusCode).to.equal(200);
		const promises = body.map(async (res) => {
			const valid = await validateSchema(schemas[endpoint], res);
			expect(valid).to.be.true;
		});

		await Promise.all(promises);
	});
});

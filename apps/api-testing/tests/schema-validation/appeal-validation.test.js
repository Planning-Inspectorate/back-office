// @ts-nocheck
import { expect } from 'chai';
import schemas from '../../schemas/schema.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';
import { validateSchema } from '../../utils/schema-validation.js';

describe('Appeals - Validation', () => {
	it('Schema Validation', async () => {
		const endpoint = '/appeals/validation/';
		const request = new TestService(endpoint.slice(0, -1));
		const { body, statusCode } = await request.get();
		expect(statusCode).to.equal(200);
		const valid = await validateSchema(schemas[endpoint], body);
		expect(valid).to.be.true;
	});
});

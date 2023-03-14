// @ts-nocheck
import { expect } from 'chai';
import schemas from '../../schemas/schema.json' assert { type: 'json' };
import { TestService } from '../../services/test-service.js';
import { validateSchema } from '../../utils/schema-validation.js';

describe('Appeals - Validation By ID', () => {
	it('Schema Validation', async () => {
		const endpoint = '/appeals/validation/{appealId}';
		const { body: appeals } = await new TestService('/appeals/validation').get();
		const promises = appeals.map(async (appeal) => {
			const request = new TestService(`/appeals/validation/${appeal.AppealId}`);
			const { body, statusCode } = await request.get();
			expect(statusCode).to.equal(200);
			const valid = await validateSchema(schemas[endpoint], body);
			expect(valid).to.be.true;
		});

		await Promise.all(promises);
	});
});

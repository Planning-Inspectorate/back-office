// @ts-nocheck
import { expect } from 'chai';
import { validateSchema } from '../../utils/schema-validation.js';
import { endpoint, request, putResponse200, putResponse400, putResponse201 } from './index.js';
import { generateSubscriptionPayload } from './data.js';

describe(`PUT ${endpoint}`, () => {
	beforeEach(async () => {
		request.clear();
	});

	describe('Positive', () => {
		const payloadForNewSubscription = generateSubscriptionPayload({ language: 'English' });

		it('should create a new subscription', async () => {
			const { body, statusCode } = await request.put({ payload: payloadForNewSubscription });
			expect(statusCode).to.eq(201);
			validateSchema(putResponse201, body);
		});

		it('should update the subscription', async () => {
			payloadForNewSubscription['language'] = 'Welsh';
			const { body, statusCode } = await request.put({ payload: payloadForNewSubscription });
			expect(statusCode).to.eq(200);
			validateSchema(putResponse200, body);
		});
	});

	describe('Negative', () => {
		it('should return an error for missing required parameters - caseReference', async () => {
			const { body, statusCode } = await request.put({
				payload: generateSubscriptionPayload({ caseReference: '' })
			});
			expect(statusCode).to.eq(400);
			validateSchema(putResponse400, body);
		});

		it('should return an error for missing required parameters - emailAddress', async () => {
			const { body, statusCode } = await request.put({
				payload: generateSubscriptionPayload({ emailAddress: '' })
			});
			expect(statusCode).to.eq(400);
			validateSchema(putResponse400, body);
		});

		it('should return an error for missing required parameters - subscriptionTypes', async () => {
			const { body, statusCode } = await request.put({
				payload: generateSubscriptionPayload({ subscriptionTypes: [] })
			});
			expect(statusCode).to.eq(400);
			validateSchema(putResponse400, body);
		});

		it('should return an error for incorrect language', async () => {
			const { body, statusCode } = await request.put({
				payload: generateSubscriptionPayload({ language: 'invalid' })
			});
			expect(statusCode).to.eq(400);
			validateSchema(putResponse400, body);
		});

		it('should return an error for incorrect language', async () => {
			const { body, statusCode } = await request.put({
				payload: generateSubscriptionPayload({ startDate: 'invalid', endDate: 'invalid' })
			});
			expect(statusCode).to.eq(400);
			validateSchema(putResponse400, body);
		});
	});
});

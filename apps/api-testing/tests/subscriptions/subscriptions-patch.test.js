// @ts-nocheck
import { expect } from 'chai';
import { validateSchema } from '../../utils/schema-validation.js';
import {
	endpoint,
	request,
	patchResponse200,
	patchResponse400,
	patchResponse404
} from './index.js';
import { generateSubscriptionPayload } from './data.js';
import { faker } from '@faker-js/faker';
import { TestService } from '../../services/test-service.js';

describe(`PATCH ${endpoint}`, () => {
	const patchRequest = (id) => new TestService(`${endpoint}/${id}`);
	beforeEach(async () => {
		request.clear();
	});

	describe('Positive', () => {
		it("should update the subscription's end date", async () => {
			const subscription = await request.put({ payload: generateSubscriptionPayload() });
			const subscriptionId = subscription.body.id;

			const { body, statusCode } = await patchRequest(subscriptionId).patch({
				payload: { endDate: faker.date.future() }
			});

			expect(statusCode).to.eq(200);
			validateSchema(patchResponse200, body);
		});
	});

	describe('Negative', () => {
		it('should return an error for missing required parameter', async () => {
			const subscription = await request.put({ payload: generateSubscriptionPayload() });
			const subscriptionId = subscription.body.id;

			const { body, statusCode } = await patchRequest(subscriptionId).patch({
				payload: {}
			});

			expect(statusCode).to.eq(400);
			validateSchema(patchResponse400, body);
		});

		it('should return an error for invalid date format', async () => {
			const subscription = await request.put({ payload: generateSubscriptionPayload() });
			const subscriptionId = subscription.body.id;

			const { body, statusCode } = await patchRequest(subscriptionId).patch({
				payload: { endDate: '01/02/2090' }
			});

			expect(statusCode).to.eq(400);
			validateSchema(patchResponse400, body);
		});

		it('should return an error for subscription not found', async () => {
			const { body, statusCode } = await patchRequest(faker.random.numeric(10)).patch({
				payload: { endDate: faker.date.future() }
			});

			expect(statusCode).to.eq(404);
			validateSchema(patchResponse404, body);
		});
	});
});

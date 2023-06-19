import supertest from 'supertest';
import { app } from '../../../app-test';
import { databaseConnector } from '../../../utils/database-connector';
const { eventClient } = await import('../../../infrastructure/event-client.js');

/**
 * @typedef {import('../../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 */

/**
 * @type {supertest.SuperTest<supertest.Test>}
 */
let request;

describe('subscriptions', () => {
	beforeAll(() => {
		// only initialise our app when we're going to run some tests
		request = supertest(app);
	});

	describe('get', () => {
		const tests = [
			{
				name: 'should check all required fields',
				query: {},
				want: {
					status: 400,
					body: {
						errors: {
							caseReference: 'caseReference is required',
							emailAddress: 'emailAddress is required'
						}
					}
				}
			},
			{
				name: 'should allow a valid request',
				query: {
					caseReference: '5123',
					emailAddress: 'hello.world@example.com'
				},
				subscription: null,
				want: {
					status: 404,
					body: { errors: { notFound: 'subscription not found' } }
				}
			},
			{
				name: 'should return a subscription',
				query: {
					caseReference: '1234',
					emailAddress: 'hello.world@example.com'
				},
				subscription: { id: 123, caseReference: '1234', emailAddress: 'hello.world@example.com' },
				want: {
					status: 200,
					body: { id: 123, caseReference: '1234', emailAddress: 'hello.world@example.com' }
				}
			}
		];

		for (const { name, query, subscription, want } of tests) {
			test('' + name, async () => {
				if (subscription !== undefined) {
					databaseConnector.subscription.findUnique.mockResolvedValueOnce(subscription);
				}
				// action
				let queryStr = '';
				for (const [k, v] of Object.entries(query)) {
					queryStr += `${k}=${encodeURIComponent(v)}&`;
				}
				const response = await request.get(`/applications/subscriptions?${queryStr}`);

				// checks
				expect(response.body).toEqual(want.body);
				expect(response.status).toEqual(want.status);
			});
		}
	});

	describe('post', () => {
		const validReq = {
			caseReference: '5123',
			emailAddress: 'hello.world@example.com',
			subscriptionType: 'allUpdates'
		};
		const tests = [
			{
				name: 'should check all required fields',
				body: {},
				want: {
					status: 400,
					body: {
						errors: {
							caseReference: 'caseReference is required',
							emailAddress: 'emailAddress is required',
							subscriptionType: 'subscriptionType is required'
						}
					}
				}
			},
			{
				name: 'should check all required fields types',
				body: {
					caseReference: 5123,
					emailAddress: [1, 2],
					subscriptionType: false
				},
				want: {
					status: 400,
					body: {
						errors: {
							caseReference: 'caseReference must be a string',
							emailAddress: 'emailAddress must be a string',
							subscriptionType: 'subscriptionType must be a string'
						}
					}
				}
			},
			{
				name: 'should allow a valid request',
				body: {
					caseReference: '5123',
					emailAddress: 'hello.world@example.com',
					subscriptionType: 'allUpdates'
				},
				createdId: 5,
				want: {
					status: 200,
					body: { id: 5 }
				}
			},
			{
				name: 'should validate startDate',
				body: {
					...validReq,
					startDate: '2023-06-15T09:27:00.000Z'
				},
				createdId: 6,
				want: {
					status: 200,
					body: { id: 6 }
				}
			},
			{
				name: 'should validate endDate',
				body: {
					...validReq,
					endDate: '2023-06-15T09:27:00.000Z'
				},
				createdId: 7,
				want: {
					status: 200,
					body: { id: 7 }
				}
			},
			{
				name: 'should validate language',
				body: {
					...validReq,
					language: 'English'
				},
				createdId: 8,
				want: {
					status: 200,
					body: { id: 8 }
				}
			},
			{
				name: 'should check startDate is before endDate',
				body: {
					...validReq,
					startDate: '2023-06-15T09:27:00.000Z',
					endDate: '2023-06-30T09:27:00.000Z'
				},
				createdId: 9,
				want: {
					status: 200,
					body: { id: 9 }
				}
			},
			{
				name: 'should error if startDate is after endDate',
				body: {
					...validReq,
					startDate: '2023-06-15T09:27:00.000Z',
					endDate: '2023-01-15T09:27:00.000Z'
				},
				want: {
					status: 400,
					body: {
						errors: {
							endDate: 'startDate must be before endDate'
						}
					}
				}
			}
		];

		for (const { name, body, createdId, want } of tests) {
			test('' + name, async () => {
				// setup
				databaseConnector.subscription.findUnique.mockResolvedValueOnce(null);
				if (createdId) {
					const created = {
						...body,
						id: createdId
					};
					if (body.startDate) {
						created.startDate = new Date(body.startDate);
					}
					if (body.endDate) {
						created.endDate = new Date(body.endDate);
					}
					if (body.language) {
						created.language = body.language;
					}
					databaseConnector.subscription.create.mockResolvedValueOnce(created);
				}

				// action
				const response = await request.post('/applications/subscriptions').send(body);

				// checks
				expect(response.status).toEqual(want.status);
				expect(response.body).toEqual(want.body);
				if (createdId) {
					const msg = {
						...body,
						subscriptionId: createdId
					};
					// this is OK because we always run some checks
					// eslint-disable-next-line jest/no-conditional-expect
					expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
						'nsip-subscription',
						[msg],
						'Create'
					);
				}
			});
		}
	});

	describe('patch', () => {
		const tests = [
			{
				name: 'should check all required fields',
				body: {},
				want: {
					status: 400,
					body: {
						errors: {
							endDate: 'endDate must be a valid date'
						}
					}
				}
			},
			{
				name: 'should validate endDate',
				body: {
					endDate: '2023-06-31T09:27:00.000Z'
				},
				want: {
					status: 400,
					body: {
						errors: {
							endDate: 'endDate must be a valid date'
						}
					}
				}
			},
			{
				name: 'should check endDate is after startDate',
				body: {
					endDate: '2023-06-01T09:27:00.000Z'
				},
				existing: { startDate: new Date('2023-06-16T09:27:00.000Z') },
				want: {
					status: 400,
					body: {
						errors: {
							endDate: 'endDate must be after startDate'
						}
					}
				}
			},
			{
				name: 'should update endDate',
				body: {
					endDate: '2023-06-15T09:27:00.000Z'
				},
				existing: {},
				updated: {
					id: 1,
					endDate: new Date('2023-06-15T09:27:00.000Z'),
					caseReference: '123',
					emailAddress: 'user@example.com',
					subscriptionType: 'allUpdates'
				},
				want: {
					status: 200,
					body: {
						id: 1,
						endDate: '2023-06-15T09:27:00.000Z',
						caseReference: '123',
						emailAddress: 'user@example.com',
						subscriptionType: 'allUpdates'
					}
				}
			}
		];

		for (const { name, body, updated, existing, want } of tests) {
			test('' + name, async () => {
				// setup
				if (updated !== undefined) {
					databaseConnector.subscription.update.mockResolvedValueOnce(updated);
				}
				if (existing !== undefined) {
					databaseConnector.subscription.findUnique.mockResolvedValueOnce(existing);
				}

				// action
				const response = await request.patch('/applications/subscriptions/1').send(body);

				// checks
				expect(response.status).toEqual(want.status);
				expect(response.body).toEqual(want.body);
				if (updated) {
					/** @type {NSIPSubscription|*} */
					const msg = {
						...want.body
					};
					delete msg.id;
					msg.subscriptionId = updated.id;
					// this is OK because we always run some checks
					// eslint-disable-next-line jest/no-conditional-expect
					expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
						'nsip-subscription',
						[msg],
						'Update'
					);
				}
			});
		}
	});
});

import { request } from '#app-test';
import { databaseConnector } from '#utils/database-connector.js';
import { prepareInput } from '../subscriptions.service.js';
import { eventClient } from '#infrastructure/event-client.js';

/**
 * @typedef {import('../../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 */

describe('subscriptions', () => {
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
				subscription: {
					id: 123,
					caseReference: '1234',
					emailAddress: 'hello.world@example.com',
					subscribedToAllUpdates: true
				},
				want: {
					status: 200,
					body: {
						id: 123,
						caseReference: '1234',
						emailAddress: 'hello.world@example.com',
						subscriptionTypes: ['allUpdates']
					}
				}
			}
		];

		it.each(tests)('$name', async ({ query, subscription, want }) => {
			databaseConnector.subscription.findUnique.mockReset();
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
	});

	describe('put (new)', () => {
		const validReq = {
			caseReference: '5123',
			emailAddress: 'hello.world@example.com',
			subscriptionTypes: ['allUpdates']
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
							subscriptionTypes: 'subscriptionTypes is required'
						}
					}
				}
			},
			{
				name: 'should check all required fields types',
				body: {
					caseReference: 5123,
					emailAddress: [1, 2],
					subscriptionTypes: false
				},
				want: {
					status: 400,
					body: {
						errors: {
							caseReference: 'caseReference must be a string',
							emailAddress: 'emailAddress must be a string',
							subscriptionTypes: 'subscriptionTypes must be an array'
						}
					}
				}
			},
			{
				name: 'should allow a valid request',
				body: {
					caseReference: '5123',
					emailAddress: 'hello.world@example.com',
					subscriptionTypes: ['allUpdates']
				},
				createdId: 5,
				want: {
					status: 201,
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
					status: 201,
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
					status: 201,
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
					status: 201,
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
					status: 201,
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

		it.each(tests)('$name', async ({ body, createdId, want }) => {
			// setup
			databaseConnector.subscription.findUnique.mockReset();
			databaseConnector.subscription.create.mockReset();
			databaseConnector.subscription.findUnique.mockResolvedValueOnce(null);

			if (createdId) {
				databaseConnector.subscription.create.mockImplementationOnce((sub) => {
					return {
						...sub.data,
						id: createdId
					};
				});
			}

			// action
			const response = await request.put('/applications/subscriptions').send(body);

			// checks
			expect(response.status).toEqual(want.status);
			expect(response.body).toEqual(want.body);
			if (createdId) {
				const msgs = body.subscriptionTypes.map((t) => {
					const msg = {
						...body,
						subscriptionType: t,
						subscriptionId: createdId
					};
					delete msg.subscriptionTypes;
					return msg;
				});
				// this is OK because we always run some checks
				// eslint-disable-next-line jest/no-conditional-expect
				expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
					'nsip-subscription',
					msgs,
					'Create'
				);
			}
		});
	});

	describe('put (update)', () => {
		const validReq = {
			caseReference: '5123',
			emailAddress: 'hello.world@example.com',
			subscriptionTypes: ['allUpdates']
		};
		const tests = [
			{
				name: 'should allow a valid request',
				body: {
					caseReference: '5123',
					emailAddress: 'hello.world@example.com',
					subscriptionTypes: ['allUpdates']
				},
				existing: { id: 5 },
				want: {
					status: 200,
					body: { id: 5 },
					events: {
						Create: ['allUpdates']
					}
				}
			},
			{
				name: 'should validate startDate',
				body: {
					...validReq,
					startDate: '2023-06-15T09:27:00.000Z'
				},
				existing: { id: 6 },
				want: {
					status: 200,
					body: { id: 6 },
					events: {
						Create: ['allUpdates']
					}
				}
			},
			{
				name: 'should validate endDate',
				body: {
					...validReq,
					endDate: '2023-06-15T09:27:00.000Z'
				},
				existing: { id: 7 },
				want: {
					status: 200,
					body: { id: 7 },
					events: {
						Create: ['allUpdates']
					}
				}
			},
			{
				name: 'should validate language',
				body: {
					...validReq,
					language: 'English'
				},
				existing: { id: 8 },
				want: {
					status: 200,
					body: { id: 8 },
					events: {
						Create: ['allUpdates']
					}
				}
			},
			{
				name: 'should check startDate is before endDate',
				body: {
					...validReq,
					startDate: '2023-06-15T09:27:00.000Z',
					endDate: '2023-06-30T09:27:00.000Z'
				},
				existing: { id: 9 },
				want: {
					status: 200,
					body: { id: 9 },
					events: {
						Create: ['allUpdates']
					}
				}
			},
			{
				name: 'should send appropriate events for changes',
				body: {
					...validReq,
					subscriptionTypes: ['applicationSubmitted', 'applicationDecided']
				},
				existing: {
					id: 9,
					subscribedToApplicationSubmitted: true,
					subscribedToRegistrationOpen: true
				},
				want: {
					status: 200,
					body: { id: 9 },
					events: {
						Create: ['applicationDecided'],
						Update: ['applicationSubmitted'],
						Delete: ['registrationOpen']
					}
				}
			}
		];

		it.each(tests)('$name', async ({ body, existing, want }) => {
			// setup
			databaseConnector.subscription.findUnique.mockReset();
			databaseConnector.subscription.update.mockReset();
			databaseConnector.subscription.findUnique.mockResolvedValueOnce(existing);

			const updated = prepareInput(body);
			updated.id = existing.id;
			databaseConnector.subscription.update.mockResolvedValueOnce(updated);

			// action
			const response = await request.put('/applications/subscriptions').send(body);

			// checks
			expect(response.body).toEqual(want.body);
			expect(response.status).toEqual(want.status);
			if (existing.id) {
				for (const [eventType, subTypes] of Object.entries(want.events)) {
					// this is OK because we always run some checks
					// eslint-disable-next-line jest/no-conditional-expect
					expect(eventClient.sendEvents).toHaveBeenCalledWith(
						'nsip-subscription',
						subTypes.map((t) => {
							const msg = {
								...body,
								subscriptionType: t,
								subscriptionId: existing.id
							};
							delete msg.subscriptionTypes;
							return msg;
						}),
						eventType
					);
				}
			}
		});
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
					subscribedToAllUpdates: true
				},
				want: {
					status: 200,
					body: {
						id: 1,
						endDate: '2023-06-15T09:27:00.000Z',
						caseReference: '123',
						emailAddress: 'user@example.com',
						subscriptionTypes: ['allUpdates']
					}
				}
			}
		];

		it.each(tests)('$name', async ({ body, updated, existing, want }) => {
			databaseConnector.subscription.findUnique.mockReset();
			databaseConnector.subscription.update.mockReset();
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
				const msgs = want.body.subscriptionTypes.map((t) => {
					const msg = {
						...want.body,
						subscriptionType: t,
						subscriptionId: updated.id
					};
					delete msg.subscriptionTypes;
					delete msg.id;
					return msg;
				});
				// this is OK because we always run some checks
				// eslint-disable-next-line jest/no-conditional-expect
				expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
					'nsip-subscription',
					msgs,
					'Update'
				);
			}
		});
	});

	describe('prepareInput', () => {
		/**
		 * @typedef {Object} Test
		 * @property {string} name
		 * @property {*} request
		 * @property {import('@prisma/client').Prisma.SubscriptionCreateInput} want
		 */
		/** @type {Test[]} */
		const tests = [
			{
				name: 'should prepare basic request, setting all subscription fields false',
				request: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscriptionTypes: []
				},
				want: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: false,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: false,
					startDate: null,
					endDate: null
				}
			},
			{
				name: 'should set only all updates subscription fields true',
				request: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscriptionTypes: ['allUpdates', 'applicationDecided']
				},
				want: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscribedToAllUpdates: true,
					subscribedToApplicationDecided: false,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: false,
					startDate: null,
					endDate: null
				}
			},
			{
				name: 'should set appropriate subscription fields true',
				request: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscriptionTypes: ['applicationDecided', 'registrationOpen']
				},
				want: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: true,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: true,
					startDate: null,
					endDate: null
				}
			},
			{
				name: 'should set start and end as dates',
				request: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscriptionTypes: ['applicationDecided', 'registrationOpen'],
					startDate: '2023-07-03T07:44:00Z',
					endDate: '2023-07-15T07:44:00Z'
				},
				want: {
					caseReference: 'abc',
					emailAddress: 'hello@example.com',
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: true,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: true,
					startDate: new Date('2023-07-03T07:44:00Z'),
					endDate: new Date('2023-07-15T07:44:00Z')
				}
			}
		];
		it.each(tests)('$name', ({ request, want }) => {
			expect(prepareInput(request)).toEqual(want);
		});
	});
});

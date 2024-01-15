import { request } from '#app-test';
import { databaseConnector } from '#utils/database-connector.js';
import { prepareInput } from '../subscriptions.service.js';
import { eventClient } from '#infrastructure/event-client.js';
import { subscriptionToResponse } from '../subscriptions.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../constants.js';
import { ERROR_MUST_BE_NUMBER } from '#middleware/errors.js';
import { typesError } from '../subscriptions.validators.js';

/**
 * @typedef {import('../../../../message-schemas/events/nsip-subscription.d.js').NSIPSubscription} NSIPSubscription
 */

describe('subscriptions', () => {
	describe('get', () => {
		const tests = [
			{
				name: 'should check all required fields',
				body: {},
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
				body: {
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
				body: {
					caseReference: '1234',
					emailAddress: 'hello.world@example.com'
				},
				subscription: {
					id: 123,
					caseReference: '1234',
					serviceUser: {
						id: 123,
						email: 'hello.world@example.com'
					},
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

		it.each(tests)('$name', async ({ body, subscription, want }) => {
			databaseConnector.subscription.findFirst.mockReset();
			if (subscription !== undefined) {
				databaseConnector.subscription.findFirst.mockResolvedValueOnce(subscription);
			}
			const response = await request.post(`/applications/subscriptions`).send(body);

			// checks
			expect(response.body).toEqual(want.body);
			expect(response.status).toEqual(want.status);
		});
	});

	describe('get (list)', () => {
		/**
		 *
		 * @returns {import('@prisma/client').Subscription}
		 */
		const dummySubscription = () => {
			return {
				id: 123,
				caseReference: '1234',
				subscribedToAllUpdates: true,
				caseId: 1,
				startDate: null,
				endDate: null,
				language: null,
				subscribedToApplicationDecided: false,
				subscribedToApplicationSubmitted: false,
				subscribedToRegistrationOpen: false,
				serviceUser: { id: 123, email: 'hello.world@example.com' }
			};
		};
		const tests = [
			{
				name: 'no subscriptions',
				subscriptions: [],
				totalSubscriptions: 0,
				want: {
					status: 200,
					body: {
						itemCount: 0,
						items: [],
						page: DEFAULT_PAGE_NUMBER,
						pageCount: 0,
						pageSize: DEFAULT_PAGE_SIZE
					}
				}
			},
			{
				name: 'defaults to first page of subscriptions',
				subscriptions: Array(25).fill(dummySubscription()),
				totalSubscriptions: 50,
				want: {
					status: 200,
					body: {
						itemCount: 50,
						items: Array(25).fill(subscriptionToResponse(dummySubscription())),
						page: DEFAULT_PAGE_NUMBER,
						pageCount: 2,
						pageSize: DEFAULT_PAGE_SIZE
					}
				}
			},
			{
				name: 'validates pageSize params',
				query: {
					pageSize: 'a'
				},
				want: {
					status: 400,
					body: {
						errors: {
							pageSize: ERROR_MUST_BE_NUMBER
						}
					}
				}
			},
			{
				name: 'validates page params',
				query: {
					page: 'abc'
				},
				want: {
					status: 400,
					body: {
						errors: {
							page: ERROR_MUST_BE_NUMBER
						}
					}
				}
			},
			{
				name: 'validates pagination params',
				query: {
					page: 2,
					pageSize: 23
				},
				subscriptions: [],
				totalSubscriptions: 0,
				want: {
					status: 200,
					body: {
						itemCount: 0,
						items: [],
						page: 2,
						pageCount: 0,
						pageSize: 23
					}
				}
			},
			{
				name: 'only allows valid type field',
				query: {
					type: 'random-status'
				},
				want: {
					status: 400,
					body: {
						errors: {
							type: typesError
						}
					}
				}
			},
			{
				name: 'allows valid filter fields',
				query: {
					type: 'allUpdates',
					caseReference: 'abc-123'
				},
				subscriptions: [],
				totalSubscriptions: 0,
				want: {
					status: 200,
					body: {
						itemCount: 0,
						items: [],
						page: 1,
						pageCount: 0,
						pageSize: 25
					}
				}
			}
		];

		it.each(tests)('$name', async ({ query, subscriptions, totalSubscriptions, want }) => {
			databaseConnector.subscription.findMany.mockReset();
			databaseConnector.subscription.count.mockReset();
			if (subscriptions !== undefined) {
				databaseConnector.subscription.findMany.mockResolvedValueOnce(subscriptions);
				databaseConnector.subscription.count.mockResolvedValueOnce(totalSubscriptions);
			}
			// action
			let queryStr = '';
			for (const [k, v] of Object.entries(query || {})) {
				queryStr += `${k}=${encodeURIComponent(v)}&`;
			}
			const response = await request.get(`/applications/subscriptions/list?${queryStr}`);

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
			databaseConnector.subscription.findFirst.mockReset();
			databaseConnector.subscription.create.mockReset();
			databaseConnector.subscription.findFirst.mockResolvedValueOnce(null);

			if (createdId) {
				databaseConnector.subscription.create.mockImplementationOnce((sub) => {
					return {
						...sub.data,
						...(body.emailAddress ? { serviceUser: { id: 123, email: body.emailAddress } } : {}),
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
				expect(eventClient.sendEvents).toHaveBeenCalledWith('nsip-subscription', msgs, 'Create');
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
			databaseConnector.subscription.findFirst.mockReset();
			databaseConnector.subscription.update.mockReset();
			databaseConnector.serviceUser.findFirst.mockReset();
			databaseConnector.subscription.findFirst.mockResolvedValueOnce(existing);
			databaseConnector.serviceUser.findFirst.mockResolvedValueOnce({ id: 123 });

			const { subscription: updated } = await prepareInput(body);
			updated.id = existing.id;
			updated.serviceUser = { id: 123, email: body.emailAddress };
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
					serviceUser: {
						id: 123,
						email: 'user@example.com'
					},
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
			databaseConnector.serviceUser.findFirst.mockReset();
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
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: false,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: false,
					startDate: null,
					endDate: null,
					serviceUser: {
						connect: {
							id: 123
						}
					}
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
					subscribedToAllUpdates: true,
					subscribedToApplicationDecided: false,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: false,
					startDate: null,
					endDate: null,
					serviceUser: {
						connect: {
							id: 123
						}
					}
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
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: true,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: true,
					startDate: null,
					endDate: null,
					serviceUser: {
						connect: {
							id: 123
						}
					}
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
					subscribedToAllUpdates: false,
					subscribedToApplicationDecided: true,
					subscribedToApplicationSubmitted: false,
					subscribedToRegistrationOpen: true,
					startDate: new Date('2023-07-03T07:44:00Z'),
					endDate: new Date('2023-07-15T07:44:00Z'),
					serviceUser: {
						connect: {
							id: 123
						}
					}
				}
			}
		];
		it.each(tests)('$name', async ({ request, want }) => {
			databaseConnector.serviceUser.findFirst.mockResolvedValueOnce({ id: 123 });

			const { subscription } = await prepareInput(request);
			expect(subscription).toEqual(want);
		});
	});
});

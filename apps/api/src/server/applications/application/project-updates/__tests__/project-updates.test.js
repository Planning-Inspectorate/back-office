import { request } from '../../../../app-test.js';
import { databaseConnector } from '../../../../utils/database-connector.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants.js';
import { buildProjectUpdatePayload, mapProjectUpdate } from '../project-updates.mapper.js';
import {
	ERROR_INVALID_SORT_BY,
	ERROR_INVALID_SORT_BY_OPTION,
	ERROR_MUST_BE_NUMBER
} from '../../../../middleware/errors.js';
import { NSIP_PROJECT_UPDATE } from '../../../../infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { eventClient } from '../../../../infrastructure/event-client.js';
import { htmlContentError, statusError } from '../project-updates.validators.js';
import { NotFound } from '#utils/api-errors.js';
import { jest } from '@jest/globals';

describe('project-updates', () => {
	describe('get', () => {
		const now = new Date();
		/**
		 * @param {number} caseId
		 * @returns {import('@prisma/client').ProjectUpdate}
		 */
		const dummyProjectUpdate = (caseId) => {
			return {
				id: 1,
				caseId,
				dateCreated: now,
				status: 'draft',
				emailSubscribers: true,
				sentToSubscribers: true,
				authorId: 1,
				htmlContent: 'content',
				htmlContentWelsh: null,
				title: null,
				datePublished: null
			};
		};
		const tests = [
			{
				name: 'invalid caseId',
				id: '5463',
				want: {
					status: 404,
					body: {
						errors: {
							id: 'Must be an existing application'
						}
					}
				}
			},
			{
				name: 'non-existant caseId',
				id: 1,
				want: {
					status: 404,
					body: {
						errors: {
							id: 'Must be an existing application'
						}
					}
				}
			},
			{
				name: 'no updates',
				id: 1,
				caseEntry: { id: 1 },
				updates: [],
				totalUpdates: 0,
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
				name: 'defaults to first page of updates',
				id: 1,
				caseEntry: { id: 1 },
				updates: Array(25).fill(dummyProjectUpdate(1)),
				totalUpdates: 50,
				want: {
					status: 200,
					body: {
						itemCount: 50,
						items: Array(25).fill(mapProjectUpdate(dummyProjectUpdate(1))),
						page: DEFAULT_PAGE_NUMBER,
						pageCount: 2,
						pageSize: DEFAULT_PAGE_SIZE
					}
				}
			},
			{
				name: 'validates pageSize params',
				id: 1,
				query: 'pageSize=a',
				caseEntry: { id: 1 },
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
				id: 1,
				query: 'page=abc',
				caseEntry: { id: 1 },
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
				id: 1,
				query: 'page=2&pageSize=23',
				caseEntry: { id: 1 },
				updates: [],
				totalUpdates: 0,
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
				name: 'validates sortBy params',
				id: 1,
				query: 'sortBy=invalid',
				caseEntry: { id: 1 },
				want: {
					status: 400,
					body: {
						errors: {
							sortBy: ERROR_INVALID_SORT_BY
						}
					}
				}
			},
			{
				name: 'only allows valid sortBy field',
				id: 1,
				query: 'sortBy=%2Bid',
				caseEntry: { id: 1 },
				want: {
					status: 400,
					body: {
						errors: {
							sortBy: ERROR_INVALID_SORT_BY_OPTION
						}
					}
				}
			},
			{
				name: 'allows valid sortBy field',
				id: 1,
				query: 'sortBy=%2Bstatus',
				caseEntry: { id: 1 },
				updates: [],
				totalUpdates: 0,
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

		for (const { name, id, query, caseEntry, updates, totalUpdates, want } of tests) {
			test('' + name, async () => {
				// setup
				databaseConnector.case.findUnique.mockReset();
				databaseConnector.projectUpdate.findMany.mockReset();

				if (caseEntry) {
					databaseConnector.case.findUnique.mockResolvedValueOnce(caseEntry);
				}

				if (updates) {
					databaseConnector.projectUpdate.count.mockResolvedValueOnce(totalUpdates);
					databaseConnector.projectUpdate.findMany.mockResolvedValueOnce(updates);
				}

				// action
				let url = `/applications/${id}/project-updates`;
				if (query) {
					url += '?' + query;
				}
				const response = await request.get(url);

				// checks
				expect(response.status).toEqual(want.status);
				expect(response.body).toEqual(want.body);
			});
		}
	});

	describe('post', () => {
		const tests = [
			{
				name: 'should check all required fields',
				body: {},
				want: {
					status: 400,
					body: {
						errors: {
							emailSubscribers: 'emailSubscribers is required',
							status: 'status is required',
							htmlContent: 'htmlContent is required'
						}
					}
				}
			},
			{
				name: 'should check all field types',
				body: {
					emailSubscribers: 'str',
					status: 1,
					htmlContent: false
				},
				want: {
					status: 400,
					body: {
						errors: {
							emailSubscribers: 'emailSubscribers must be a boolean',
							status: statusError,
							htmlContent: 'htmlContent must be a string'
						}
					}
				}
			},
			{
				name: 'should check HTML content is safe - disallowed tags',
				body: {
					emailSubscribers: true,
					status: 'draft',
					htmlContent: '<img src="https://image.com/not-allowed"> Something happened'
				},
				want: {
					status: 400,
					body: {
						errors: {
							htmlContent: htmlContentError
						}
					}
				}
			},
			{
				name: 'should check HTML content is safe - insecure link',
				body: {
					emailSubscribers: true,
					status: 'draft',
					htmlContent: '<a src="http://image.com/insecure">New Link</a>Something happened'
				},
				want: {
					status: 400,
					body: {
						errors: {
							htmlContent: htmlContentError
						}
					}
				}
			},
			{
				name: 'should check HTML content is safe - script',
				body: {
					emailSubscribers: true,
					status: 'draft',
					htmlContent: `<script>function myMaliciousFunc(){window.location='https://my-bad-site.com';}</script>Something happened`
				},
				want: {
					status: 400,
					body: {
						errors: {
							htmlContent: htmlContentError
						}
					}
				}
			},
			{
				name: 'should allow a valid request',
				body: {
					emailSubscribers: true,
					status: 'draft',
					htmlContent:
						'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
				},
				existingCase: {
					reference: 'abc-123'
				},
				created: {
					id: 5,
					caseId: 1,
					dateCreated: new Date('2023-07-04T10:00:00.000Z'),
					sentToSubscribers: false
				},
				want: {
					status: 200,
					body: {
						id: 5,
						caseId: 1,
						dateCreated: '2023-07-04T10:00:00.000Z',
						emailSubscribers: true,
						sentToSubscribers: false,
						status: 'draft',
						htmlContent:
							'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
					}
				}
			}
		];

		it.each(tests)('$name', async ({ body, created, existingCase, want }) => {
			// setup
			// mock case
			databaseConnector.case.findUnique.mockReset();
			databaseConnector.case.findUnique.mockResolvedValueOnce({ id: 1 });

			databaseConnector.projectUpdate.create.mockReset();

			let createdUpdate;

			if (created) {
				databaseConnector.projectUpdate.create.mockImplementationOnce((req) => {
					createdUpdate = {
						...created,
						...req.data,
						case: existingCase
					};
					return createdUpdate;
				});
			}

			// action
			const response = await request.post('/applications/1/project-updates').send(body);

			// checks
			expect(response.status).toEqual(want.status);
			expect(response.body).toEqual(want.body);
			if (created) {
				// this is OK because we always run some checks
				// eslint-disable-next-line jest/no-conditional-expect
				expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
					NSIP_PROJECT_UPDATE,
					[buildProjectUpdatePayload(createdUpdate, existingCase.reference)],
					EventType.Create
				);
			}
		});
	});

	describe('project-update', () => {
		describe('get', () => {
			const now = new Date();
			/**
			 * @param {number} caseId
			 * @returns {import('@prisma/client').ProjectUpdate}
			 */
			const dummyProjectUpdate = (caseId) => {
				return {
					id: 1,
					caseId,
					dateCreated: now,
					status: 'draft',
					emailSubscribers: true,
					sentToSubscribers: true,
					authorId: 1,
					htmlContent: 'content',
					htmlContentWelsh: null,
					title: null,
					datePublished: null
				};
			};
			const tests = [
				{
					name: 'invalid caseId',
					id: '5463',
					want: {
						status: 404,
						body: {
							errors: {
								id: 'Must be an existing application'
							}
						}
					}
				},
				{
					name: 'non-existant caseId',
					id: 1,
					want: {
						status: 404,
						body: {
							errors: {
								id: 'Must be an existing application'
							}
						}
					}
				},
				{
					name: 'not found',
					id: 1,
					caseEntry: { id: 1 },
					projectUpdateId: 1,
					projectUpdate: {},
					want: {
						status: 404,
						body: NotFound
					}
				},
				{
					name: 'not found: wrong case Id',
					id: 1,
					caseEntry: { id: 1 },
					projectUpdateId: 1,
					projectUpdate: dummyProjectUpdate(2),
					want: {
						status: 404,
						body: NotFound
					}
				},
				{
					name: 'formatted update',
					id: 1,
					caseEntry: { id: 1 },
					projectUpdateId: 1,
					projectUpdate: dummyProjectUpdate(1),
					want: {
						status: 200,
						body: mapProjectUpdate(dummyProjectUpdate(1))
					}
				},
				{
					name: 'checks update content from the db',
					id: 1,
					caseEntry: { id: 1 },
					projectUpdateId: 1,
					projectUpdate: {
						...dummyProjectUpdate(1),
						htmlContent: '<script>function notSafe(){}</script>'
					},
					want: {
						status: 500,
						body: { errors: 'unsafe English HTML content for update: 1' }
					}
				}
			];

			for (const { name, id, projectUpdateId, projectUpdate, caseEntry, want } of tests) {
				test('' + name, async () => {
					// setup
					databaseConnector.case.findUnique.mockReset();
					databaseConnector.projectUpdate.findUnique.mockReset();

					if (caseEntry) {
						databaseConnector.case.findUnique.mockResolvedValueOnce(caseEntry);
					}

					if (projectUpdateId) {
						databaseConnector.projectUpdate.findUnique.mockResolvedValueOnce(projectUpdate);
					}

					// action
					const url = `/applications/${id}/project-updates/${projectUpdateId}`;
					const response = await request.get(url);

					// checks
					expect(response.status).toEqual(want.status);
					expect(response.body).toEqual(want.body);
				});
			}
		});

		describe('patch', () => {
			const fakeNow = new Date();
			beforeAll(() => {
				jest.useFakeTimers();
				jest.setSystemTime(fakeNow);
			});
			afterAll(() => {
				jest.useRealTimers();
			});
			const tests = [
				{
					name: 'should check for numerical IDs',
					body: {},
					projectUpdateId: 'hello',
					want: {
						status: 400,
						body: {
							errors: {
								projectUpdateId: 'project update id must be a number'
							}
						}
					}
				},
				{
					name: 'should check all field types',
					body: {
						emailSubscribers: 'str',
						status: 1,
						htmlContent: false
					},
					projectUpdateId: 1,
					want: {
						status: 400,
						body: {
							errors: {
								emailSubscribers: 'emailSubscribers must be a boolean',
								status: statusError,
								htmlContent: 'htmlContent must be a string'
							}
						}
					}
				},
				{
					name: 'should check HTML content is safe - disallowed tags',
					body: {
						emailSubscribers: true,
						status: 'draft',
						htmlContent: '<img src="https://image.com/not-allowed"> Something happened'
					},
					projectUpdateId: 1,
					want: {
						status: 400,
						body: {
							errors: {
								htmlContent: htmlContentError
							}
						}
					}
				},
				{
					name: 'should check HTML content is safe - insecure link',
					body: {
						emailSubscribers: true,
						status: 'draft',
						htmlContent: '<a src="http://image.com/insecure">New Link</a>Something happened'
					},
					projectUpdateId: 1,
					want: {
						status: 400,
						body: {
							errors: {
								htmlContent: htmlContentError
							}
						}
					}
				},
				{
					name: 'should check HTML content is safe - script',
					body: {
						emailSubscribers: true,
						status: 'draft',
						htmlContent: `<script>function myMaliciousFunc(){window.location='https://my-bad-site.com';}</script>Something happened`
					},
					projectUpdateId: 1,
					want: {
						status: 400,
						body: {
							errors: {
								htmlContent: htmlContentError
							}
						}
					}
				},
				{
					name: 'should allow a valid request',
					body: {
						emailSubscribers: true,
						status: 'draft',
						htmlContent:
							'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
					},
					projectUpdateId: 1,
					existingCase: {
						reference: 'abc-123'
					},
					updated: {
						id: 5,
						caseId: 1,
						dateCreated: new Date('2023-07-04T10:00:00.000Z'),
						sentToSubscribers: false
					},
					want: {
						event: EventType.Update,
						status: 200,
						body: {
							id: 5,
							caseId: 1,
							dateCreated: '2023-07-04T10:00:00.000Z',
							emailSubscribers: true,
							sentToSubscribers: false,
							status: 'draft',
							htmlContent:
								'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
						}
					}
				},
				{
					name: 'should send a publish event',
					body: {
						emailSubscribers: true,
						status: 'published',
						htmlContent:
							'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
					},
					projectUpdateId: 1,
					existingCase: {
						reference: 'abc-123'
					},
					updated: {
						id: 5,
						caseId: 1,
						status: 'ready-to-publish',
						dateCreated: new Date('2023-07-04T10:00:00.000Z'),
						sentToSubscribers: false,
						datePublished: fakeNow
					},
					want: {
						event: EventType.Publish,
						status: 200,
						body: {
							id: 5,
							caseId: 1,
							dateCreated: '2023-07-04T10:00:00.000Z',
							emailSubscribers: true,
							sentToSubscribers: false,
							status: 'published',
							datePublished: fakeNow.toISOString(),
							htmlContent:
								'<strong>Something Important</strong> My new update <ul><li>list item 1</li><li>list item 1</li></ul><a href="https://my-important-link.com">More info</a>'
						}
					}
				},
				{
					name: 'should send an unpublish event',
					body: {
						status: 'unpublished'
					},
					projectUpdateId: 1,
					existingCase: {
						reference: 'abc-123'
					},
					updated: {
						id: 5,
						caseId: 1,
						status: 'ready-to-unpublish',
						dateCreated: new Date('2023-07-04T10:00:00.000Z'),
						sentToSubscribers: false,
						datePublished: new Date('2023-07-11T10:00:00.000Z'),
						emailSubscribers: true,
						htmlContent: 'hello'
					},
					want: {
						event: EventType.Unpublish,
						status: 200,
						body: {
							id: 5,
							caseId: 1,
							dateCreated: '2023-07-04T10:00:00.000Z',
							emailSubscribers: true,
							sentToSubscribers: false,
							status: 'unpublished',
							datePublished: '2023-07-11T10:00:00.000Z',
							htmlContent: 'hello'
						}
					}
				},
				{
					name: 'should check HTML content is safe before sending an event',
					body: {
						status: 'published'
					},
					projectUpdateId: 1,
					existingCase: {
						reference: 'abc-123'
					},
					updated: {
						id: 5,
						caseId: 1,
						status: 'ready-to-publish',
						dateCreated: new Date('2023-07-04T10:00:00.000Z'),
						sentToSubscribers: false,
						datePublished: fakeNow,
						emailSubscribers: true,
						htmlContent: `<script>function myMaliciousFunc(){window.location='https://my-bad-site.com';}</script>Something happened`
					},
					want: {
						status: 500,
						body: { errors: { content: 'unsafe English HTML content for update: 5' } }
					}
				}
			];

			it.each(tests)('$name', async ({ body, projectUpdateId, updated, existingCase, want }) => {
				// setup
				// mock case
				databaseConnector.case.findUnique.mockReset();
				databaseConnector.case.findUnique.mockResolvedValueOnce({ id: 1 });

				databaseConnector.projectUpdate.update.mockReset();
				databaseConnector.projectUpdate.findUnique.mockReset();

				let projectUpdate;

				if (updated) {
					databaseConnector.projectUpdate.findUnique.mockResolvedValueOnce(updated);
					databaseConnector.projectUpdate.update.mockImplementationOnce((req) => {
						projectUpdate = {
							...updated,
							...req.data,
							case: existingCase
						};
						return projectUpdate;
					});
				}

				// action
				const response = await request
					.patch(`/applications/1/project-updates/${projectUpdateId}`)
					.send(body);

				// checks
				expect(response.status).toEqual(want.status);
				expect(response.body).toEqual(want.body);
				if (updated && want.event) {
					// this is OK because we always run some checks
					// eslint-disable-next-line jest/no-conditional-expect
					expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
						NSIP_PROJECT_UPDATE,
						[buildProjectUpdatePayload(projectUpdate, existingCase.reference)],
						want.event
					);
				}
			});
		});
	});
});

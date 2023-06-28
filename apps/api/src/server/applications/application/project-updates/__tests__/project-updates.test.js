import supertest from 'supertest';
import { app } from '../../../../app-test.js';
import { databaseConnector } from '../../../../utils/database-connector.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../constants.js';
import { mapProjectUpdate } from '../project-updates.mapper.js';
import {
	ERROR_INVALID_SORT_BY,
	ERROR_INVALID_SORT_BY_OPTION,
	ERROR_MUST_BE_NUMBER
} from '../../../../middleware/errors.js';

const request = supertest(app);

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
});

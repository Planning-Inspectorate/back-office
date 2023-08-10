import { request } from '#app-test';
import { databaseConnector } from '#utils/database-connector.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../../../../constants.js';
import { ERROR_MUST_BE_NUMBER } from '#middleware/errors.js';

describe('notification-logs', () => {
	describe('get', () => {
		/**
		 * @param {number} projectUpdateId
		 * @returns {import('@prisma/client').ProjectUpdateNotificationLog}
		 */
		const dummyLog = (projectUpdateId) => {
			return {
				id: 1,
				emailSent: true,
				entryDate: new Date(),
				functionInvocationId: 'id-1',
				projectUpdateId,
				subscriptionId: 1
			};
		};
		/**
		 * @param {number} projectUpdateId
		 * @returns {import('@pins/applications').ProjectUpdateNotificationLog}
		 */
		const dummyLogReturn = (projectUpdateId) => {
			const log = dummyLog(projectUpdateId);
			return {
				...log,
				entryDate: log.entryDate.toISOString()
			};
		};
		const tests = [
			{
				name: 'no logs',
				caseId: 1,
				projectUpdateId: 1,
				logs: [],
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
				name: 'returns logs',
				caseId: 1,
				projectUpdateId: 1,
				logs: Array(25).fill(dummyLog(1)),
				want: {
					status: 200,
					body: {
						itemCount: 25,
						items: Array(25).fill(dummyLogReturn(1)),
						page: DEFAULT_PAGE_NUMBER,
						pageCount: 1,
						pageSize: DEFAULT_PAGE_SIZE
					}
				}
			},
			{
				name: 'validates pageSize params',
				caseId: 1,
				projectUpdateId: 1,
				query: 'pageSize=a',
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
				caseId: 1,
				projectUpdateId: 1,
				query: 'page=abc',
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
				caseId: 1,
				projectUpdateId: 1,
				query: 'page=2&pageSize=23',
				logs: [],
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
			}
		];

		for (const { name, caseId, projectUpdateId, query, logs, want } of tests) {
			test('' + name, async () => {
				// setup
				databaseConnector.case.findUnique.mockResolvedValueOnce({});
				databaseConnector.projectUpdateNotificationLog.findMany.mockReset();

				if (logs) {
					databaseConnector.projectUpdateNotificationLog.count.mockResolvedValueOnce(logs.length);
					databaseConnector.projectUpdateNotificationLog.findMany.mockResolvedValueOnce(logs);
				}

				// action
				let url = `/applications/${caseId}/project-updates/${projectUpdateId}/notification-logs`;
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
				name: 'should check for an array',
				caseId: 1,
				projectUpdateId: 1,
				body: {},
				want: {
					status: 400,
					body: {
						errors: {
							'': 'body must be an array'
						}
					}
				}
			},
			{
				name: 'should check required fields',
				caseId: 1,
				projectUpdateId: 1,
				body: [{}],
				want: {
					status: 400,
					body: {
						errors: {
							'[0].projectUpdateId': 'projectUpdateId is required',
							'[0].subscriptionId': 'subscriptionId is required',
							'[0].entryDate': 'entryDate is required',
							'[0].emailSent': 'emailSent is required',
							'[0].functionInvocationId': 'functionInvocationId is required'
						}
					}
				}
			},
			{
				name: 'should check required field types',
				caseId: 1,
				projectUpdateId: 1,
				body: [
					{
						projectUpdateId: 'str',
						subscriptionId: 'str',
						entryDate: 1,
						emailSent: 1234,
						functionInvocationId: 1
					}
				],
				want: {
					status: 400,
					body: {
						errors: {
							'[0].projectUpdateId': 'projectUpdateId must be a number',
							'[0].subscriptionId': 'subscriptionId must be a number',
							'[0].entryDate': 'entryDate must be a valid date',
							'[0].emailSent': 'emailSent must be a boolean',
							'[0].functionInvocationId': 'functionInvocationId must be a string'
						}
					}
				}
			},
			{
				name: 'should allow a valid request',
				caseId: 1,
				projectUpdateId: 1,
				body: [
					{
						projectUpdateId: 1,
						subscriptionId: 2,
						entryDate: new Date().toISOString(),
						emailSent: true,
						functionInvocationId: 'some-id'
					}
				],
				want: {
					status: 200,
					body: {
						count: 1
					}
				}
			}
		];

		it.each(tests)('$name', async ({ body, caseId, projectUpdateId, want }) => {
			// setup
			// mock case
			databaseConnector.case.findUnique.mockReset();
			databaseConnector.case.findUnique.mockResolvedValueOnce({ id: 1 });

			databaseConnector.projectUpdateNotificationLog.createMany.mockReset();
			databaseConnector.projectUpdateNotificationLog.createMany.mockResolvedValueOnce({
				count: body.length
			});

			// action
			const response = await request
				.post(`/applications/${caseId}/project-updates/${projectUpdateId}/notification-logs`)
				.send(body);

			// checks
			expect(response.status).toEqual(want.status);
			expect(response.body).toEqual(want.body);
		});
	});
});

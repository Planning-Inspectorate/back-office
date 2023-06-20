import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const searchString = 'EN010003 - NI Case 3 Name';
const notFoundSearchString = 'BCDEF';

const application = applicationFactoryForTests({
	title: searchString,
	id: 3,
	description: 'test',
	caseStatus: 'draft',
	dates: { modifiedAt: new Date(1_655_298_882_000) },
	inclusions: {
		CaseStatus: true
	}
});

/**
 *
 * @param {number} skip
 * @param {number} take
 * @param {string} query
 * @returns {object}
 */
const expectedSearchParameters = (skip, take, query) => {
	return {
		skip,
		take,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			OR: [
				{
					title: { contains: query }
				},
				{
					reference: { contains: query }
				},
				{
					description: { contains: query }
				}
			]
		},
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					}
				}
			},
			CaseStatus: {
				where: {
					valid: true
				}
			}
		}
	};
};

describe('Case search', () => {
	test('should get applications using search criteria', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);
		databaseConnector.case.count.mockResolvedValue(1);

		// WHEN
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageSize: 1,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					id: 3,
					status: 'Draft',
					reference: application.reference,
					description: 'test',
					title: searchString
				}
			]
		});

		expect(databaseConnector.case.findMany).toHaveBeenCalledWith(
			expectedSearchParameters(0, 1, searchString)
		);
	});

	test('should get applications using search criteria with default page number', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);
		databaseConnector.case.count.mockResolvedValue(1);

		// WHEN
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageSize: 20
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageSize: 1,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					id: 3,
					status: 'Draft',
					description: 'test',
					reference: application.reference,
					title: searchString
				}
			]
		});

		expect(databaseConnector.case.findMany).toHaveBeenCalledWith(
			expectedSearchParameters(0, 20, searchString)
		);
	});

	test('should get applications using search criteria with default page size', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);
		databaseConnector.case.count.mockResolvedValue(1);

		// THEN
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageNumber: 2
		});

		// WHEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 2,
			pageSize: 1,
			pageCount: 1,
			itemCount: 1,
			items: [
				{
					id: 3,
					status: 'Draft',
					description: 'test',
					reference: application.reference,
					title: searchString
				}
			]
		});

		expect(databaseConnector.case.findMany).toHaveBeenCalledWith(
			expectedSearchParameters(50, 50, searchString)
		);
	});

	test('should get no results using search criteria which will not yield cases', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([]);
		databaseConnector.case.count.mockResolvedValue(0);

		// WHEN
		const response = await request.post('/applications/search').send({
			query: 'BCDEF',
			role: 'case-team',
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageSize: 0,
			pageCount: 0,
			itemCount: 0,
			items: []
		});

		expect(databaseConnector.case.findMany).toHaveBeenCalledWith(
			expectedSearchParameters(0, 1, notFoundSearchString)
		);
	});

	test('should not be able to submit a search if the role is not valid', async () => {
		// GIVEN

		// WHEN
		const resp = await request.post('/applications/search').send({
			query: searchString,
			role: 'validation-officer',
			pageNumber: 1,
			pageSize: 1
		});

		// THEN
		expect(resp.status).toEqual(403);
		expect(resp.body).toEqual({
			errors: {
				role: 'Role is not valid'
			}
		});
	});

	test('should not be able to submit a search if query does not have a value', async () => {
		// GIVEN

		// WHEN
		const resp = await request.post('/applications/search').send({
			query: '',
			role: 'case-admin-officer',
			pageNumber: 1,
			pageSize: 5
		});

		// THEN
		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({
			errors: {
				query: 'Query cannot be blank'
			}
		});
	});

	test.each([[-3], [0], ['text']])(
		'Search case: Sending invalid %O as pageSize and pageNumber throws error',
		async (parameter) => {
			// GIVEN

			// WHEN
			const resp = await request.post('/applications/search').send({
				query: searchString,
				role: 'case-admin-officer',
				pageNumber: parameter,
				pageSize: parameter
			});

			// THEN
			expect(resp.status).toEqual(400);
			expect(resp.body).toEqual({
				errors: {
					pageNumber: 'Page Number is not valid',
					pageSize: 'Page Size is not valid'
				}
			});
		}
	);
});

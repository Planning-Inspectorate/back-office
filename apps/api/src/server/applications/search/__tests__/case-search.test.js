import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
// import { databaseConnector } from '../../../utils/database-connector.js';
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

const applicationsCount = 1;

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		skip: sinon.match.any,
		take: sinon.match.any,
		orderBy: sinon.match.any,
		where: {
			OR: [
				{
					title: { contains: searchString }
				},
				{
					reference: { contains: searchString }
				},
				{
					description: { contains: searchString }
				}
			]
		},
		include: sinon.match.any
	})
	.returns([application]);
findManyStub
	.withArgs({
		skip: sinon.match.any,
		take: sinon.match.any,
		orderBy: sinon.match.any,
		where: {
			OR: [
				{
					title: { contains: notFoundSearchString }
				},
				{
					reference: { contains: notFoundSearchString }
				},
				{
					description: { contains: notFoundSearchString }
				}
			]
		},
		include: sinon.match.any
	})
	.returns([]);

const countStub = sinon.stub();

countStub
	.withArgs({
		where: {
			OR: [
				{
					title: { contains: searchString }
				},
				{
					reference: { contains: searchString }
				},
				{
					description: { contains: searchString }
				}
			]
		}
	})
	.returns(applicationsCount);
countStub
	.withArgs({
		where: {
			OR: [
				{
					title: { contains: notFoundSearchString }
				},
				{
					reference: { contains: notFoundSearchString }
				},
				{
					description: { contains: notFoundSearchString }
				}
			]
		}
	})
	.returns(0);

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
	beforeAll(() => {
		sinon.stub(databaseConnector, 'case').get(() => {
			return {
				findMany: findManyStub,
				count: countStub
			};
		});
	});

	test('should get applications using search criteria', async () => {
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageNumber: 1,
			pageSize: 1
		});

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

		sinon.assert.calledWith(findManyStub, expectedSearchParameters(0, 1, searchString));
	});

	test('should get applications using search criteria with default page number', async () => {
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageSize: 20
		});

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

		sinon.assert.calledWith(findManyStub, expectedSearchParameters(0, 20, searchString));
	});

	test('should get applications using search criteria with default page size', async () => {
		const response = await request.post('/applications/search').send({
			query: searchString,
			role: 'case-team',
			pageNumber: 2
		});

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

		sinon.assert.calledWith(findManyStub, expectedSearchParameters(50, 50, searchString));
	});

	test('should get no results using search criteria which will not yield cases', async () => {
		const response = await request.post('/applications/search').send({
			query: 'BCDEF',
			role: 'case-team',
			pageNumber: 1,
			pageSize: 1
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			page: 1,
			pageSize: 0,
			pageCount: 0,
			itemCount: 0,
			items: []
		});

		sinon.assert.calledWith(findManyStub, expectedSearchParameters(0, 1, notFoundSearchString));
	});

	test('should not be able to submit a search if the role is not valid', async () => {
		const resp = await request.post('/applications/search').send({
			query: searchString,
			role: 'validation-officer',
			pageNumber: 1,
			pageSize: 1
		});

		expect(resp.status).toEqual(403);
		expect(resp.body).toEqual({
			errors: {
				role: 'Role is not valid'
			}
		});
	});

	test('should not be able to submit a search if query does not have a value', async () => {
		const resp = await request.post('/applications/search').send({
			query: '',
			role: 'case-admin-officer',
			pageNumber: 1,
			pageSize: 5
		});

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
			const resp = await request.post('/applications/search').send({
				query: searchString,
				role: 'case-admin-officer',
				pageNumber: parameter,
				pageSize: parameter
			});

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

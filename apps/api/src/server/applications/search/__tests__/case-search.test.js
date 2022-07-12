import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const searchString = 'EN010003 - NI Case 3 Name';

const application = applicationFactoryForTests({
	id: 3,
	status: 'open',
	reference: 'EN010003',
	title: 'EN010003 - NI Case 3',
	description: 'EN010003 - NI Case 3 Name Description',
	createdAt: new Date(1_655_298_882_000),
	modifiedAt: new Date(1_655_298_882_000)
});

const applicationsCount = 1;

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		skip: 0,
		take: 1,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
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
			CaseStatus: true
		}
	})
	.returns([application]);

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

test('should get applications using search criteria', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return {
			findMany: findManyStub,
			count: countStub
		};
	});

	const response = await request
		.post('/applications/search')
		.send({
			query: searchString,
			role: 'case-officer',
			pageNumber: 1,
			pageSize: 1
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		page: 1,
		pageSize: 1,
		pageCount: 1,
		itemCount: 1,
		items: [
			{
				id: 3,
				status: 'open',
				reference: application.reference,
				title: searchString,
				modifiedDate: 1_655_298_882,
				publishedDate: null
			}
		]
	});
});

test('should get applications using search criteria with default page number', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return {
			findMany: findManyStub,
			count: countStub
		};
	});

	const response = await request
		.post('/applications/search')
		.send({
			query: searchString,
			role: 'case-officer',
			pageSize: '20'
		});

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		page: 1,
		pageSize: 1,
		pageCount: 1,
		itemCount: 1,
		items: [
			{
				id: 3,
				status: 'open',
				reference: application.reference,
				title: searchString,
				modifiedDate: 1_655_298_882,
				publishedDate: null
			}
		]
	});
});

test('should get applications using search criteria with default page size', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return {
			findMany: findManyStub,
			count: countStub
		};
	});

	const response = await request
		.post('/applications/search')
		.send({
			query: searchString,
			role: 'case-officer',
			pageNumber: 1
		});

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		page: 1,
		pageSize: 1,
		pageCount: 1,
		itemCount: 1,
		items: [
			{
				id: 3,
				status: 'open',
				reference: application.reference,
				title: searchString,
				modifiedDate: 1_655_298_882,
				publishedDate: null
			}
		]
	});
});

test('should get no results using search criteria which will not yield cases', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return {
			findMany: findManyStub,
			count: countStub
		};
	});

	const response = await request
		.post('/applications/search')
		.send({
			query: 'BCDEF',
			role: 'case-officer',
			pageNumber: 1,
			pageSize: 1 });

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		page: 1,
		pageSize: 0,
		pageCount: 0,
		itemCount: 0,
		items: []
	});
});

test('should not be able to submit a search if the role is not valid', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'validation-officer',
		pageNumber: 1,
		pageSize: 1
	});

	t.is(resp.status, 403);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Role is not valid'
		}
	});
});

test('should not be able to submit a search if the pageNumber is negative', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: -5,
		pageSize: 1
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Number not in valid range'
		}
	});
});

test('should not be able to submit a search if the pageSize is negative', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: 1,
		pageSize: -3
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Size not in valid range'
		}
	});
});

test('should not be able to submit a search if query does not have a value', async (t) => {
	const resp = await request
		.post('/applications/search')
		.send({
			query: '',
			role: 'case-admin-officer',
			pageNumber: 1,
			pageSize: 5
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Query cannot be blank'
		}
	});
});

test('should not be able to submit a search if the pageNumber is zero', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: 0,
		pageSize: 1
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Number not in valid range'
		}
	});
});

test('should not be able to submit a search if the pageSize is zero', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: 1,
		pageSize: 0
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Size not in valid range'
		}
	});
});

test('should not be able to submit a search if the pageSize is non numeric', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: 1,
		pageSize: 'text'
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Size not in valid range'
		}
	});
});

test('should not be able to submit a search if the pageNumber is non numeric', async (t) => {
	const resp = await request.post('/applications/search').send({
		query: searchString,
		role: 'case-admin-officer',
		pageNumber: 'text',
		pageSize: 1
	});

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Page Number not in valid range'
		}
	});
});


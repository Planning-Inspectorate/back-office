import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 3,
	status: 'open',
	reference: 'EN010003',
	title: 'EN010003 - NI Case 3 Name',
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
					title: { contains: 'EN010003 - NI Case 3 Name' }
				},
				{
					reference: { contains: 'EN010003 - NI Case 3 Name' }
				},
				{
					description: { contains: 'EN010003 - NI Case 3 Name' }
				}
			]
		},
		include: {
			subSector: {
				include: {
					sector: true
				}
			}
		}
	})
	.returns([application]);

const countStub = sinon.stub();

countStub
	.withArgs({
		where: {
			OR: [
				{
					title: { contains: 'EN010003 - NI Case 3 Name' }
				},
				{
					reference: { contains: 'EN010003 - NI Case 3 Name' }
				},
				{
					description: { contains: 'EN010003 - NI Case 3 Name' }
				}
			]
		}
	})
	.returns(applicationsCount);

test('gets applications using search criteria', async (t) => {
	sinon.stub(databaseConnector, 'application').get(() => {
		return {
			findMany: findManyStub,
			count: countStub
		};
	});

	const response = await request
		.post('/applications/search')
		.send({ query: 'EN010003 - NI Case 3 Name', role: 'case-officer', pageNumber: 1, pageSize: 1 });

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
				title: 'EN010003 - NI Case 3 Name',
				modifiedDate: 1_655_298_882,
				publishedDate: null
			}
		]
	});
});

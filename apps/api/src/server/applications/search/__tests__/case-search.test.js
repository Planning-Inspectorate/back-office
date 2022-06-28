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
	modifiedAt: new Date(1_655_298_882_000)
});

const findManyStub = sinon.stub();

findManyStub
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

test('gets applications with search criteria on case ID', async (t) => {
	sinon.stub(databaseConnector, 'application').get(() => {
		return { findMany: findManyStub };
	});

	const response = await request
		.post('/applications/search')
		.send({ query: 'EN010003 - NI Case 3 Name' });

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 3,
			status: 'open',
			reference: application.reference,
			title: 'EN010003 - NI Case 3 Name',
			description: 'EN010003 - NI Case 3 Name Description',
			modifiedDate: 1_655_298_882
		}
	]);
});

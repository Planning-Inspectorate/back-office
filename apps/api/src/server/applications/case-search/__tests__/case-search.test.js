import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 3,
	title: 'EN010003 - NI Case 3 Name',
	reference: 'EN010003',
	modifiedAt: new Date(1_655_298_882_000),
	publishedAt: new Date(1_655_298_882_000),
});

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		where: {
			caseId: 3
		}
	})
	.returns([application]);

test('gets applications wit search citeria on case ID', async (t) => {
	sinon.stub(databaseConnector, 'application').get(() => {
		return { findMany: findManyStub };
	});

	const response = await request.get('/applications/search');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 3,
			title: 'EN010003 - NI Case 3 Name',
			reference: 'EN010003',
			modifiedDate: 1_655_298_882,
			publishedDate: 1_655_298_882
		}
	]);
});

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
	modifiedAt: new Date(1_655_298_882_000)
});

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		where: {
			caseId: 3
		}
	})
	.returns([application]);

test('gets applications wit search criteria on case ID', async (t) => {
	sinon.stub(databaseConnector, 'application').get(() => {
		return { findMany: findManyStub };
	});

	const response = await request.get('/applications/search');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 3,
			reference: 'EN010003',
			title: 'EN010003 - NI Case 3 Name',
			description: 'EN010003 - NI Case 3 Name Description',
			modifiedAt: new Date(1_655_298_882_000)
		}
	]);
});

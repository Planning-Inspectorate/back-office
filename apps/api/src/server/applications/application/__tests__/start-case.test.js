import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns({ id: 1 });
findUniqueStub.withArgs({ where: { id: 2 } }).returns(null);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
});

test('starts application if all needed information is present', async (t) => {
	const response = await request.post('/applications/1/start');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		reference: '',
		status: 'Pre-Application'
	});
});

test('throws an error if the application id is not recognised', async (t) => {
	const response = await request.post('/applications/2/start');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be existing application'
		}
	});
});

import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = {
	id: 1
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
});

test('checks if endpoint exists', async (t) => {
	const response = await request.post('/applications/1/document');

	t.is(response.status, 200);
});

test('checks invalid id', async (t) => {
	const response = await request.post('/applications/2/document');

	t.is(response.status, 404);
});

import Prisma from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();

const application = applicationFactoryForTests({ id: 1, status: 'draft' });

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application);
findUniqueStub.withArgs({ where: { id: 2 } }).returns(null);

const updateStub = sinon.stub();

const updateManyCaseStatusStub = sinon.stub();

const createCaseStatusStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub, update: updateStub };
	});

	sinon.stub(databaseConnector, 'caseStatus').get(() => {
		return { updateMany: updateManyCaseStatusStub, create: createCaseStatusStub };
	});

	sinon.stub(Prisma.PrismaClient.prototype, '$transaction');
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('starts application if all needed information is present', async (t) => {
	const response = await request.post('/applications/1/start');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		reference: 'some new reference',
		status: 'Pre-Application'
	});

	sinon.assert.calledWith(updateManyCaseStatusStub, {
		where: { id: { in: [1] } },
		data: { valid: false }
	});

	sinon.assert.calledWith(createCaseStatusStub, { data: { status: 'pre_application', caseId: 1 } });

	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: { modifiedAt: new Date(1_649_319_144_000) },
		include: { serviceCustomer: true }
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

test.todo('throws an error if the application does not have all the required information to start');

test.todo('throws an error if the application is not in draft state');

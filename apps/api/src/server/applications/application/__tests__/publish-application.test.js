import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import logger from '../../../utils/logger.js';

const request = supertest(app);

const updateStub = sinon.stub();

const findUniqueSubSectorStub = sinon.stub();

findUniqueSubSectorStub.withArgs({ where: { name: 'some_sub_sector' } }).returns({});
findUniqueSubSectorStub.withArgs({ where: { name: 'some unknown subsector' } }).returns(null);

const mockDate = new Date(1_649_319_144_000);

const findUniqueStub = sinon.stub();

const mockPublishedAt = new Date('2023-01-15T23:14:04.193Z');

findUniqueStub.withArgs({ where: { id: 1 } }).returns({ id: 1, publishedAt: mockPublishedAt });

const loggerInfo = sinon.stub(logger, 'info');

test.before('set up timer  mock before all tests', () => {
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test.beforeEach('set up db mocks before each tests', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { update: updateStub, findUnique: findUniqueStub };
	});

	updateStub.resolves({
		publishedAt: mockDate
	});
});

test('publish an application and return published Date as a timestamp', async (t) => {
	const caseId = 1;

	const response = await request.patch(`/applications/${caseId}/publish`);

	t.is(response.status, 200);

	const publishedDate = 1_649_319_144;

	sinon.assert.callCount(loggerInfo, 3);

	sinon.assert.calledWithExactly(loggerInfo, `attempting to publish a case with id ${caseId}`);
	sinon.assert.calledWithExactly(loggerInfo, `case was published at ${mockDate}`);
	sinon.assert.calledWithExactly(loggerInfo, `successfully published case with id ${caseId}`);

	t.deepEqual(response.body, {
		publishedDate
	});

	sinon.assert.calledWith(updateStub, {
		where: { id: caseId },
		data: {
			publishedAt: mockDate
		}
	});
});

test('returns 404 error if a caseId does not exist', async (t) => {
	const caseId = 134;

	const response = await request.patch(`/applications/${caseId}/publish`);

	t.is(response.status, 404);

	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

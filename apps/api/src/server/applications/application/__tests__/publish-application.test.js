import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import { mapDateStringToUnixTimestamp } from '../../../utils/mapping/map-date-string-to-unix-timestamp.js';

const request = supertest(app);

const updateStub = sinon.stub();

const findUniqueSubSectorStub = sinon.stub();

findUniqueSubSectorStub.withArgs({ where: { name: 'some_sub_sector' } }).returns({});
findUniqueSubSectorStub.withArgs({ where: { name: 'some unknown subsector' } }).returns(null);

const findUniqueStub = sinon.stub();

const mockPublishedAt = new Date('2023-01-15T23:14:04.193Z');

findUniqueStub.withArgs({ where: { id: 1 } }).returns({ id: 1, publishedAt: mockPublishedAt });

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { update: updateStub, findUnique: findUniqueStub };
	});

	updateStub.resolves({
		publishedAt: new Date(1_649_319_144_000)
	});

	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test.only('publish an application', async (t) => {
	const caseId = 1;

	const response = await request.patch(`/applications/${caseId}/publish`);

	t.is(response.status, 200);

	const publishedDate = mapDateStringToUnixTimestamp(new Date(1_649_319_144_000).toISOString());

	t.deepEqual(response.body, {
		publishedDate
	});

	sinon.assert.calledWith(updateStub, {
		where: { id: caseId },
		data: {
			publishedAt: new Date(1_649_319_144_000)
		}
	});
});

test('throw error if an invalid caseId is provided', async (t) => {
	const caseId = 134;

	const response = await request.patch(`/applications/${caseId}/publish`);

	t.is(response.status, 404);

	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

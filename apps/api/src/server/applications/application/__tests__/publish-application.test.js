import Prisma from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import { mapDateStringToUnixTimestamp } from '../../../utils/mapping/map-date-string-to-unix-timestamp.js';

const request = supertest(app);

const updateStub = sinon.stub().returns([]);

const findUniqueSubSectorStub = sinon.stub();

findUniqueSubSectorStub.withArgs({ where: { name: 'some_sub_sector' } }).returns({});
findUniqueSubSectorStub.withArgs({ where: { name: 'some unknown subsector' } }).returns(null);

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns({ id: 1 });
findUniqueStub.withArgs({ where: { id: 2 } }).returns(null);

const findUniqueServiceCustomerStub = sinon.stub();

findUniqueServiceCustomerStub.withArgs({ where: { id: 1 } }).returns({ id: 1, caseId: 1 });
findUniqueServiceCustomerStub.withArgs({ where: { id: 2 } }).returns({ id: 2, caseId: 2 });

const findUniqueZoomLevelStub = sinon.stub();

findUniqueZoomLevelStub.withArgs({ where: { name: 'some-unknown-map-zoom-level' } }).returns(null);
findUniqueZoomLevelStub.withArgs({ where: { name: 'some-known-map-zoom-level' } }).returns({});

const findUniqueRegionStub = sinon.stub();

findUniqueRegionStub.withArgs({ where: { name: 'region1' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'region2' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'some-unknown-region' } }).returns(null);

const deleteManyStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { update: updateStub, findUnique: findUniqueStub };
	});

	sinon.stub(databaseConnector, 'subSector').get(() => {
		return { findUnique: findUniqueSubSectorStub };
	});

	sinon.stub(databaseConnector, 'serviceCustomer').get(() => {
		return { findUnique: findUniqueServiceCustomerStub };
	});

	sinon.stub(databaseConnector, 'zoomLevel').get(() => {
		return { findUnique: findUniqueZoomLevelStub };
	});

	sinon.stub(databaseConnector, 'region').get(() => {
		return { findUnique: findUniqueRegionStub };
	});

	sinon.stub(databaseConnector, 'regionsOnApplicationDetails').get(() => {
		return { deleteMany: deleteManyStub };
	});

	sinon.stub(Prisma.PrismaClient.prototype, '$transaction').returns([
		{
			publishedAt: new Date(1_649_319_144_000)
		}
	]);

	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('publish an application/case', async (t) => {
	const caseId = 1;

	const response = await request.patch(`/applications/${caseId}/publish`);

	t.is(response.status, 200);

	t.deepEqual(response.body, {
		publishedDate: mapDateStringToUnixTimestamp(new Date(1_649_319_144_000).toISOString())
	});

	sinon.assert.calledWith(updateStub, {
		where: { id: caseId },
		data: {
			publishedAt: new Date(1_649_319_144_000),
			modifiedAt: new Date(1_649_319_144_000)
		},
		include: {
			serviceCustomer: true
		}
	});
});

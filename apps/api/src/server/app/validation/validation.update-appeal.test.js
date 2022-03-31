// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 }, include: { ValidationDecision: true, address: true } }).returns(
	{ id: 1, status: 'received_appeal', addressId: 10 }
);

const updateStub = sinon.stub();

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub,
				update: updateStub
			},
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should be able to modify the appellant name', async (t) => {
	const resp = await request.patch('/validation/1')
		.send({ AppellantName: 'Leah Thornton' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, {
		where: { id: 1 },
		data: { 
			appellantName: 'Leah Thornton',
			updatedAt: sinon.match.any
		}
	});
});

test('should not be able to modify appellant name if provided numbers', async (t) => {
	const resp = await request.patch('/validation/1')
		.send({ AppellantName: '123456789' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		error: 'Invalid request'
	});
});

test('should be able to modify address', async(t) => {
	const resp = await request.patch('/validation/1')
		.send({
			Address: {
				AddressLine1: 'some new addr',
				AddressLine2: 'some more addr',
				Town: 'town',
				County: 'county',
				PostCode: 'POST CODE'	
			}
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, {
		where: { id: 1 },
		data: {
			updatedAt: sinon.match.any,
			address: {
				update: {
					addressLine1: 'some new addr',
					addressLine2: 'some more addr',
					addressLine3: 'town',
					addressLine4: 'county',
					postcode: 'POST CODE'
				}
			}
		}
	});
});

test('should be able to modify local planning department', async(t) => {
	const resp = await request.patch('/validation/1')
		.send({
			LocalPlanningDepartment: 'New Planning Department'
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, {
		where: { id: 1 },
		data: {
			updatedAt: sinon.match.any,
			localPlanningDepartment: 'New Planning Department'
		}
	});
});

test('should be able to modify planning application reference', async(t) => {
	const resp = await request.patch('/validation/1')
		.send({
			PlanningApplicationReference: 'New Planning Application Reference'
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, {
		where: { id: 1 },
		data: {
			updatedAt: sinon.match.any,
			planningApplicationReference: 'New Planning Application Reference'
		}
	});
});

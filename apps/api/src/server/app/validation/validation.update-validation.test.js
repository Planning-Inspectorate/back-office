// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 } }).returns(
	{ id: 1, status: 'received_appeal' }
);

const updateStub = sinon.stub();
// updateStub.returns({ id: 1, status: 'received_appeal' });

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub,
				update: updateStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should be able to modify the appellant name', async (t) => {
	const resp = await request.patch('/validation/1')
		.send({ AppellantName: 'Leah Thornton' });
	console.log(resp.body);
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
});

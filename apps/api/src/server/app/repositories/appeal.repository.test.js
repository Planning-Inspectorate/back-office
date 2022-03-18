// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import appealRepository from './appeal.repository.js';
import sinon from 'sinon';
import DatabaseFactory from './database.js';

const findUniqueStub = sinon.stub();
const updateStub = sinon.stub();
const existingAppeal = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	status: 'received',
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};
const updatedAppeal = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	status: 'new status',
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};
findUniqueStub.withArgs({ where: { id: 1 } }).returns(existingAppeal);
updateStub.withArgs({ where: { id: 1 }, data: { status: 'new status' } }).returns(updatedAppeal);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([]),
				findUnique: findUniqueStub,
				update: updateStub
			}
		};
	}
}

test.before('sets up Database connetion mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('gets all appeals', async(t) => {
	const appeals = await appealRepository.getAll();
	t.deepEqual(appeals, []);
});

test('getting single existing appeal', async(t) => {
	const appeal = await appealRepository.getById(1);
	t.deepEqual(appeal, existingAppeal);
});

test('updates appeal status by id', async(t) => {
	const appeal = await appealRepository.updateStatusById(1, 'new status');
	t.deepEqual(appeal, updatedAppeal);
});

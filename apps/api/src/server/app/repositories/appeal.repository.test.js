import test from 'ava';
import appealRepository from './appeal.repository.js';
import sinon from 'sinon';
import DatabaseFactory from './database.js';

const findUniqueStub = sinon.stub();
const existingAppeal = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	status: 'received',
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};
findUniqueStub.withArgs({ where: { id: 1 } }).returns(existingAppeal);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([]),
				findUnique: findUniqueStub
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

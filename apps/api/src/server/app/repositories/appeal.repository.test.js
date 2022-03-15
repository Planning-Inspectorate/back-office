import test from 'ava';
import appealRepository from './appeal.repository.js';
import sinon from 'sinon';
import DatabaseFactory from './database.js';

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([])
			}
		};
	}
}

test('gets all appeals', async(t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
	const appeals = await appealRepository.getAll();
	t.deepEqual(appeals, []);
});

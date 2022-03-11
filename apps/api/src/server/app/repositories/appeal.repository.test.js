import test from 'ava';
import Appeal from '../../../db/models/appeal.js';
import appealRepository from './appeal.repository.js';

test('get all appeals', async (t) => {
	const appeals = await appealRepository.getAll();
	t.is(appeals.length, 0);
});

test('gets appeal after database seeded', async(t) => {
	await Appeal.create({ reference: 'ABC' });
	const appeals = await appealRepository.getAll();
	t.is(appeals.length, 1);
});

test.beforeEach('cleanup', (_) => {
	Appeal.truncate();
});

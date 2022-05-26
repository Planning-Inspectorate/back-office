import test from 'ava';
import path from 'node:path';
import * as url from 'node:url';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';

const request = supertest(app);
const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

const appeal1 = appealFactoryForTests(
	1,
	[
		{
			id: 1,
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	],
	'FPA'
);

const appeal2 = appealFactoryForTests(
	2,
	[
		{
			id: 2,
			status: 'available_for_statements',
			valid: true,
			createdAt: new Date(2022, 1, 1, 9)
		}
	],
	'FPA'
);

const inclusions = { appealStatus: { where: { valid: true } }, appealType: true };
const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: inclusions }).returns(appeal1);
findUniqueStub.withArgs({ where: { id: 2 }, include: inclusions }).returns(appeal2);

class MockDatabaseClass {
	constructor() {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub
			}
		};
	}
}

test.before('sets up mocks', () => {
	// @ts-ignore
	sinon
		.stub(DatabaseFactory, 'getInstance')
		.callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('Throws error if appeal is not accepting statements', async (t) => {
	const response = await request
		.post('/case-officer/1/statement')
		.attach('statements', pathToFile)
		.attach('statements', pathToFile);

	t.is(response.status, 409);
	t.deepEqual(response.body, { errors: { appeal: 'Appeal is in an invalid state' } });
});

test('Throws error if no file provided', async (t) => {
	const response = await request.post('/case-officer/2/statement');

	t.is(response.status, 400);
	t.deepEqual(response.body, { errors: { statements: 'Select a file' } });
});

test('Returns 200 if successfully uploaded statement', async (t) => {
	const response = await request
		.post('/case-officer/2/statement')
		.attach('statements', pathToFile)
		.attach('statements', pathToFile);

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		AppealId: 2,
		AppealReference: appeal2.reference,
		canUploadStatementsUntil: '08 March 2022'
	});
});

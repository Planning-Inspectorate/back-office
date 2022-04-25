// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import path from 'path';
import * as url from 'url';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(__dirname, './assets/simple.pdf');

const inclusions = { appealStatus: { where: { valid: true } }, appealType: true };
const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 }, include: inclusions }).returns({ appealStatus: [{ status: 'site_visit_not_yet_booked' }] });
findUniqueStub.withArgs({ where: { id: 2 }, include: inclusions }).returns({ appealStatus: [{ status: 'available_for_statements' }] });

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub,
			}
		};
	}
}

test.before('sets up database mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('Throws error if appeal is not accepting statements', async(t) => {
	const response = await request.post('/case-officer/1/statement').attach('statements', pathToFile).attach('statements', pathToFile);
	t.is(response.status, 409);
	t.deepEqual(response.body, { errors: { appeal: 'Appeal is in an invalid state' } });
});      

test('Throws error if no file provided', async(t) => {
	const response = await request.post('/case-officer/2/statement');
	t.is(response.status, 400);
	t.deepEqual(response.body, { errors: { statements: 'Select a file' } });
});   

test('Returns 200 if successfully uploaded statement', async(t) => {
	const response = await request.post('/case-officer/2/statement').attach('statements', pathToFile).attach('statements', pathToFile);
	t.is(response.status, 200);
});

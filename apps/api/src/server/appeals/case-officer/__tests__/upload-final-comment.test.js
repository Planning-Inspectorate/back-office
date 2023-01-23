import test from 'ava';
import path from 'node:path';
import * as url from 'node:url';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);
const dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToFile = path.join(dirname, './assets/simple.pdf');

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			id: 1,
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	],
	typeShorthand: 'FPA'
});

const appeal2 = appealFactoryForTests({
	appealId: 2,
	statuses: [
		{
			id: 2,
			status: 'available_for_final_comments',
			valid: true,
			createdAt: new Date(2022, 1, 1, 9)
		}
	],
	typeShorthand: 'FPA'
});

const inclusions = { appealStatus: { where: { valid: true } }, appealType: true };
const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: inclusions }).returns(appeal1);
findUniqueStub.withArgs({ where: { id: 2 }, include: inclusions }).returns(appeal2);

test.before('sets up database mock', () => {
	sinon.stub(databaseConnector, 'appeal').get(() => {
		return { findUnique: findUniqueStub };
	});
});

test('Throws error if appeal is not accepting final comments', async (t) => {
	const response = await request
		.post('/appeals/case-officer/1/final-comment')
		.attach('finalcomments', pathToFile)
		.attach('finalcomments', pathToFile);

	t.is(response.status, 409);
	t.deepEqual(response.body, { errors: { appeal: 'Appeal is in an invalid state' } });
});

test('Throws error if no file provided', async (t) => {
	const response = await request.post('/appeals/case-officer/1/final-comment');

	t.is(response.status, 400);
	t.deepEqual(response.body, { errors: { finalcomments: 'Select a file' } });
});

test('Returns 200 if successfully uploaded final comment', async (t) => {
	const response = await request
		.post('/appeals/case-officer/2/final-comment')
		.attach('finalcomments', pathToFile)
		.attach('finalcomments', pathToFile);

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		AppealId: 2,
		AppealReference: appeal2.reference,
		canUploadFinalCommentsUntil: '15 February 2022'
	});
});

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
			status: 'available_for_statements',
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

describe('Upload statement', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return { findUnique: findUniqueStub };
		});
	});

	test('Throws error if appeal is not accepting statements', async () => {
		const response = await request
			.post('/appeals/case-officer/1/statement')
			.attach('statements', pathToFile)
			.attach('statements', pathToFile);

		expect(response.status).toEqual(409);
		expect(response.body).toEqual({ errors: { appeal: 'Appeal is in an invalid state' } });
	});

	test('Throws error if no file provided', async () => {
		const response = await request.post('/appeals/case-officer/2/statement');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({ errors: { statements: 'Select a file' } });
	});

	test('Returns 200 if successfully uploaded statement', async () => {
		const response = await request
			.post('/appeals/case-officer/2/statement')
			.attach('statements', pathToFile)
			.attach('statements', pathToFile);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			AppealId: 2,
			AppealReference: appeal2.reference,
			canUploadStatementsUntil: '08 March 2022'
		});
	});
});

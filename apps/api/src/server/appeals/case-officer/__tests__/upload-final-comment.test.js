import path from 'node:path';
import * as url from 'node:url';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

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

describe('Upload final comments', () => {
	test('Throws error if appeal is not accepting final comments', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const response = await request
			.post('/appeals/case-officer/1/final-comment')
			.attach('finalcomments', pathToFile)
			.attach('finalcomments', pathToFile);

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({ errors: { appeal: 'Appeal is in an invalid state' } });
	});

	test('Throws error if no file provided', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const response = await request.post('/appeals/case-officer/1/final-comment');

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({ errors: { finalcomments: 'Select a file' } });
	});

	test('Returns 200 if successfully uploaded final comment', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal2);

		// WHEN
		const response = await request
			.post('/appeals/case-officer/2/final-comment')
			.attach('finalcomments', pathToFile)
			.attach('finalcomments', pathToFile);

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			AppealId: 2,
			AppealReference: appeal2.reference,
			canUploadFinalCommentsUntil: '15 February 2022'
		});
	});
});

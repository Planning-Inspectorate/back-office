import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { appellantCaseInvalidReasons } from '../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('appellant case invalid reasons routes', () => {
	describe('/appeals/appellant-case-invalid-reasons', () => {
		describe('GET', () => {
			test('gets appellant case invalid reasons', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue(
					appellantCaseInvalidReasons
				);

				const response = await request.get('/appeals/appellant-case-invalid-reasons');

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(appellantCaseInvalidReasons);
			});

			test('returns an error if appellant case invalid reasons are not found', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockResolvedValue([]);

				const response = await request.get('/appeals/appellant-case-invalid-reasons');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get appellant case invalid reasons', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseInvalidReason.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request.get('/appeals/appellant-case-invalid-reasons');

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

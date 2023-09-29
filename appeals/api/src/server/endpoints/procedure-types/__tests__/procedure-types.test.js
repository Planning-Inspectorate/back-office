import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, procedureTypes } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('procedure types routes', () => {
	describe('/appeals/procedure-types', () => {
		describe('GET', () => {
			test('gets procedure types', async () => {
				// @ts-ignore
				databaseConnector.procedureType.findMany.mockResolvedValue(procedureTypes);

				const response = await request
					.get('/appeals/procedure-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(procedureTypes);
			});

			test('returns an error if procedure types are not found', async () => {
				// @ts-ignore
				databaseConnector.procedureType.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/procedure-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get procedure types', async () => {
				// @ts-ignore
				databaseConnector.procedureType.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/procedure-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

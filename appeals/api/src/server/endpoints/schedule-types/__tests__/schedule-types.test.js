import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, scheduleTypes } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('schedule types routes', () => {
	describe('/appeals/schedule-types', () => {
		describe('GET', () => {
			test('gets schedule types', async () => {
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockResolvedValue(scheduleTypes);

				const response = await request
					.get('/appeals/schedule-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(scheduleTypes);
			});

			test('returns an error if schedule types are not found', async () => {
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/schedule-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get schedule types', async () => {
				// @ts-ignore
				databaseConnector.scheduleType.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/schedule-types')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

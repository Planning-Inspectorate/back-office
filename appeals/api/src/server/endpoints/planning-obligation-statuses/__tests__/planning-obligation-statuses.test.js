import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, planningObligationStatuses } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('planning obligation statuses routes', () => {
	describe('/appeals/planning-obligation-statuses', () => {
		describe('GET', () => {
			test('gets planning obligation statuses', async () => {
				// @ts-ignore
				databaseConnector.planningObligationStatus.findMany.mockResolvedValue(
					planningObligationStatuses
				);

				const response = await request
					.get('/appeals/planning-obligation-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(planningObligationStatuses);
			});

			test('returns an error if planning obligation statuses are not found', async () => {
				// @ts-ignore
				databaseConnector.planningObligationStatus.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/planning-obligation-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get planning obligation statuses', async () => {
				// @ts-ignore
				databaseConnector.planningObligationStatus.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/planning-obligation-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

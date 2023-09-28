import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, lpaNotificationMethods } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('lpa notification methods routes', () => {
	describe('/appeals/lpa-notification-methods', () => {
		describe('GET', () => {
			test('gets lpa notification methods', async () => {
				// @ts-ignore
				databaseConnector.lPANotificationMethods.findMany.mockResolvedValue(lpaNotificationMethods);

				const response = await request
					.get('/appeals/lpa-notification-methods')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(lpaNotificationMethods);
			});

			test('returns an error if lpa notification methods are not found', async () => {
				// @ts-ignore
				databaseConnector.lPANotificationMethods.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/lpa-notification-methods')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get lpa notification methods', async () => {
				// @ts-ignore
				databaseConnector.lPANotificationMethods.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/lpa-notification-methods')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, knowledgeOfOtherLandowners } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('knowledge of other landowners routes', () => {
	describe('/appeals/knowledge-of-other-landowners', () => {
		describe('GET', () => {
			test('gets knowledge of other landowners', async () => {
				// @ts-ignore
				databaseConnector.knowledgeOfOtherLandowners.findMany.mockResolvedValue(
					knowledgeOfOtherLandowners
				);

				const response = await request
					.get('/appeals/knowledge-of-other-landowners')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(knowledgeOfOtherLandowners);
			});

			test('returns an error if knowledge of other landowners are not found', async () => {
				// @ts-ignore
				databaseConnector.knowledgeOfOtherLandowners.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/knowledge-of-other-landowners')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get knowledge of other landowners', async () => {
				// @ts-ignore
				databaseConnector.knowledgeOfOtherLandowners.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/knowledge-of-other-landowners')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

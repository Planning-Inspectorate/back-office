import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, documentRedactionStatuses } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('document redaction statuses routes', () => {
	describe('/appeals/document-redaction-statuses', () => {
		describe('GET', () => {
			test('gets document redaction statuses', async () => {
				// @ts-ignore
				databaseConnector.documentRedactionStatus.findMany.mockResolvedValue(
					documentRedactionStatuses
				);

				const response = await request
					.get('/appeals/document-redaction-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(documentRedactionStatuses);
			});

			test('returns an error if document redaction statuses are not found', async () => {
				// @ts-ignore
				databaseConnector.documentRedactionStatus.findMany.mockResolvedValue([]);

				const response = await request
					.get('/appeals/document-redaction-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get document redaction statuses', async () => {
				// @ts-ignore
				databaseConnector.documentRedactionStatus.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request
					.get('/appeals/document-redaction-statuses')
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { lpaQuestionnaireIncompleteReasons } from '../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('lpa questionnaire incomplete reasons routes', () => {
	describe('/appeals/lpa-questionnaire-incomplete-reasons', () => {
		describe('GET', () => {
			test('gets lpa questionnaire incomplete reasons', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue(
					lpaQuestionnaireIncompleteReasons
				);

				const response = await request.get('/appeals/lpa-questionnaire-incomplete-reasons');

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(lpaQuestionnaireIncompleteReasons);
			});

			test('returns an error if lpa questionnaire incomplete reasons are not found', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockResolvedValue([]);

				const response = await request.get('/appeals/lpa-questionnaire-incomplete-reasons');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get lpa questionnaire incomplete reasons', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireIncompleteReason.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request.get('/appeals/lpa-questionnaire-incomplete-reasons');

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

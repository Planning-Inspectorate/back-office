import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { lpaQuestionnaireValidationOutcomes } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('lpa questionnaire validation outcomes routes', () => {
	describe('/appeals/lpa-questionnaire-validation-outcomes', () => {
		describe('GET', () => {
			test('gets lpa questionnaire validation outcomes', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findMany.mockResolvedValue(
					lpaQuestionnaireValidationOutcomes
				);

				const response = await request.get('/appeals/lpa-questionnaire-validation-outcomes');

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(lpaQuestionnaireValidationOutcomes);
			});

			test('returns an error if lpa questionnaire validation outcomes are not found', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findMany.mockResolvedValue([]);

				const response = await request.get('/appeals/lpa-questionnaire-validation-outcomes');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get lpa questionnaire validation outcomes', async () => {
				// @ts-ignore
				databaseConnector.lPAQuestionnaireValidationOutcome.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request.get('/appeals/lpa-questionnaire-validation-outcomes');

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

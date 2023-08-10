import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { appellantCaseValidationOutcomes } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('appellant case validation outcomes routes', () => {
	describe('/appeals/appellant-case-validation-outcomes', () => {
		describe('GET', () => {
			test('gets appellant case validation outcomes', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findMany.mockResolvedValue(
					appellantCaseValidationOutcomes
				);

				const response = await request.get('/appeals/appellant-case-validation-outcomes');

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(appellantCaseValidationOutcomes);
			});

			test('returns an error if appellant case validation outcomes are not found', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findMany.mockResolvedValue([]);

				const response = await request.get('/appeals/appellant-case-validation-outcomes');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get appellant case validation outcomes', async () => {
				// @ts-ignore
				databaseConnector.appellantCaseValidationOutcome.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request.get('/appeals/appellant-case-validation-outcomes');

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

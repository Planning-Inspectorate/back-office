import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { siteVisitTypes } from '../../../tests/data.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('site visit types routes', () => {
	describe('/appeals/site-visit-types', () => {
		describe('GET', () => {
			test('gets site visit types', async () => {
				// @ts-ignore
				databaseConnector.siteVisitType.findMany.mockResolvedValue(siteVisitTypes);

				const response = await request.get('/appeals/site-visit-types');

				expect(response.status).toEqual(200);
				expect(response.body).toEqual(siteVisitTypes);
			});

			test('returns an error if site visit types are not found', async () => {
				// @ts-ignore
				databaseConnector.siteVisitType.findMany.mockResolvedValue([]);

				const response = await request.get('/appeals/site-visit-types');

				expect(response.status).toEqual(404);
				expect(response.body).toEqual({ errors: ERROR_NOT_FOUND });
			});

			test('returns an error if unable to get site visit types', async () => {
				// @ts-ignore
				databaseConnector.siteVisitType.findMany.mockImplementation(() => {
					throw new Error(ERROR_FAILED_TO_GET_DATA);
				});

				const response = await request.get('/appeals/site-visit-types');

				expect(response.status).toEqual(500);
				expect(response.body).toEqual({ errors: ERROR_FAILED_TO_GET_DATA });
			});
		});
	});
});

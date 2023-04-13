import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { default: got } = await import('got');

const request = supertest(app);

const fakeGet = {
	body: {
		features: [
			{
				attributes: {
					LPA21NM: 'first LPA'
				}
			},
			{
				attributes: {
					LPA21NM: 'second LPA'
				}
			}
		]
	}
};

describe('Get LPA list', () => {
	test('gets all LPAs from external API', async () => {
		// GIVEN
		got.get.mockResolvedValue(fakeGet);

		// WHEN
		const resp = await request.get('/appeals/validation/lpa-list');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual(['first LPA', 'second LPA']);
	});

	test('returns 500 if unable to get list of LPAs', async () => {
		// GIVEN
		got.get.mockRejectedValue(new Error('Unable to get data'));

		// WHEN
		const resp = await request.get('/appeals/validation/lpa-list');

		// THEN
		expect(resp.status).toEqual(500);
		expect(resp.body).toEqual({ errors: 'Unable to get data' });
	});
});

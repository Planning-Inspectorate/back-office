import { request } from '../../../app-test.js';

describe('business day validation routes', () => {
	describe('/appeals/validate-business-date', () => {
		describe('POST', () => {
			test('valid business day', async () => {
				const payload = {
					inputDate: '2023-12-20'
				};

				const response = await request.post('/appeals/validate-business-date').send(payload);

				expect(response.status).toEqual(200);
			});

			test('invalid business day', async () => {
				const payload = {
					inputDate: '2023-12-25'
				};

				const response = await request.post('/appeals/validate-business-date').send(payload);

				expect(response.status).toEqual(400);
			});
		});
	});
});

import supertest from 'supertest';
import { app } from '../../../app.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const region = {
	id: 1,
	name: 'test',
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

describe('Get regions', () => {
	test('gets all regions', async () => {
		// GIVEN
		databaseConnector.region.findMany.mockResolvedValue([region]);

		// WHEN
		const resp = await request.get('/applications/region');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([
			{
				id: region.id,
				name: region.name,
				displayNameEn: region.displayNameEn,
				displayNameCy: region.displayNameCy
			}
		]);
	});
});

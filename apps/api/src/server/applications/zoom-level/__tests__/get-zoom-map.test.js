import supertest from 'supertest';
import { app } from '../../../app.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const mapZoomLevels = {
	id: 1,
	name: 'test',
	displayOrder: 1,
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

describe('Get zoom map', () => {
	test('gets all map zoom levels', async () => {
		// GIVEN
		databaseConnector.zoomLevel.findMany.mockResolvedValue([mapZoomLevels]);

		// WHEN
		const resp = await request.get('/applications/zoom-level');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([
			{
				id: mapZoomLevels.id,
				name: mapZoomLevels.name,
				displayOrder: mapZoomLevels.displayOrder,
				displayNameEn: mapZoomLevels.displayNameEn,
				displayNameCy: mapZoomLevels.displayNameCy
			}
		]);
	});
});

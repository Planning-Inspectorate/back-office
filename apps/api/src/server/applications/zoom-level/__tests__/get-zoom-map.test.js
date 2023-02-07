import supertest from 'supertest';
import { app } from '../../../app.js';
import { nodeCache, setCache } from '../../../utils/cache-data.js';

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

test('tests if cache is working', async () => {
	nodeCache.flushAll();

	const cachedMapZoomLevels = {
		id: 2,
		name: 'cached test',
		displayOrder: 1,
		displayNameEn: 'cached test name en',
		displayNameCy: 'cached test name cy'
	};

	setCache('zoom-level', [cachedMapZoomLevels]);

	const resp = await request.get('/applications/zoom-level');

	expect(resp.status).toEqual(200);
	expect(resp.body).toEqual([
		{
			id: cachedMapZoomLevels.id,
			name: cachedMapZoomLevels.name,
			displayOrder: cachedMapZoomLevels.displayOrder,
			displayNameEn: cachedMapZoomLevels.displayNameEn,
			displayNameCy: cachedMapZoomLevels.displayNameCy
		}
	]);
});

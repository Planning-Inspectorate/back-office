import supertest from 'supertest';
import { app } from '../../../app.js';
import { nodeCache, setCache } from '../../../utils/cache-data.js';

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

test('checks cache working for regions', async () => {
	nodeCache.flushAll();

	const cachedRegion = {
		id: 1,
		name: 'cached test',
		displayNameEn: 'cached test name en',
		displayNameCy: 'cached test name cy'
	};

	setCache('regions', [cachedRegion]);

	const resp = await request.get('/applications/region');

	expect(resp.status).toEqual(200);
	expect(resp.body).toEqual([
		{
			id: cachedRegion.id,
			name: cachedRegion.name,
			displayNameEn: cachedRegion.displayNameEn,
			displayNameCy: cachedRegion.displayNameCy
		}
	]);
});

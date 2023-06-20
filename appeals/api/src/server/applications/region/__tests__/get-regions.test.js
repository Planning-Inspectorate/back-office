import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
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
	beforeEach(() => {
		nodeCache.flushAll();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

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

test('tests if cached data for region call is returned without hitting db', async () => {
	const cachedRegion = {
		id: 1,
		name: 'cached test',
		displayNameEn: 'cached test name en',
		displayNameCy: 'cached test name cy'
	};

	setCache('regions', [cachedRegion]);

	const resp = await request.get('/applications/region');

	expect(databaseConnector.region.findMany).not.toHaveBeenCalled();
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

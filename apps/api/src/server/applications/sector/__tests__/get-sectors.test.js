import supertest from 'supertest';
import { app } from '../../../app.js';
import { nodeCache, setCache } from '../../../utils/cache-data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

/**
 * @type {import('@pins/api').Schema.Sector}
 */
const sector = {
	id: 1,
	name: 'test name',
	abbreviation: 'AA',
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

const unknownSectorName = 'some-unknown-sector';

/**
 * @type {import('@pins/api').Schema.SubSector}
 */
const subSector = {
	id: 2,
	name: 'test subSector name',
	abbreviation: 'BB',
	displayNameEn: 'test subsector name en',
	displayNameCy: 'test subsector name cy',
	sector,
	sectorId: 0
};

describe('Get sectors', () => {
	test('gets all sectors', async () => {
		// GIVEN
		databaseConnector.sector.findMany.mockResolvedValue([sector]);

		// WHEN
		const response = await request.get('/applications/sector');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				name: sector.name,
				abbreviation: sector.abbreviation,
				displayNameEn: sector.displayNameEn,
				displayNameCy: sector.displayNameCy
			}
		]);
	});

	test('gets all sub-sectors associated with existing sector', async () => {
		// GIVEN
		databaseConnector.subSector.findMany.mockResolvedValue([subSector]);

		// WHEN
		const response = await request
			.get('/applications/sector')
			.query({ sectorName: subSector.sector.name });

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				name: subSector.name,
				abbreviation: subSector.abbreviation,
				displayNameEn: subSector.displayNameEn,
				displayNameCy: subSector.displayNameCy
			}
		]);
	});

	test('fails to get any subsectors when an unknown sector name is provided', async () => {
		// GIVEN
		databaseConnector.sector.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.get('/applications/sector')
			.query({ sectorName: unknownSectorName });


		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				sectorName: 'Sector name not recognised'
			}
		});
	});
});

test('test if cache is working', async () => {
	nodeCache.flushAll();

	const cacheSector = {
		id: 3,
		name: 'cache test name',
		abbreviation: 'CC',
		displayNameEn: 'cache test name en',
		displayNameCy: 'cache test name cy'
	};

	setCache('', [cacheSector]);

	const response = await request.get('/applications/sector');

	expect(response.status).toEqual(200);
	expect(response.body).toEqual([
		{
			name: cacheSector.name,
			abbreviation: cacheSector.abbreviation,
			displayNameEn: cacheSector.displayNameEn,
			displayNameCy: cacheSector.displayNameCy
		}
	]);
});

test('test if cache is working with specific string', async () => {
	nodeCache.flushAll();

	const cacheSector = {
		id: 3,
		name: 'cache test name',
		abbreviation: 'CC',
		displayNameEn: 'cache test name en',
		displayNameCy: 'cache test name cy'
	};

	setCache('Test1', [cacheSector]);

	const response = await request.get('/applications/sector').query({ sectorName: 'Test1' });

	expect(response.status).toEqual(200);
	expect(response.body).toEqual([
		{
			name: cacheSector.name,
			abbreviation: cacheSector.abbreviation,
			displayNameEn: cacheSector.displayNameEn,
			displayNameCy: cacheSector.displayNameCy
		}
	]);
});

test('test if cache is working with specific string', async () => {
	nodeCache.flushAll();

	const cacheSector = {
		id: 3,
		name: 'cache test name',
		abbreviation: 'CC',
		displayNameEn: 'cache test name en',
		displayNameCy: 'cache test name cy'
	};

	setCache('Test1', [cacheSector]);

	const response = await request.get('/applications/sector').query({ sectorName: 'Test1' });

	expect(response.status).toEqual(200);
	expect(response.body).toEqual([
		{
			name: cacheSector.name,
			abbreviation: cacheSector.abbreviation,
			displayNameEn: cacheSector.displayNameEn,
			displayNameCy: cacheSector.displayNameCy
		}
	]);
});

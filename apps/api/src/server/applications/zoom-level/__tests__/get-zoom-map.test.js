import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const mapZoomLevels = {
	id: 1,
	name: 'test',
	displayOrder: 1,
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

describe('Get zoom map', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'zoomLevel').get(() => {
			return { findMany: sinon.stub().returns([mapZoomLevels]) };
		});
	});

	test('gets all map zoom levels', async () => {
		const resp = await request.get('/applications/zoom-level');

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

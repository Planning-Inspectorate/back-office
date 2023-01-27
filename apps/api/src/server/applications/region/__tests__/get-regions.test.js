import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const region = {
	id: 1,
	name: 'test',
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

describe('Get regions', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'region').get(() => {
			return { findMany: sinon.stub().returns([region]) };
		});
	});

	test('gets all regions', async () => {
		const resp = await request.get('/applications/region');

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

import test from 'ava';
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

test.before('set up mocking', () => {
	sinon.stub(databaseConnector, 'region').get(() => {
		return { findMany: sinon.stub().returns([region]) };
	});
});

test('gets all regions', async (t) => {
	const resp = await request.get('/applications/region');

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			id: region.id,
			name: region.name,
			displayNameEn: region.displayNameEn,
			displayNameCy: region.displayNameCy
		}
	]);
});

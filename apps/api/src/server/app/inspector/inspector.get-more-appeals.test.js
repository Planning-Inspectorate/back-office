// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const appeal_25 = {
	id: 25,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'available_for_inspector_pickup',
	address: {
		addressLine1: '56 Vincent Square',
		county: 'London',
		postCode: 'SW1P 2NE'
	},
	appealAge: 22,
	siteVisitType: 'accompanied',
	appealType: 'HAS',
	specialism: 'General',
	siteVisit: {}
};


const findManyStub = sinon.stub().returns([appeal_25]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: findManyStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('gets all appeals yet to be assigned to inspector', async (t) => {
	const resp = await request.get('/inspector/more-appeals');
	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			id: 25,
			reference: 'APP/Q9999/D/21/5463281',
			status: 'available_for_inspector_pickup',
			address: {
				addressLine1: '56 Vincent Square',
				county: 'London',
				postCode: 'SW1P 2NE'
			},
			appealAge: 22,
			siteVisit: {},
			siteVisitType: 'accompanied',
			appealType: 'HAS',
			specialism: 'General'
		}
	]);

	sinon.assert.calledWith(findManyStub, {
		where: {
			status: {
				in: [
					'available_for_inspector_pickup'
				]
			}
		}
	});
});

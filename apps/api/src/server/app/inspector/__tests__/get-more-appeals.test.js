import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);

const appeal_25 = {
	id: 25,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus:[{
		status: 'available_for_inspector_pickup'
	}],
	address: {
		addressLine1: '56 Vincent Square',
		county: 'London',
		postCode: 'SW1P 2NE'
	},
	startedAt: new Date(2022, 2, 3),
	appealType: 'HAS',
	specialism: 'General',
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true }
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

	sinon.useFakeTimers({ now: 1_649_319_144_000 });

	const resp = await request.get('/inspector/more-appeals');

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			appealId: 25,
			reference: 'APP/Q9999/D/21/5463281',
			address: {
				addressLine1: '56 Vincent Square',
				county: 'London',
				postCode: 'SW1P 2NE'
			},
			appealAge: 35,
			appealType: 'HAS',
			specialist: 'General',
			provisionalVisitType:'unaccompanied'
		}
	]);
	sinon.assert.calledWith(findManyStub, {
		where: {
			appealStatus: {
				some: {
					status: {
						in: ['available_for_inspector_pickup']
					},
					valid: true
				}
			}
		},
		include: {
			address: true,
			appellant: false,
			lpaQuestionnaire: true,
			appealDetailsFromAppellant: true,
			appealStatus: {
				where: {
					valid: true
				}
			}
		}
	});

});

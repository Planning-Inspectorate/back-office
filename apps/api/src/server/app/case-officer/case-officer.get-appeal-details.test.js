// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();
findUniqueStub.withArgs({ where: { id: 1 } }).returns({
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'received_lpa_questionnaire',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton',
	startedAt: new Date(2022, 4, 18)
});
findUniqueStub.withArgs({ where: { id: 2 } }).returns({
	id: 2,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'awaiting_lpa_questionnaire'
});

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('gets the appeals detailed information with received questionnaires', async (t) => {
	const resp = await request.get('/case-officer/1');
	const appealExampleDetail = {
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		LocalPlanningDepartment:'Maidstone Borough Council',
		PlanningApplicationreference:'48269/APP/2021/1482',
		AppealSiteNearConservationArea: false,
		WouldDevelopmentAffectSettingOfListedBuilding: false,
		ListedBuildingDesc: ''
	};

	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExampleDetail);
});

test('unable to retrieve details for an appeal which has yet to receive the questionnaire', async (t) => {
	const resp = await request.get('/case-officer/2');
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal has yet to receive LPA questionnaire' });
});

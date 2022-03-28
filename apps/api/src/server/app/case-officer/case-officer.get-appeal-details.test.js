// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
// import sinon from 'sinon';
import { app } from '../../app.js';
// import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

test('gets the appeals detailed information with received questionnaires', async (t) => {
	const resp = await request.get('/case-officer/id:');
	const appealExampleDetail = {
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		LocalPlanningDepartment:'Maidstone Borough Council',
		PlanningApplicationreference:'48269/APP/2021/1482',
		AppealSiteNearConservationArea: false,
		WouldDevelopmentAffectSettingOfListedBuilding: false,
		ListedBuildingDesc: '' // Optional
	};

	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExampleDetail);
});

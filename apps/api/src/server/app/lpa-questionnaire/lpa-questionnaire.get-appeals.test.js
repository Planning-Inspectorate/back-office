import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';
const request = supertest(app);

test('gets the appeals information with received questionnaires', async (t) => {
	const resp = await request.get('/case-officer');
	const appealExample = [{
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		QuestionnaireDueDate:'01 Jun 2022',
		AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
		QuestionnaireStatus: 'received'
	},
	{
		AppealId : 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		QuestionnaireDueDate: ' 05 Jun 2022',
		AppealSite:'55 Butcher Street, Thurnscoe, S63 0RB' ,
		QuestionnaireStatus: 'incomplete'
	}];

	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExample);
});

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


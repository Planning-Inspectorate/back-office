// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const getAddressByIdStub = sinon.stub();
getAddressByIdStub.withArgs({ where: { id: 1 } }).returns({
	id: 1,
	addressLine1: '96 The Avenue',
	addressLine2: 'Maidstone',
	postcode: 'MD21 5XY',
	city: 'Kent'
});
getAddressByIdStub.withArgs({ where: { id: 2 } }).returns({
	id: 2,
	addressLine1: '55 Butcher Street',
	postcode: 'S63 0RB',
	city: 'Thurnscoe'
});

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'awaiting_lpa_questionnaire',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton',
	startedAt: new Date(2022, 4, 18)
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'received_lpa_questionnaire',
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22)
};
const appeal_3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'overdue_lpa_questionnaire',
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22)
};

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([appeal_1, appeal_2, appeal_3]),
			},
			address: {
				findUnique: getAddressByIdStub
			}
		};
	}
}

test('gets the appeals information with received questionnaires', async (t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
	const resp = await request.get('/case-officer');
	const appealExample = [{
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		QuestionnaireDueDate:'01 Jun 2022',
		AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
		QuestionnaireStatus: 'awaiting'
	},
	{
		AppealId : 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		QuestionnaireDueDate: '05 Jun 2022',
		AppealSite:'55 Butcher Street, Thurnscoe, S63 0RB',
		QuestionnaireStatus: 'received'
	},
	{
		AppealId: 3,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealSite: '55 Butcher Street, Thurnscoe, S63 0RB',
		QuestionnaireDueDate: '05 Jun 2022',
		QuestionnaireStatus: 'overdue',
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


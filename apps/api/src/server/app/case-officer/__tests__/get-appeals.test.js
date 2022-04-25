// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [{
		status: 'awaiting_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	},
	startedAt: new Date(2022, 4, 18),
	address: {
		addressLine1: '96 The Avenue',
		addressLine2: 'Maidstone',
		postcode: 'MD21 5XY',
		county: 'Kent'
	}
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [{
		status: 'received_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22),
	address: {
		addressLine1: '55 Butcher Street',
		postcode: 'S63 0RB',
		town: 'Thurnscoe'
	}
};
const appeal_3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [{
		status: 'overdue_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22),
	address: {
		addressLine1: '55 Butcher Street',
		postcode: 'S63 0RB',
		town: 'Thurnscoe'
	}
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q8874/D/23/4293472',
	appealStatus: [{
		status: 'incomplete_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2021, 12, 12),
	addressId: 4,
	startedAt: new Date(2022, 3, 20),
	address: {
		addressLine1: '180 Bloomfield Road',
		postcode: 'BS4 3QX',
		town: 'Bristol'
	},
};

const findManyStub = sinon.stub();
findManyStub.returns([appeal_1, appeal_2, appeal_3, appeal_4]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: findManyStub
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
		QuestionnaireDueDate: '01 Jun 2022',
		AppealSite: {
			AddressLine1: '96 The Avenue',
			AddressLine2: 'Maidstone',
			County: 'Kent',
			PostCode: 'MD21 5XY'
		},
		QuestionnaireStatus: 'awaiting'
	},
	{
		AppealId : 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		QuestionnaireDueDate: '05 Jun 2022',
		AppealSite: {
			AddressLine1: '55 Butcher Street',
			Town: 'Thurnscoe',
			PostCode: 'S63 0RB'
		},
		QuestionnaireStatus: 'received'
	},
	{
		AppealId: 3,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealSite: {
			AddressLine1: '55 Butcher Street',
			Town: 'Thurnscoe',
			PostCode: 'S63 0RB'
		},
		QuestionnaireDueDate: '05 Jun 2022',
		QuestionnaireStatus: 'overdue',
	},
	{
		AppealId: 4,
		AppealReference: 'APP/Q8874/D/23/4293472',
		AppealSite: {
			AddressLine1: '180 Bloomfield Road',
			Town: 'Bristol',
			PostCode: 'BS4 3QX'
		},
		QuestionnaireDueDate: '04 May 2022',
		QuestionnaireStatus: 'incomplete_lpa_questionnaire',
	}];
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExample);
});


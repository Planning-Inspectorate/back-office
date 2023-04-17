import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		}
	],
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
const appeal2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'received_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22),
	address: {
		addressLine1: '55 Butcher Street',
		postcode: 'S63 0RB',
		town: 'Thurnscoe'
	}
};
const appeal3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'overdue_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	startedAt: new Date(2022, 4, 22),
	address: {
		addressLine1: '55 Butcher Street',
		postcode: 'S63 0RB',
		town: 'Thurnscoe'
	}
};
const appeal4 = {
	id: 4,
	reference: 'APP/Q8874/D/23/4293472',
	appealStatus: [
		{
			status: 'incomplete_lpa_questionnaire',
			valid: true
		}
	],
	createdAt: new Date(2021, 12, 12),
	addressId: 4,
	startedAt: new Date(2022, 3, 20),
	address: {
		addressLine1: '180 Bloomfield Road',
		postcode: 'BS4 3QX',
		town: 'Bristol'
	}
};

const appeal5 = {
	id: 5,
	reference: 'APP/Q8874/D/23/1233427',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		},
		{
			status: 'available_for_statements',
			valid: true
		}
	],
	createdAt: new Date(2021, 12, 2),
	addressId: 4,
	startedAt: new Date(2022, 3, 2),
	address: {
		addressLine1: '30 Nowhere Road',
		postcode: 'B36 TH2',
		town: 'Brighton'
	}
};

const appeal6 = {
	id: 6,
	reference: 'APP/Q8874/D/23/7654321',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		},
		{
			status: 'available_for_final_comments',
			valid: true
		}
	],
	createdAt: new Date(2021, 12, 2),
	addressId: 4,
	startedAt: new Date(2022, 3, 2),
	address: {
		addressLine1: '31 Somewhere Road',
		postcode: 'BN20 7AU',
		town: 'Eastbourne'
	}
};

describe('Get Appeals', () => {
	test('gets the appeals information with received questionnaires', async () => {
		// GIVEN
		databaseConnector.appeal.findMany
			.mockResolvedValueOnce([appeal1, appeal2, appeal3, appeal4, appeal5, appeal6])
			.mockResolvedValueOnce([appeal5, appeal6]);

		// WHEN
		const resp = await request.get('/appeals/case-officer');

		// THEN
		const appealExample = [
			{
				AppealId: 1,
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
				AppealId: 2,
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
				QuestionnaireStatus: 'overdue'
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
				QuestionnaireStatus: 'incomplete_lpa_questionnaire'
			},
			{
				AppealId: 5,
				AppealReference: 'APP/Q8874/D/23/1233427',
				AppealSite: {
					AddressLine1: '30 Nowhere Road',
					PostCode: 'B36 TH2',
					Town: 'Brighton'
				},
				QuestionnaireDueDate: '16 Apr 2022',
				QuestionnaireStatus: 'awaiting'
			},
			{
				AppealId: 6,
				AppealReference: 'APP/Q8874/D/23/7654321',
				AppealSite: {
					AddressLine1: '31 Somewhere Road',
					PostCode: 'BN20 7AU',
					Town: 'Eastbourne'
				},
				QuestionnaireDueDate: '16 Apr 2022',
				QuestionnaireStatus: 'awaiting'
			},
			{
				AppealId: 5,
				AppealReference: 'APP/Q8874/D/23/1233427',
				AppealSite: {
					AddressLine1: '30 Nowhere Road',
					PostCode: 'B36 TH2',
					Town: 'Brighton'
				},
				QuestionnaireDueDate: '16 Apr 2022',
				StatementsAndFinalCommentsStatus: 'available_for_statements'
			},
			{
				AppealId: 6,
				AppealReference: 'APP/Q8874/D/23/7654321',
				AppealSite: {
					AddressLine1: '31 Somewhere Road',
					PostCode: 'BN20 7AU',
					Town: 'Eastbourne'
				},
				QuestionnaireDueDate: '16 Apr 2022',
				StatementsAndFinalCommentsStatus: 'available_for_final_comments'
			}
		];

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual(appealExample);
	});
});

// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();
findUniqueStub
	.withArgs({
		where: { id: 1 },
		include: {
			address: true,
			appellant: true,
			reviewQuestionnaire: {
				take: 1,
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	})
	.returns({
		id: 1,
		reference: 'APP/Q9999/D/21/1345264',
		status: 'received_lpa_questionnaire',
		createdAt: new Date(2022, 1, 23),
		addressId: 1,
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		appellant: {
			name: 'Lee Thornton'
		},
		startedAt: new Date(2022, 4, 18),
		address: {
			addressLine1: 'line 1',
			addressLine2: 'line 2',
			postcode: 'some code'
		}
	});

findUniqueStub
	.withArgs({
		where: { id: 2 },
		include: {
			address: true,
			appellant: true,
			reviewQuestionnaire: {
				take: 1,
				orderBy: {
					createdAt: 'desc'
				}
			}
		}
	})
	.returns({
		id: 2,
		reference: 'APP/Q9999/D/21/1345264',
		status: 'awaiting_lpa_questionnaire'
	});

const listOfDocuments = [
	{
		Type: 'planning application form',
		Filename: 'planning-application.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'decision letter',
		Filename: 'decision-letter.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'appeal statement',
		Filename: 'appeal-statement.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'planning officers report',
		Filename: 'planning-officers-report.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'plans used to reach decision',
		Filename: 'plans-used-to-reach-decision.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'conservation area guidance',
		Filename: 'conservation-area-plan.pdf',
		URL: 'localhost:8080'
	}
];

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
		AppealId: 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		LocalPlanningDepartment: 'Maidstone Borough Council',
		PlanningApplicationreference: '48269/APP/2021/1482',
		AppealSite: {
			AddressLine1: 'line 1',
			AddressLine2: 'line 2',
			PostCode: 'some code'
		},
		AppealSiteNearConservationArea: false,
		WouldDevelopmentAffectSettingOfListedBuilding: false,
		ListedBuildingDesc: '',
		Documents: listOfDocuments
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealExampleDetail);
});

test('unable to retrieve details for an appeal which has yet to receive the questionnaire', async (t) => {
	const resp = await request.get('/case-officer/2');
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal has yet to receive LPA questionnaire' });
});

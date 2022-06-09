import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';

const request = supertest(app);

const appeal1 = appealFactoryForTests({
	appealId: 1,
	statuses: [
		{
			status: 'received_lpa_questionnaire',
			valid: true
		}
	],
	typeShorthand: 'HAS',
	inclusions: { lpaQuestionnaire: true }
});

const appeal2 = appealFactoryForTests({
	appealId: 2,
	statuses: [
		{
			status: 'awaiting_lpa_questionnaire',
			valid: true
		}
	],
	typeShorthand: 'HAS'
});

const includeDetails = {
	address: true,
	appealType: true,
	appellant: true,
	appealStatus: {
		where: {
			valid: true
		}
	},
	lpaQuestionnaire: true,
	reviewQuestionnaire: {
		take: 1,
		orderBy: {
			createdAt: 'desc'
		}
	}
};

const includingDetailsForValidtion = {
	appealStatus: { where: { valid: true } },
	appealType: true
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: includeDetails }).returns(appeal1);
findUniqueStub.withArgs({ where: { id: 2 }, include: includeDetails }).returns(appeal2);
findUniqueStub
	.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion })
	.returns(appeal1);
findUniqueStub
	.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion })
	.returns(appeal2);

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
	constructor() {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	// @ts-ignore
	sinon
		.stub(DatabaseFactory, 'getInstance')
		.callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('gets the appeals detailed information with received questionnaires', async (t) => {
	const resp = await request.get('/case-officer/1');
	const appealExampleDetail = {
		AppealId: 1,
		AppealReference: appeal1.reference,
		LocalPlanningDepartment: appeal1.localPlanningDepartment,
		PlanningApplicationreference: appeal1.planningApplicationReference,
		AppealSite: {
			...(appeal1.address.addressLine1 && { AddressLine1: appeal1.address.addressLine1 }),
			...(appeal1.address.addressLine2 && { AddressLine2: appeal1.address.addressLine2 }),
			...(appeal1.address.town && { Town: appeal1.address.town }),
			...(appeal1.address.county && { County: appeal1.address.county }),
			PostCode: appeal1.address.postcode
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

	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			appeal: 'Appeal is in an invalid state'
		}
	});
});

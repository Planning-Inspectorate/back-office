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
		status: 'received_appeal',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	},
	validationDecision: [],
	address: {
		addressLine1: 'line 1',
		addressLine2: 'line 2',
		town: 'town',
		county: 'county',
		postcode: 'post code'
	}
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/1224115',
	appellant: {
		name: 'Kevin Fowler'
	},
	localPlanningDepartment: 'Waveney District Council',
	planningApplicationReference: '18543/APP/2021/6627',
	appealStatus: [{
		status: 'awaiting_validation_info',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 2,
	validationDecision: [
		{
			id: 1,
			appealId: 2,
			decision: 'incomplete',
			namesDoNotMatch: true,
			sensitiveInfo: true,
			missingApplicationForm: true,
			missingDecisionNotice: true,
			missingGroundsForAppeal: true,
			missingSupportingDocuments: true,
			inflammatoryComments: true,
			openedInError: true,
			wrongAppealTypeUsed: true,
			otherReasons: 'Some other weird reason'
		}
	],
	address: {
		addressLine1: '1 Grove Cottage',
		addressLine2: 'Shotesham Road',
		town: 'Woodton',
		postcode: 'NR35 2ND'
	}
};
const appeal_3 = {
	id: 3,
	appealStatus: [{
		status: 'invalid',
		valid: true
	}]
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/1224115',
	appellant: {
		name: 'Kevin Fowler'
	},
	localPlanningDepartment: 'Waveney District Council',
	planningApplicationReference: '18543/APP/2021/6627',
	appealStatus: [{
		status: 'awaiting_validation_info',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 2,
	validationDecision: [
		{
			id: 1,
			appealId: 4,
			decision: 'incomplete',
			namesDoNotMatch: false,
			sensitiveInfo: false,
			missingApplicationForm: false,
			missingDecisionNotice: false,
			missingGroundsForAppeal: false,
			missingSupportingDocuments: false,
			inflammatoryComments: true,
			openedInError: false,
			wrongAppealTypeUsed: false,
			otherReasons: undefined
		}
	],
	address: {
		addressLine1: '1 Grove Cottage',
		addressLine2: 'Shotesham Road',
		town: 'Woodton',
		postcode: 'NR35 2ND'
	}
};
const getAppealByIdStub = sinon.stub();
const includingDetailsForResponse = { 
	validationDecision: true, 
	address: true, 
	appellant: true, 
	appealStatus: { where: { valid: true } },
	appealType: true
};
const includingDetailsForValidtion = {
	appealStatus: { where: { valid: true } },
	appealType: true
};
getAppealByIdStub.withArgs({ where: { id: 1 }, include: includingDetailsForResponse }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 2 }, include: includingDetailsForResponse }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 3 }, include: includingDetailsForValidtion }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 4 }, include: includingDetailsForResponse }).returns(appeal_4);
getAppealByIdStub.withArgs({ where: { id: 4 }, include: includingDetailsForValidtion }).returns(appeal_4);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub
			}
		};
	}
}

const documentsArray = [
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
	}
];

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('gets appeal that requires validation', async (t) => {
	const resp = await request.get('/validation/1');
	const appealReviewInfo = {
		AppealId: 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppellantName: 'Lee Thornton',
		AppealStatus: 'new',
		Received: '23 Feb 2022',
		AppealSite: {
			AddressLine1: 'line 1',
			AddressLine2: 'line 2',
			Town: 'town',
			County: 'county',
			PostCode: 'post code'
		},
		LocalPlanningDepartment: 'Maidstone Borough Council',
		PlanningApplicationReference: '48269/APP/2021/1482',
		Documents: documentsArray
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});

test('throws 409 when appeal does not require validation', async (t) => {
	const resp = await request.get('/validation/3');
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			appeal: 'Appeal is in an invalid state',
		}
	});
});

test('returns appeal with all reasons why it is in \'incomplete\' state', async (t) => {
	const resp = await request.get('/validation/2');
	const appealReviewInfo = {
		AppealId: 2,
		AppealReference: 'APP/Q9999/D/21/1224115',
		AppellantName: 'Kevin Fowler',
		AppealStatus: 'incomplete',
		Received: '23 Feb 2022',
		AppealSite: {
			AddressLine1: '1 Grove Cottage',
			AddressLine2: 'Shotesham Road',
			Town: 'Woodton',
			PostCode: 'NR35 2ND'
		},
		LocalPlanningDepartment: 'Waveney District Council',
		PlanningApplicationReference: '18543/APP/2021/6627',
		Documents: documentsArray,
		reasons: {
			inflammatoryComments: true,
			missingApplicationForm: true,
			missingDecisionNotice: true,
			missingGroundsForAppeal: true,
			missingSupportingDocuments: true,
			namesDoNotMatch: true,
			openedInError: true,
			otherReasons: 'Some other weird reason',
			sensitiveInfo: true,
			wrongAppealTypeUsed: true,
		}
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});


test('returns appeal with one reason why it is in \'incomplete\' state', async (t) => {
	const resp = await request.get('/validation/4');
	const appealReviewInfo = {
		AppealId: 4,
		AppealReference: 'APP/Q9999/D/21/1224115',
		AppellantName: 'Kevin Fowler',
		AppealStatus: 'incomplete',
		Received: '23 Feb 2022',
		AppealSite: {
			AddressLine1: '1 Grove Cottage',
			AddressLine2: 'Shotesham Road',
			Town: 'Woodton',
			PostCode: 'NR35 2ND'
		},
		LocalPlanningDepartment: 'Waveney District Council',
		PlanningApplicationReference: '18543/APP/2021/6627',
		Documents: documentsArray,
		reasons: {
			inflammatoryComments: true
		}
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});

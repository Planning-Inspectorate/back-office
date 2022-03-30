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
	addressLine1: '1 Grove Cottage',
	addressLine2: 'Shotesham Road',
	city: 'Woodton',
	postcode: 'NR35 2ND'
});

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'received_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton',
	ValidationDecision: []
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/1224115',
	appellantName: 'Kevin Fowler',
	localPlanningDepartment: 'Waveney District Council',
	planningApplicationReference: '18543/APP/2021/6627',
	status: 'awaiting_validation_info',
	createdAt: new Date(2022, 1, 23),
	addressId: 2,
	ValidationDecision: [
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
			inflamatoryComments: true,
			openedInError: true,
			wrongAppealTypeUsed: true,
			otherReasons: 'Some other weird reason'
		}
	]
};
const appeal_3 = {
	id: 3,
	status: 'invalid'
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/1224115',
	appellantName: 'Kevin Fowler',
	localPlanningDepartment: 'Waveney District Council',
	planningApplicationReference: '18543/APP/2021/6627',
	status: 'awaiting_validation_info',
	createdAt: new Date(2022, 1, 23),
	addressId: 2,
	ValidationDecision: [
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
			inflamatoryComments: true,
			openedInError: false,
			wrongAppealTypeUsed: false,
			otherReasons: undefined
		}
	]
};
const getAppealByIdStub = sinon.stub();
getAppealByIdStub.withArgs({ where: { id: 1 }, include: { ValidationDecision: true } }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 2 }, include: { ValidationDecision: true } }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 3 }, include: { ValidationDecision: true } }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 4 }, include: { ValidationDecision: true } }).returns(appeal_4);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub
			},
			address: {
				findUnique: getAddressByIdStub
			}
		};
	}
}

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
		AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY',
		LocalPlanningDepartment: 'Maidstone Borough Council',
		PlanningApplicationReference: '48269/APP/2021/1482',
		Documents: [
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
		]
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});

test('throws 400 when appeal does not require validation', async (t) => {
	const resp = await request.get('/validation/3');
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal does not require validation' });
});

test('returns appeal with all reasons why it is in \'incomplete\' state', async (t) => {
	const resp = await request.get('/validation/2');
	const appealReviewInfo = {
		AppealId: 2,
		AppealReference: 'APP/Q9999/D/21/1224115',
		AppellantName: 'Kevin Fowler',
		AppealStatus: 'incomplete',
		Received: '23 Feb 2022',
		AppealSite: '1 Grove Cottage, Shotesham Road, Woodton, NR35 2ND',
		LocalPlanningDepartment: 'Waveney District Council',
		PlanningApplicationReference: '18543/APP/2021/6627',
		Documents: [
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
		],
		reasons: {
			inflamatoryComments: true,
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
		AppealSite: '1 Grove Cottage, Shotesham Road, Woodton, NR35 2ND',
		LocalPlanningDepartment: 'Waveney District Council',
		PlanningApplicationReference: '18543/APP/2021/6627',
		Documents: [
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
		],
		reasons: {
			inflamatoryComments: true
		}
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});

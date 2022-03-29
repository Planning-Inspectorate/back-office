// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'received_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_2 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'valid_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_3 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'invalid_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'awaiting_validation_info',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const updated_appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	status: 'new status',
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const getAppealByIdStub = sinon.stub();
const updateStub = sinon.stub();

getAppealByIdStub.withArgs({ where: { id: 1 } }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 2 } }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 3 } }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 4 } }).returns(appeal_4);

updateStub.returns(updated_appeal_1);

const addNewDecision = sinon.stub();

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	outOfTime: true
};

addNewDecision.returns(newDecision);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub,
				update: updateStub
			},
			validationDecision: {
				create: addNewDecision
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should be able to submit \'valid\' decision', async (t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'valid', DescriptionOfDevelopment: 'Some Desc' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: {
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: sinon.match.any,
		updatedAt: sinon.match.any
	} });
	sinon.assert.calledWithExactly(addNewDecision, {  data: {
		appealId: 1,
		decision: 'valid',
		descriptionOfDevelopment: 'Some Desc'
	} });
});


test('should be able to submit \'invalid\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'invalid',
			Reason: {
				namesDoNotMatch: true,
				sensitiveInfo: false,
				missingOrWrongDocs: false,
				inflamatoryComments: false,
				openedInError: false,
				wrongAppealType: false,
				otherReasons: '' }
		});
	t.is(resp.status, 200);
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: {
		status: 'invalid_appeal',
		statusUpdatedAt: sinon.match.any,
		updatedAt: sinon.match.any
	} });
	sinon.assert.calledWithExactly(addNewDecision, {  data: {
		appealId: 1,
		decision: 'invalid',
		descriptionOfDevelopment: undefined,
		namesDoNotMatch: true,
		sensitiveInfo: false,
		missingOrWrongDocs: false,
		inflamatoryComments: false,
		openedInError: false,
		wrongAppealType: false,
		otherReasons: ''
	} });
});

test('should be able to submit \'missing appeal details\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'incomplete', Reason: { outOfTime: true } });
	t.is(resp.status, 200);
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: {
		status: 'awaiting_validation_info',
		statusUpdatedAt: sinon.match.any,
		updatedAt: sinon.match.any
	} });
	sinon.assert.calledWithExactly(addNewDecision, {  data: {
		appealId: 1,
		decision: 'incomplete',
		descriptionOfDevelopment: undefined,
		outOfTime: true
	} });
});

test('should not be able to submit nonsensical decision decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'some unknown status' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Unknown AppealStatus provided' } );
});

test('should not be able to submit validation decision for appeal that has been marked \'valid\'', async(t) => {
	const resp = await request.post('/validation/2')
		.send({ AppealStatus: 'invalid', Reason: { namesDoNotMatch: true } });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal does not require validation' } );
});

test('should not be able to submit validation decision for appeal that has been marked \'invalid\'', async(t) => {
	const resp = await request.post('/validation/3')
		.send({ AppealStatus: 'valid', DescriptionOfDevelopment: 'Some desc' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal does not require validation' } );
});

test('should be able to mark appeal with missing info as \'valid\'', async(t) => {
	const resp = await request.post('/validation/4').send({ AppealStatus: 'valid', DescriptionOfDevelopment: 'some desc' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, { where: { id: 4 }, data: {
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: sinon.match.any,
		updatedAt: sinon.match.any
	} });
});

test('should not be able to submit decision as \'invalid\' if there is no reason marked', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'invalid',
			Reason: {
				NamesDoNotMatch: false,
				Sensitiveinfo: false,
				MissingOrWrongDocs: false,
				InflamatoryComments: false,
				OpenedInError: false,
				WrongAppealType: false,
				OtherReasons: '' }
		});
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Invalid Appeal requires a reason' } );
});

test('should not be able to submit decision as \'invalid\' if there is no reason being sent', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'invalid',
			Reason:{}
		});
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Invalid Appeal requires a reason' } );
});


test('should not be able to submit decision as \'incomplete\' if there is no reason marked', async (t) => {
	const resp = await request.post('/validation/6')
		.send({
			AppealStatus:'incomplete',
			Reason: {
				OutOfTime: false,
				NoRightOfappeal: false,
				NotAppealable: false,
				LPADeemedInvalid: false,
				OtherReasons: ''
			}
		});
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Incomplete Appeal requires a reason' } );
});

test('should not be able to submit decision as \'incomplete\' if there is no reason being sent', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'incomplete',
			Reason:{}
		});
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Incomplete Appeal requires a reason' });
} );

test('should not be able to submit an unknown decision string', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'blah blah blah' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Unknown AppealStatus provided' });
} );

test('should not be able to submit \'valid\' decision without DescriptionOfDevelopment', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'valid' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Valid Appeals require Description of Development' });
} );

test('should not be able to submit \'valid\' decision with empty DescriptionOfDevelopment', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'valid', DescriptionOfDevelopment: '' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Valid Appeals require Description of Development' });
} );

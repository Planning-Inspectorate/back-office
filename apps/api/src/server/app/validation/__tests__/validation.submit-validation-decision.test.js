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
	}
};
const appeal_2 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [{
		status: 'valid_appeal',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	}
};
const appeal_3 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [{
		status: 'invalid_appeal',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	}
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [{
		status: 'awaiting_validation_info',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	}
};
const updated_appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		status: 'new status',
		valid: true
	}],
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const getAppealByIdStub = sinon.stub();
const updateStub = sinon.stub();

const includingDetailsForResponse = { validationDecision: true, address: true, appellant: true, appealStatus: { where: { valid: true } } };
const includingDetailsForValidtion = { appellant: false, appealStatus: { where: { valid: true } }, address: false, validationDecision: false };
getAppealByIdStub.withArgs({ where: { id: 1 }, include: includingDetailsForResponse }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 2 }, include: includingDetailsForResponse }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 2 }, include: includingDetailsForValidtion }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 3 }, include: includingDetailsForResponse }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 3 }, include: includingDetailsForValidtion }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 4 }, include: includingDetailsForResponse }).returns(appeal_4);
getAppealByIdStub.withArgs({ where: { id: 4 }, include: includingDetailsForValidtion }).returns(appeal_4);
getAppealByIdStub.withArgs({ where: { id: 5 }, include: includingDetailsForValidtion }).returns({ status: 'received_appeal' });
getAppealByIdStub.withArgs({ where: { id: 6 }, include: includingDetailsForValidtion }).returns({ status: 'received_appeal' });

updateStub.returns(updated_appeal_1);

const addNewDecisionStub = sinon.stub();

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	outOfTime: true
};

addNewDecisionStub.returns(newDecision);

const createLpaQuestionnaireStub = sinon.stub();
const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub,
				update: updateStub
			},
			validationDecision: {
				create: addNewDecisionStub
			},
			lPAQuestionnaire: {
				create: createLpaQuestionnaireStub
			},
			appealStatus: {
				updateMany: updateManyAppealStatusStub,
				create: createAppealStatusStub
			},
			$transaction: sinon.stub()
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should be able to submit \'valid\' decision', async (t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some Desc' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { appealId: 1 },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'awaiting_lpa_questionnaire', appealId: 1 }
	});
	sinon.assert.calledWithExactly(addNewDecisionStub, {  data: {
		appealId: 1,
		decision: 'valid',
		descriptionOfDevelopment: 'Some Desc'
	} });
});


test('should be able to submit \'invalid\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'invalid',
			Reason: {
				outOfTime:true,
				noRightOfAppeal:true,
				notAppealable:true,
				lPADeemedInvalid:true,
				otherReasons: '' }
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { appealId: 1 },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'invalid_appeal', appealId: 1 }
	});
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(addNewDecisionStub, {  data: {
		appealId: 1,
		decision: 'invalid',
		descriptionOfDevelopment: undefined,
		outOfTime: true,
		noRightOfAppeal: true,
		notAppealable: true,
		lPADeemedInvalid: true,
		otherReasons: ''
	} });
});

test('should be able to submit \'missing appeal details\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'incomplete',
			Reason:{
				namesDoNotMatch: true,
				sensitiveInfo: true,
				missingApplicationForm: true,
				missingDecisionNotice:true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				inflammatoryComments: true,
				openedInError: true,
				wrongAppealTypeUsed: true }
		} );
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { appealId: 1 },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'awaiting_validation_info', appealId: 1 }
	});
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(addNewDecisionStub, {  data: {
		appealId: 1,
		decision: 'incomplete',
		descriptionOfDevelopment: undefined,
		namesDoNotMatch: true,
		sensitiveInfo: true,
		missingApplicationForm: true,
		missingDecisionNotice:true,
		missingGroundsForAppeal: true,
		missingSupportingDocuments: true,
		inflammatoryComments: true,
		openedInError: true,
		wrongAppealTypeUsed: true
	} });
});

test('should be able to mark appeal with missing info as \'valid\'', async(t) => {
	const resp = await request.post('/validation/4').send({ AppealStatus: 'valid', descriptionOfDevelopment: 'some desc' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { appealId: 1 },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'awaiting_validation_info', appealId: 1 }
	});
	sinon.assert.calledWithExactly(addNewDecisionStub, {  data: {
		appealId: 1,
		decision: 'valid',
		descriptionOfDevelopment: 'Some Desc'
	} });
});

test('should not be able to submit nonsensical decision decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'some unknown status' });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit validation decision for appeal that has been marked \'valid\'', async(t) => {
	const resp = await request.post('/validation/2')
		.send({ AppealStatus: 'invalid', Reason: { outOfTime: true } });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Appeal is in an invalid state',
		}
	});
});

test('should not be able to submit validation decision for appeal that has been marked \'invalid\'', async(t) => {
	const resp = await request.post('/validation/3')
		.send({ AppealStatus: 'valid', descriptionOfDevelopment: 'Some desc' });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Appeal is in an invalid state',
		},
	});
});

test('should not be able to submit decision as \'invalid\' if there is no reason marked', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'invalid',
			Reason: {
				outOfTime: false,
				noRightOfAppeal: false,
				notAppealable: false,
				lPADeemedInvalid: false,
				otherReasons: '' }
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit decision as \'invalid\' if there is no reason being sent', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'invalid',
			Reason:{}
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit decision as \'incomplete\' if there is no reason marked', async (t) => {
	const resp = await request.post('/validation/6')
		.send({
			AppealStatus:'incomplete',
			Reason: {
				outOfTime: true,
				noRightOfAppeal: false,
				notAppealable: false,
				lPADeemedInvalid: false,
				otherReasons: ''
			}
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit decision as \'incomplete\' if providing invalid reasons', async (t) => {
	const resp = await request.post('/validation/6')
		.send({
			AppealStatus:'incomplete',
			Reason: {
				namesDoNotMatch: false,
				sensitiveInfo: false,
				missingApplicationForm: false,
				missingDecisionNotice: false,
				missingGroundsForAppeal: false,
				missingSupportingDocuments: false,
				inflammatoryComments: false,
				openedInError: false,
				wrongAppealTypeUsed: false,
				otherReasons: ''
			}
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit decision as \'invalid\' if providing incomplete reasons', async (t) => {
	const resp = await request.post('/validation/6')
		.send({
			AppealStatus:'invalid',
			Reason: {
				someFakeReason: true
			}
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
});

test('should not be able to submit decision as \'incomplete\' if there is no reason being sent', async (t) => {
	const resp = await request.post('/validation/5')
		.send({
			AppealStatus:'incomplete',
			Reason:{}
		});
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
} );

test('should not be able to submit an unknown decision string', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'blah blah blah' });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
} );

test('should not be able to submit \'valid\' decision without DescriptionOfDevelopment', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'valid' });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
} );

test('should not be able to submit \'valid\' decision with empty DescriptionOfDevelopment', async (t) => {
	const resp = await request.post('/validation/5')
		.send({	AppealStatus:'valid', DescriptionOfDevelopment: '' });
	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Invalid validation decision provided',
		}
	});
} );

import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';
import formatAddressLowerCase from '../../utils/address-formatter-lowercase.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';

const request = supertest(app);

const appeal1 = {
	...appealFactoryForTests(1, [{
		id: 1,
		status: 'available_for_inspector_pickup',
		valid: true,
		subStateMachineName: 'lpaQuestionnaireAndInspectorPickup'
	}, {
		id: 2,
		status: 'available_for_final_comments',
		valid: true,
		subStateMachineName: 'statementsAndFinalComments'
	}], 'FPA', { siteVisitBooked: true, lpaQuestionnaire: true }, {
		createdAt: new Date(2022, 1, 23),
		startedAt: new Date(2022, 1, 25)
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: false },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal2 = {
	...appealFactoryForTests(2, [{
		id: 3,
		status: 'available_for_inspector_pickup',
		valid: true
	}], 'HAS', { siteVisitBooked: true, lpaQuestionnaire: true }, {
		createdAt: new Date(2022, 1, 25),
		startedAt: new Date(2022, 3, 29)
	}),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal3 = {
	...appealFactoryForTests(3, [{
		id: 4,
		status: 'available_for_inspector_pickup',
		valid: true
	}], 'HAS', { lpaQuestionnaire: true }, { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: true }
};

const appeal4 = {
	...appealFactoryForTests(4, [{
		id: 5,
		status: 'site_visit_not_yet_booked',
		valid: true
	}], 'HAS', { lpaQuestionnaire: true }, { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }),
	lpaQuestionnaire: { siteVisibleFromPublicLand: true },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: false }
};

const appeal5 = {
	...appealFactoryForTests(5, [{
		id: 6,
		status: 'available_for_inspector_pickup',
		valid: true
	}], 'HAS', { lpaQuestionnaire: true, connectToUser: true }, { createdAt: new Date(2022, 1, 25), startedAt: new Date(2022, 3, 29) }),
	lpaQuestionnaire: { siteVisibleFromPublicLand: false },
	appealDetailsFromAppellant: { siteVisibleFromPublicLand: false }
};

const includeRelations = {
	appellant: true,
	address: true,
	appealType: true,
	appealDetailsFromAppellant: true,
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
	},
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 }, include: includeRelations }).returns(appeal1);
findUniqueStub.withArgs({ where: { id: 2 }, include: includeRelations }).returns(appeal2);
findUniqueStub.withArgs({ where: { id: 3 }, include: includeRelations }).returns(appeal3);
findUniqueStub.withArgs({ where: { id: 4 }, include: includeRelations }).returns(appeal4);
findUniqueStub.withArgs({ where: { id: 5 }, include: includeRelations }).returns(appeal5);

const updateStub = sinon.stub();
const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();
const createManyAppealStatusStub = sinon.stub();

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: findUniqueStub,
				update: updateStub
			},
			appealStatus: {
				updateMany: updateManyAppealStatusStub,
				create: createAppealStatusStub,
				createMany: createManyAppealStatusStub
			},
			$transaction: sinon.stub()
		};
	}
}

test.before('setup mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('assigns all appeals as they are all available', async(t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1).send([1, 2, 3]);

	t.is(resp.status, 200);
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [1] } }, data: { valid: false } });
	sinon.assert.calledWith(createManyAppealStatusStub, {
		data: [{
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			status: 'picked_up',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
			appealId: 1
		}]
	});
	sinon.assert.calledWith(updateStub, { where: { id: 1 }, data: { updatedAt: sinon.match.any, user: { connect: { azureReference: 1 } } } });
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [3] } }, data: { valid: false } });
	sinon.assert.calledWith(createAppealStatusStub, { data: { status: 'site_visit_not_yet_booked', appealId: 2 } });
	sinon.assert.calledWith(updateStub, { where: { id: 2 }, data: { updatedAt: sinon.match.any, user: { connect: { azureReference: 1 } } } });
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [4] } }, data: { valid: false } });
	sinon.assert.calledWith(createAppealStatusStub, { data: { status: 'site_visit_not_yet_booked', appealId: 3 } });
	sinon.assert.calledWith(updateStub, { where: { id: 3 }, data: { updatedAt: sinon.match.any, user: { connect: { azureReference: 1 } } } });
	t.deepEqual(resp.body, { successfullyAssigned: [{
		appealId: 1,
		reference: appeal1.reference,
		appealType: 'FPA',
		specialist: 'General',
		provisionalVisitType: 'access required',
		appealSite: formatAddressLowerCase(appeal1.address),
		appealAge: 41
	}, {
		appealId: 2,
		reference: appeal2.reference,
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'unaccompanied',
		appealSite: formatAddressLowerCase(appeal2.address)
	}, {
		appealId: 3,
		reference: appeal3.reference,
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'unaccompanied',
		appealSite: formatAddressLowerCase(appeal3.address)
	}], unsuccessfullyAssigned: [] });
});

test('unable to assign appeals that are not in the appropriate state', async(t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1).send([3, 4]);

	t.is(resp.status, 200);
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [4] } }, data: { valid: false } });
	sinon.assert.calledWith(createAppealStatusStub, { data: { status: 'site_visit_not_yet_booked', appealId: 3 } });
	sinon.assert.calledWith(updateStub, { where: { id: 3 }, data: { updatedAt: sinon.match.any, user: { connect: { azureReference: 1 } } } });
	t.deepEqual(resp.body, { successfullyAssigned: [{
		appealId: 3,
		reference: appeal3.reference,
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'unaccompanied',
		appealSite: formatAddressLowerCase(appeal3.address)
	}], unsuccessfullyAssigned: [{
		appealId: 4,
		reason: 'appeal in wrong state',
		reference: appeal4.reference,
		appealType: 'HAS',
		specialist: 'General',
		appealAge: 22,
		provisionalVisitType: 'access required',
		appealSite: formatAddressLowerCase(appeal4.address)
	}] });
});

test('unable to assign appeals that are already assigned to someone', async (t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1).send([1, 5]);

	t.is(resp.status, 200);
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [1] } }, data: { valid: false } });
	sinon.assert.calledWith(createManyAppealStatusStub, {
		data: [
			{
				subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
				status: 'picked_up',
				compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
				appealId: 1
			}
		]
	});
	sinon.assert.calledWith(updateStub, { where: { id: 1 }, data: { updatedAt: sinon.match.any, user: { connect: { azureReference: 1 } } } });
	t.deepEqual(resp.body, { successfullyAssigned: [{
		appealId: 1,
		reference: appeal1.reference,
		appealType: 'FPA',
		specialist: 'General',
		provisionalVisitType: 'access required',
		appealSite: formatAddressLowerCase(appeal1.address),
		appealAge: 41
	}], unsuccessfullyAssigned: [{
		appealAge: 22,
		appealId: 5,
		appealSite: formatAddressLowerCase(appeal5.address),
		appealType: 'HAS',
		provisionalVisitType: 'access required',
		reason: 'appeal already assigned',
		reference: appeal5.reference,
		specialist: 'General',
	}] });
});

test('throws error if no userid provided', async(t) => {
	const resp = await request.post('/inspector/assign').send([1]);

	t.is(resp.status, 401);
	t.deepEqual(resp.body, { errors: {
		userid: 'Authentication error. Missing header `userId`.',
	} });
});

test('throws error if no appeals provided', async(t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1);

	t.is(resp.status, 400);
	t.deepEqual(resp.body, { errors: {
		'': 'Provide a non-empty array of appeals to assign to the inspector',
	} });
});

test('throws error if empty array of appeals provided', async(t) => {
	const resp = await request.post('/inspector/assign').set('userId', 1).send([]);

	t.is(resp.status, 400);
	t.deepEqual(resp.body, {
		errors: {
			'': 'Provide a non-empty array of appeals to assign to the inspector',
		}
	});
});

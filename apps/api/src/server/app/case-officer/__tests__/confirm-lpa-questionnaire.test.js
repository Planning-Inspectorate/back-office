import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);

const appeal10 = {
	id: 10,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			id: 1,
			status: 'received_appeal',
			valid: true
		}
	],
	appealType: {
		type: 'household'
	},
	createdAt: new Date(2022, 1, 23),
	addressId: 9,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	}
};

const appeal11 = {
	id: 11,
	reference: 'APP/Q9999/D/21/1087562',
	appealStatus: [
		{
			id: 2,
			status: 'received_lpa_questionnaire',
			valid: true
		}
	],
	appealType: {
		type: 'household'
	},
	createdAt: new Date(2022, 1, 23),
	addressId: 11,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Bob Ross'
	}
};

const includeForValidation = {
	appealStatus: {
		where: {
			valid: true
		}
	},
	appealType: true
};

const getAppealByIdStub = sinon.stub();

getAppealByIdStub.withArgs({ where: { id: 11 }, include: includeForValidation }).returns(appeal11);
getAppealByIdStub.withArgs({ where: { id: 10 }, include: includeForValidation }).returns(appeal10);

const addReviewStub = sinon.stub();

const newReview = { reason: {} };

const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

addReviewStub.returns(newReview);
class MockDatabaseClass {
	constructor() {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub,
				update: sinon.stub()
			},
			reviewQuestionnaire: {
				create: addReviewStub
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
	sinon
		.stub(DatabaseFactory, 'getInstance')
		.callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should submit confirmation of an incomplete outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/11/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description',
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});

	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(addReviewStub, {
		data: {
			appealId: 11,
			complete: false,
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description',
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { id: { in: [2] } },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'incomplete_lpa_questionnaire', appealId: 11 }
	});
});

test('should submit confirmation of an incomplete if listed building desc is missing/incorrect', async (t) => {
	const resp = await request.post('/case-officer/11/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: true,
			siteListedBuildingDescriptionMissingOrIncorrectDescription: 'Some listed building desc',
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});

	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(addReviewStub, {
		data: {
			appealId: 11,
			complete: false,
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: true,
			siteListedBuildingDescriptionMissingOrIncorrectDescription: 'Some listed building desc',
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { id: { in: [2] } },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'incomplete_lpa_questionnaire', appealId: 11 }
	});
});

test('should submit confirmation of the outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/11/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});

	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(addReviewStub, {
		data: {
			appealId: 11,
			complete: true,
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});
	sinon.assert.calledWithExactly(updateManyAppealStatusStub, {
		where: { id: { in: [2] } },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'available_for_inspector_pickup', appealId: 11 }
	});
});

test("should not be able to submit review as 'incomplete' if there is no description being sent", async (t) => {
	const resp = await request.post('/case-officer/11/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});

	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Incomplete Review requires a description'
		}
	});
});

test("should not be able to submit review as 'incomplete' if some unexpected body attributes are provided", async (t) => {
	const resp = await request.post('/case-officer/11/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false,
			someFakeReason: true
		}
	});

	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			status: 'Incomplete Review requires a known description'
		}
	});
});

test('should not be able to submit review if appeal is not in a state ready to receive confirmation of the LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/10/confirm').send({
		reason: {
			applicationPlanningOfficersReportMissingOrIncorrect: false,
			applicationPlansToReachDecisionMissingOrIncorrect: false,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
			policiesOtherRelevantPoliciesMissingOrIncorrect: false,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
			siteListedBuildingDescriptionMissingOrIncorrect: false,
			thirdPartyApplicationNotificationMissingOrIncorrect: false,
			thirdPartyApplicationPublicityMissingOrIncorrect: false,
			thirdPartyRepresentationsMissingOrIncorrect: false,
			thirdPartyAppealNotificationMissingOrIncorrect: false
		}
	});

	t.is(resp.status, 409);
	t.deepEqual(resp.body, {
		errors: {
			appeal: 'Appeal is in an invalid state'
		}
	});
});

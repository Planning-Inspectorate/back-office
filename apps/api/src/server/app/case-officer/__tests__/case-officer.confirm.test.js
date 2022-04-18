// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);

const appeal_10 = {
	id: 10,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [{
		status: 'received_appeal',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 9,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	}
};

const appeal_11 = {
	id: 11,
	reference: 'APP/Q9999/D/21/1087562',
	appealStatus: [{
		status: 'received_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2022, 1, 23),
	addressId: 11,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Bob Ross'
	}
};

const includeForValidation = {
	appellant: false,
	validationDecision: false,
	address: false,
	appealStatus: {
		where: {
			valid: true
		}
	}
};
// const includeForDetails = {
// 	address: true,
// 	appellant: true,
// 	reviewQuestionnaire: {
// 		take: 1,
// 		orderBy: {
// 			createdAt: 'desc'
// 		}
// 	}
// };

const getAppealByIdStub = sinon.stub();

getAppealByIdStub.withArgs({ where: { id: 11 },	include: includeForValidation }).returns(appeal_11);
// getAppealByIdStub.withArgs({ where: { id: 11 },	include: includeForDetails }).returns(appeal_11);
getAppealByIdStub.withArgs({ where: { id: 10 },	include: includeForValidation }).returns(appeal_10);
// getAppealByIdStub.withArgs({ where: { id: 10 },	include: includeForDetails }).returns(appeal_10);

const addReviewStub = sinon.stub();

const newReview = {	reason: {} };

const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

addReviewStub.returns(newReview);
class MockDatabaseClass {
	constructor(_parameters) {
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
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
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
		where: { appealId: 11 },
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
		where: { appealId: 11 },
		data: { valid: false }
	});
	sinon.assert.calledWithExactly(createAppealStatusStub, {
		data: { status: 'available_for_inspector_pickup', appealId: 11 }
	});
});

test('should not be able to submit review as \'incomplete\' if there is no description being sent', async (t) => {
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
			status: 'Incomplete Review requires a description',
		}
	});
});

test('should not be able to submit review as \'incomplete\' if some unexpected body attributes are provided', async (t) => {
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
			status: 'Incomplete Review requires a known description',
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
			status: 'Appeal is in an invalid state',
		}
	});
});

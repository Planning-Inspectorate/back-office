// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const appeal_11 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1087562',
	status: 'received_lpa_questionnaire',
	createdAt: new Date(2022, 1, 23),
	addressId: 11,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Bob Ross'
};

const getAppealByIdStub = sinon.stub();

getAppealByIdStub.returns( appeal_11 );

const addReviewStub = sinon.stub();

const newReview = {};

addReviewStub.returns(newReview);
class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub,
			},
			reviewQuestionnaire: {
				create: addReviewStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});


test('should submit confirmation of the outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/11/confirm')
		.send({
			reason:{
				applicationPlanningOficersReportMissingOrIncorrect: false,
				applicationPlansToReachDecisionMissingOrIncorrect: false,
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
				policiesOtherRelevanPoliciesMissingOrIncorrect: false,
				policiesSupplementaryPlanningDocumentsMissingOrIncorrect : false,
				siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
				siteListedBuildingDescriptionMissingOrIncorrect: false,
				thirdPartyApplicationNotificationMissingOrIncorrect: false,
				thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false,
				thirdPartyApplicationPublicityMissingOrIncorrect: false,
				thirdPartyRepresentationsMissingOrIncorrect : false,
				thirdPartyAppealNotificationMissingOrIncorrect: false,
				thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false
			}
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(addReviewStub, {  data: {
		appealId: 11,
		complete: false,
		applicationPlanningOficersReportMissingOrIncorrect: false,
		applicationPlansToReachDecisionMissingOrIncorrect: false,
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
		policiesOtherRelevanPoliciesMissingOrIncorrect: false,
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect : false,
		siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
		siteListedBuildingDescriptionMissingOrIncorrect: false,
		thirdPartyApplicationNotificationMissingOrIncorrect: false,
		thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: false,
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false,
		thirdPartyApplicationPublicityMissingOrIncorrect: false,
		thirdPartyRepresentationsMissingOrIncorrect : false,
		thirdPartyAppealNotificationMissingOrIncorrect: false,
		thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: false,
		thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false
	} });
});

test('should submit confirmation of an incomplete outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/11/confirm')
		.send({
			reason:{
				appealId: 11,
				applicationPlanningOficersReportMissingOrIncorrect: false,
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description',
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
				policiesOtherRelevanPoliciesMissingOrIncorrect: false,
				policiesSupplementaryPlanningDocumentsMissingOrIncorrect : false,
				siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
				siteListedBuildingDescriptionMissingOrIncorrect: false,
				thirdPartyApplicationNotificationMissingOrIncorrect: false,
				thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false,
				thirdPartyApplicationPublicityMissingOrIncorrect: false,
				thirdPartyRepresentationsMissingOrIncorrect : false,
				thirdPartyAppealNotificationMissingOrIncorrect: false,
				thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: false,
				thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false
			}
		});
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(addReviewStub, {  data: {
		appealId: 11,
		complete: false,
		applicationPlanningOficersReportMissingOrIncorrect: false,
		applicationPlansToReachDecisionMissingOrIncorrect: true,
		applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description',
		policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
		policiesOtherRelevanPoliciesMissingOrIncorrect: false,
		policiesSupplementaryPlanningDocumentsMissingOrIncorrect : false,
		siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
		siteListedBuildingDescriptionMissingOrIncorrect: false,
		thirdPartyApplicationNotificationMissingOrIncorrect: false,
		thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: false,
		thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false,
		thirdPartyApplicationPublicityMissingOrIncorrect: false,
		thirdPartyRepresentationsMissingOrIncorrect : false,
		thirdPartyAppealNotificationMissingOrIncorrect: false,
		thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: false,
		thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: false
	} });
});

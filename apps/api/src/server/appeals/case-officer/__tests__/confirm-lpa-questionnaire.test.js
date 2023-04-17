import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

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

describe('confirming LPA questionnaire', () => {
	test('should submit confirmation of an incomplete outcome of LPA questionnaire', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal11);

		// WHEN
		const resp = await request.post('/appeals/case-officer/11/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.reviewQuestionnaire.create).toHaveBeenCalledWith({
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
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [2] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'incomplete_lpa_questionnaire', appealId: 11 }
		});
	});

	test('should submit confirmation of an incomplete if listed building desc is missing/incorrect', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal11);

		// WHEN
		const resp = await request.post('/appeals/case-officer/11/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.reviewQuestionnaire.create).toHaveBeenCalledWith({
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
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [2] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'incomplete_lpa_questionnaire', appealId: 11 }
		});
	});

	test('should submit confirmation of the outcome of LPA questionnaire', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal11);

		// WHEN
		const resp = await request.post('/appeals/case-officer/11/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.reviewQuestionnaire.create).toHaveBeenCalledWith({
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
		expect(databaseConnector.appealStatus.updateMany).toHaveBeenCalledWith({
			where: { id: { in: [2] } },
			data: { valid: false }
		});
		expect(databaseConnector.appealStatus.create).toHaveBeenCalledWith({
			data: { status: 'available_for_inspector_pickup', appealId: 11 }
		});
	});

	test("should not be able to submit review as 'incomplete' if there is no description being sent", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal11);

		// WHEN
		const resp = await request.post('/appeals/case-officer/11/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Incomplete Review requires a description'
			}
		});
	});

	test("should not be able to submit review as 'incomplete' if some unexpected body attributes are provided", async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal11);

		// WHEN
		const resp = await request.post('/appeals/case-officer/11/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				status: 'Incomplete Review requires a known description'
			}
		});
	});

	test('should not be able to submit review if appeal is not in a state ready to receive confirmation of the LPA questionnaire', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal10);

		// WHEN
		const resp = await request.post('/appeals/case-officer/10/confirm').send({
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

		// THEN
		expect(resp.status).toEqual(409);
		expect(resp.body).toEqual({
			errors: {
				appeal: 'Appeal is in an invalid state'
			}
		});
	});
});

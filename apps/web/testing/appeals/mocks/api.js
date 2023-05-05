import nock from 'nock';
import {
	appealData,
	appealsNationalList,
	localPlanningDepartments
} from '../../app/fixtures/referencedata.js';
import {
	appealDetailsForFinalComments,
	appealDetailsForIncompleteQuestionnaire,
	appealDetailsForReceivedQuestionnaire,
	appealDetailsForStatements
} from '../fixtures/case-officer.js';
import {
	appealDetailsForBookedSiteVisit,
	appealDetailsForDecisionDue,
	appealDetailsForPendingStatements,
	appealDetailsForUnbookedSiteVisit
} from '../fixtures/inspector.js';
import { incompleteAppealDetails, receivedAppealDetails } from '../fixtures/validation.js';

/**
 * @returns {{ destroy: () => void }}
 */
export function installMockAppealsService() {
	// Validation

	// received appeal
	nock('http://test/')
		.get(`/appeals/validation/${receivedAppealDetails.AppealId}`)
		.reply(200, receivedAppealDetails)
		.persist();

	// incomplete appeal
	nock('http://test/')
		.get(`/appeals/validation/${incompleteAppealDetails.AppealId}`)
		.reply(200, incompleteAppealDetails)
		.persist();

	// planning departments
	nock('http://test/')
		.get('/appeals/validation/lpa-list')
		.reply(200, localPlanningDepartments)
		.persist();

	// national list
	nock('http://test/').get('/appeals/').reply(200, appealsNationalList).persist();

	// appeal details
	nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData).persist();

	// remote error
	nock('http://test/').get('/appeals/validation/0').reply(500).persist();

	// Case officer

	for (const appeal of [
		appealDetailsForReceivedQuestionnaire,
		appealDetailsForIncompleteQuestionnaire,
		appealDetailsForFinalComments,
		appealDetailsForStatements
	]) {
		nock('http://test/')
			.get(`/appeals/case-officer/${appeal.AppealId}`)
			.reply(200, appeal)
			.persist();
	}
	for (const appeal of [appealDetailsForFinalComments, appealDetailsForStatements]) {
		nock('http://test/')
			.get(`/appeals/case-officer/${appeal.AppealId}/statements-comments`)
			.reply(200, appeal)
			.persist();
	}
	// Unknown appeals
	nock('http://test/').get('/appeals/case-officer/0').reply(500).persist();
	nock('http://test/').get('/appeals/case-officer/0/statements-comments').reply(500).persist();
	nock('http://test/').get('/appeals/0').reply(500).persist();

	// Inspector

	for (const appeal of [
		appealDetailsForUnbookedSiteVisit,
		appealDetailsForBookedSiteVisit,
		appealDetailsForDecisionDue,
		appealDetailsForPendingStatements
	]) {
		nock('http://test/').get(`/appeals/inspector/${appeal.appealId}`).reply(200, appeal).persist();
	}
	nock('http://test/').get('/appeals/inspector/0').reply(500).persist();

	return {
		destroy: () => {
			nock.cleanAll();
		}
	};
}

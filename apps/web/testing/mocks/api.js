import nock from 'nock';
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
import { localPlanningDepartments } from '../fixtures/referencedata.js';
import { incompleteAppealDetails, receivedAppealDetails } from '../fixtures/validation.js';

/**
 * @returns {{ destroy: () => void }}
 */
export function installMockApi() {
	// Validation

	// received appeal
	nock('http://test/')
		.get(`/validation/${receivedAppealDetails.AppealId}`)
		.reply(200, receivedAppealDetails)
		.persist();

	// incomplete appeal
	nock('http://test/')
		.get(`/validation/${incompleteAppealDetails.AppealId}`)
		.reply(200, incompleteAppealDetails)
		.persist();

	// planning departments
	nock('http://test/').get('/validation/lpa-list').reply(200, localPlanningDepartments).persist();

	// remote error
	nock('http://test/').get('/validation/0').reply(500).persist();

	// Case officer

	for (const appeal of [
		appealDetailsForReceivedQuestionnaire,
		appealDetailsForIncompleteQuestionnaire,
		appealDetailsForFinalComments,
		appealDetailsForStatements
	]) {
		nock('http://test/').get(`/case-officer/${appeal.AppealId}`).reply(200, appeal).persist();
	}
	for (const appeal of [appealDetailsForFinalComments, appealDetailsForStatements]) {
		nock('http://test/')
			.get(`/case-officer/${appeal.AppealId}/statements-comments`)
			.reply(200, appeal)
			.persist();
	}
	// Unknown appeals
	nock('http://test/').get('/case-officer/0').reply(500).persist();
	nock('http://test/').get('/case-officer/0/statements-comments').reply(500).persist();

	// Inspector

	for (const appeal of [
		appealDetailsForUnbookedSiteVisit,
		appealDetailsForBookedSiteVisit,
		appealDetailsForDecisionDue,
		appealDetailsForPendingStatements
	]) {
		nock('http://test/').get(`/inspector/${appeal.appealId}`).reply(200, appeal).persist();
	}
	nock('http://test/').get('/inspector/0').reply(500).persist();

	return {
		destroy: () => {
			nock.cleanAll();
		}
	};
}

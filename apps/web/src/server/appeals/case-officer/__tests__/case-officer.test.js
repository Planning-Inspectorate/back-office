import { getPathToAsset, parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	appealDetailsForFinalComments,
	appealDetailsForIncompleteQuestionnaire,
	appealDetailsForReceivedQuestionnaire,
	appealDetailsForStatements,
	appealSummaryForFinalComments,
	appealSummaryForIncompleteQuestionnaire,
	appealSummaryForOverdueQuestionnaire,
	appealSummaryForPendingQuestionnaire,
	appealSummaryForReceivedQuestionnaire,
	appealSummaryForStatements
} from '../../../../../testing/appeals/appeals.js';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/case-officer';

describe('case-officer', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render a placeholder for empty appeals', async () => {
			nock('http://test/').get('/appeals/case-officer').reply(200, []);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render incoming and incomplete questionnaires', async () => {
			nock('http://test/')
				.get('/appeals/case-officer')
				.reply(200, [
					appealSummaryForReceivedQuestionnaire,
					appealSummaryForOverdueQuestionnaire,
					appealSummaryForPendingQuestionnaire,
					appealSummaryForIncompleteQuestionnaire,
					appealSummaryForFinalComments,
					appealSummaryForStatements
				]);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals/:appealId', () => {
		it('should render a received questionnaire', async () => {
			const { AppealId } = appealDetailsForReceivedQuestionnaire;
			const response = await request.get(`${baseUrl}/appeals/${AppealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render an incomplete questionnaire', async () => {
			const { AppealId } = appealDetailsForIncompleteQuestionnaire;
			const response = await request.get(`${baseUrl}/appeals/${AppealId}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals/:appealId/questionnaire', () => {
		const { AppealId } = appealDetailsForReceivedQuestionnaire;

		it('should validate a questionnaire with the descriptions missing', async () => {
			const response = await request.post(`${baseUrl}/appeals/${AppealId}/questionnaire`).send({
				answers: [
					'applicationPlansToReachDecisionMissingOrIncorrect',
					'policiesOtherRelevantPoliciesMissingOrIncorrect',
					'policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect',
					'policiesSupplementaryPlanningDocumentsMissingOrIncorrect',
					'siteConservationAreaMapAndGuidanceMissingOrIncorrect',
					'siteListedBuildingDescriptionMissingOrIncorrect',
					'thirdPartyRepresentationsMissingOrIncorrect'
				],
				applicationPlansToReachDecisionMissingOrIncorrectDescription: ' ',
				policiesOtherRelevantPoliciesMissingOrIncorrectDescription: ' ',
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription: ' ',
				policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription: ' ',
				siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription: ' ',
				siteListedBuildingDescriptionMissingOrIncorrectDescription: ' ',
				thirdPartyRepresentationsMissingOrIncorrectDescription: ' '
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate a questionnaire with no nested reasons selected', async () => {
			const response = await request.post(`${baseUrl}/appeals/${AppealId}/questionnaire`).send({
				answers: [
					'thirdPartyAppealNotificationMissingOrIncorrect',
					'thirdPartyApplicationNotificationMissingOrIncorrect'
				]
			});
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should handle an incomplete questionnaire', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/questionnaire`)
				.send({
					answers: [
						'applicationPlansToReachDecisionMissingOrIncorrect',
						'applicationPlanningOfficersReportMissingOrIncorrect',
						'thirdPartyAppealNotificationMissingOrIncorrect'
					],
					applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Missing!',
					thirdPartyAppealNotificationMissingOrIncorrect: [
						'thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice'
					]
				})
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should handle a questionnaire with nothing missing', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/questionnaire`)
				.send({})
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals/:appealId/questionnaire/complete', () => {
		const { AppealId } = appealDetailsForIncompleteQuestionnaire;

		it('should validate that a decision is made', async () => {
			const response = await request.post(`${baseUrl}/appeals/${AppealId}/questionnaire/complete`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the confirm appeal when marking the questionnaire as completed', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/questionnaire/complete`)
				.send({ reviewComplete: 'true' })
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the confirmation page when marking the questionnaire as incomplete', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/questionnaire/complete`)
				.send({ reviewComplete: 'false' })
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when the questionnaire is not incomplete', async () => {
			const { AppealId: invalidAppealId } = appealDetailsForReceivedQuestionnaire;
			const response = await request
				.post(`${baseUrl}/appeals/${invalidAppealId}/questionnaire/complete`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review questionnaire');
		});
	});

	describe('POST /appeals/:appealId/questionnaire/confirm', () => {
		const { AppealId } = appealDetailsForReceivedQuestionnaire;

		describe('valid questionnaire review', () => {
			beforeEach(async () => {
				nock('http://test/')
					.post(`/appeals/case-officer/${AppealId}/confirm`, { reason: {} })
					.reply(200);

				await installQuestionnaireReview(AppealId, {});
			});

			it('should confirm a valid questionnaire', async () => {
				const response = await request
					.post(`${baseUrl}/appeals/${AppealId}/questionnaire/confirm`)
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});
		});

		describe('incomplete questionnaire review', () => {
			beforeEach(async () => {
				await installQuestionnaireReview(AppealId, {
					answers: [
						'applicationPlansToReachDecisionMissingOrIncorrect',
						'applicationPlanningOfficersReportMissingOrIncorrect',
						'thirdPartyAppealNotificationMissingOrIncorrect'
					],
					applicationPlansToReachDecisionMissingOrIncorrectDescription: '*',
					thirdPartyAppealNotificationMissingOrIncorrect: [
						'thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice'
					]
				});
			});

			it('should validate the confirmation for an incomplete questionnaire', async () => {
				const response = await request.post(`${baseUrl}/appeals/${AppealId}/questionnaire/confirm`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});

			it('should confirm an incomplete questionnaire', async () => {
				nock('http://test/')
					.post(`/appeals/case-officer/${AppealId}/confirm`, {
						reason: {
							applicationPlansToReachDecisionMissingOrIncorrect: true,
							applicationPlanningOfficersReportMissingOrIncorrect: true,
							thirdPartyAppealNotificationMissingOrIncorrect: true,
							applicationPlansToReachDecisionMissingOrIncorrectDescription: '*',
							thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: true
						}
					})
					.reply(200);

				const response = await request
					.post(`${baseUrl}/appeals/${AppealId}/questionnaire/confirm`)
					.send({ confirmation: true })
					.redirects(1);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});
		});
	});

	describe('GET /appeals/:appealId/edit-listed-building-description', () => {
		const { AppealId } = appealDetailsForIncompleteQuestionnaire;

		it('should render a page for updating the listed building description', async () => {
			const response = await request.get(
				`${baseUrl}/appeals/${AppealId}/edit-listed-building-description`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when the listed building description is not missing or incorrect', async () => {
			nock('http://test/')
				.get('/appeals/case-officer/1')
				.reply(
					200,
					/** @type {import('@pins/appeals').CaseOfficer.Appeal} */ ({
						...appealDetailsForIncompleteQuestionnaire,
						reviewQuestionnaire: {
							applicationPlanningOfficersReportMissingOrIncorrect: true
						}
					})
				)
				.persist();

			const response = await request
				.get(`${baseUrl}/appeals/1/edit-listed-building-description`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review incomplete questionnaire');
		});
	});

	describe('POST /appeals/:appealId/edit-listed-building-description', () => {
		const { AppealId } = appealDetailsForIncompleteQuestionnaire;

		it('should validate that a listed building description is provided', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/edit-listed-building-description`)
				.send({ listedBuildingDescription: ' ' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should update the listed building description', async () => {
			nock.cleanAll();
			nock('http://test/')
				.get(`/appeals/case-officer/${AppealId}`)
				.reply(200, appealDetailsForIncompleteQuestionnaire);
			nock('http://test/').patch(`/appeals/case-officer/${AppealId}`).reply(200);
			nock('http://test/')
				.get(`/appeals/case-officer/${AppealId}`)
				.reply(
					200,
					/** @type {import('@pins/appeals').CaseOfficer.Appeal } */
					({ ...appealDetailsForIncompleteQuestionnaire, ListedBuildingDesc: '*' })
				);

			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/edit-listed-building-description`)
				.send({ listedBuildingDescription: '*' })
				.redirects(1);
			const element = parseHtml(response.text);
			const description = element.querySelector(
				'[data-test-id="siteListedBuildingDescriptionMissingOrIncorrect"]'
			);

			expect(description?.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when the listed building description is not missing or incorrect', async () => {
			nock('http://test/')
				.get(`/appeals/case-officer/1`)
				.reply(
					200,
					/** @type {import('@pins/appeals').CaseOfficer.Appeal} */ ({
						...appealDetailsForIncompleteQuestionnaire,
						reviewQuestionnaire: {
							applicationPlanningOfficersReportMissingOrIncorrect: true
						}
					})
				)
				.persist();

			const response = await request
				.get(`${baseUrl}/appeals/1/edit-listed-building-description`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review incomplete questionnaire');
		});
	});

	describe('GET /appeals/:appealId/documents/:documentType', () => {
		const { AppealId } = appealDetailsForIncompleteQuestionnaire;

		it('should render a page for updating a document type', async () => {
			const response = await request.get(
				`${baseUrl}/appeals/${AppealId}/documents/plans-used-to-reach-decision`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the appeal page when the document type is not missing or incorrect', async () => {
			const { reviewQuestionnaire } = appealDetailsForIncompleteQuestionnaire;

			nock('http://test/')
				.get(`/appeals/case-officer/1`)
				.reply(
					200,
					/** @type {import('@pins/appeals').CaseOfficer.Appeal} */ ({
						...appealDetailsForIncompleteQuestionnaire,
						reviewQuestionnaire: {
							...reviewQuestionnaire,
							applicationPlansToReachDecisionMissingOrIncorrect: false
						}
					})
				)
				.persist();

			const response = await request
				.get(`${baseUrl}/appeals/1/documents/plans-used-to-reach-decision`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review incomplete questionnaire');
		});
	});

	describe('POST /appeals/:appealId/documents/:documentType', () => {
		const { AppealId } = appealDetailsForIncompleteQuestionnaire;

		it('should validate that a file is chosen', async () => {
			const response = await request.post(
				`${baseUrl}/appeals/${AppealId}/documents/plans-used-to-reach-decision`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that a file is not in excess of 15mb', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/documents/plans-used-to-reach-decision`)
				.attach('files', getPathToAsset('anthropods.pdf'));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect back to the appeal after a mock upload', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/documents/plans-used-to-reach-decision`)
				.attach('files', getPathToAsset('simple.pdf'))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review incomplete questionnaire');
		});

		it('should redirect to the appeal page when the document type is not missing or incorrect', async () => {
			const { reviewQuestionnaire } = appealDetailsForIncompleteQuestionnaire;

			nock('http://test/')
				.get(`/appeals/case-officer/1`)
				.reply(
					200,
					/** @type {import('@pins/appeals').CaseOfficer.Appeal} */ ({
						...appealDetailsForIncompleteQuestionnaire,
						reviewQuestionnaire: {
							...reviewQuestionnaire,
							applicationPlansToReachDecisionMissingOrIncorrect: false
						}
					})
				)
				.persist();

			const response = await request
				.post(`${baseUrl}/appeals/1/documents/plans-used-to-reach-decision`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Review incomplete questionnaire');
		});
	});

	describe('GET /appeals/:appealId/final-comments', () => {
		it('should render an appeal accepting final comments', async () => {
			const { AppealId } = appealDetailsForFinalComments;
			const response = await request.get(`${baseUrl}/appeals/${AppealId}/final-comments`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the dashboard if an appeal is not accepting final comments', async () => {
			nock('http://test/').get('/appeals/case-officer').reply(200, []);

			const response = await request
				.get(`${baseUrl}/appeals/${appealDetailsForStatements.AppealId}/final-comments`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
		});
	});

	describe('POST /appeals/:appealId/final-comments', () => {
		const { AppealId } = appealDetailsForFinalComments;

		it('should validate that a file is chosen', async () => {
			const response = await request.post(`${baseUrl}/appeals/${AppealId}/final-comments`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that a file is not in excess of 15mb', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/final-comments`)
				.attach('files', getPathToAsset('anthropods.pdf'));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should upload a final comment with a success message', async () => {
			nock('http://test/').post(`/appeals/case-officer/${AppealId}/final-comment`).reply(200, {
				AppealId,
				AppealReference: 'APPREF',
				canUploadFinalCommentsUntil: '31 Dec 2030'
			});

			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/final-comments`)
				.attach('files', getPathToAsset('simple.pdf'))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the dashboard when the appeal is not accepting final comments', async () => {
			nock('http://test/').get('/appeals/case-officer').reply(200, []);

			const response = await request
				.post(`${baseUrl}/appeals/${appealDetailsForStatements.AppealId}/final-comments`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
		});
	});

	describe('GET /appeals/:appealId/statements', () => {
		it('should render an appeal accepting statements', async () => {
			const { AppealId } = appealDetailsForStatements;
			const response = await request.get(`${baseUrl}/appeals/${AppealId}/statements`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the dashboard if an appeal is not accepting statements', async () => {
			nock('http://test/').get('/appeals/case-officer').reply(200, []);

			const response = await request
				.get(`${baseUrl}/appeals/${appealDetailsForFinalComments.AppealId}/statements`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
		});
	});

	describe('POST /appeals/:appealId/statements', () => {
		const { AppealId } = appealDetailsForStatements;

		it('should validate that a file is chosen', async () => {
			const response = await request.post(`${baseUrl}/appeals/${AppealId}/statements`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should validate that a file is not in excess of 15mb', async () => {
			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/statements`)
				.attach('files', getPathToAsset('anthropods.pdf'));
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should upload a statement with a success message', async () => {
			nock('http://test/').post(`/appeals/case-officer/${AppealId}/statement`).reply(200, {
				AppealId,
				AppealReference: 'APPREF',
				canUploadStatementsUntil: '31 Dec 2030'
			});

			const response = await request
				.post(`${baseUrl}/appeals/${AppealId}/statements`)
				.attach('files', getPathToAsset('simple.pdf'))
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the dashboard when the appeal is not accepting statements', async () => {
			nock('http://test/').get('/appeals/case-officer').reply(200, []);

			const response = await request
				.post(`${baseUrl}/appeals/${appealDetailsForFinalComments.AppealId}/statements`)
				.redirects(1);
			const element = parseHtml(response.text);

			expect(element.querySelector('h1')?.innerHTML).toEqual('Questionnaires for review');
		});
	});
});

/**
 * @param {number} appealId
 * @param {*} questionnaireReview
 * @returns {Promise<import('supertest').Response>}
 */
function installQuestionnaireReview(appealId, questionnaireReview) {
	return request.post(`${baseUrl}/appeals/${appealId}/questionnaire`).send(questionnaireReview);
}

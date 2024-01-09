import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { jest } from '@jest/globals';
import {
	lpaQuestionnaireData,
	lpaQuestionnaireIncompleteReasons,
	documentFolderInfo,
	documentFileInfo,
	documentFileVersionsInfo,
	documentFileVersionsInfoNotChecked,
	documentFileVersionsInfoVirusFound,
	documentFileVersionsInfoChecked,
	documentRedactionStatuses,
	activeDirectoryUsersData,
	appealData,
	notCheckedDocumentFolderInfoDocuments
} from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';
import { textInputCharacterLimits } from '../../../appeal.constants.js';
import usersService from '#appeals/appeal-users/users-service.js';
import { cloneDeep } from 'lodash-es';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details/1/lpa-questionnaire/2';

const incompleteReasonIds = lpaQuestionnaireIncompleteReasons.map((reason) => reason.id);
const incompleteReasonsWithText = lpaQuestionnaireIncompleteReasons.filter(
	(reason) => reason.hasText === true
);
const incompleteReasonsWithoutText = lpaQuestionnaireIncompleteReasons.filter(
	(reason) => reason.hasText === false
);
const incompleteReasonsWithTextIds = incompleteReasonsWithText.map((reason) => reason.id);
const incompleteReasonsWithoutTextIds = incompleteReasonsWithoutText.map((reason) => reason.id);

describe('LPA Questionnaire review', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render LPA Questionnaire review', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET / with unchecked documents', () => {
		beforeEach(() => {
			nock.cleanAll();
			nock('http://test/').get(`/appeals/${appealData.appealId}`).reply(200, appealData).persist();
		});

		it('should render a notification banner when a file is unscanned', async () => {
			//Create a document with virus scan still in progress
			let updatedLPAQuestionnaireData = cloneDeep(lpaQuestionnaireData);
			updatedLPAQuestionnaireData.documents.conservationAreaMap.documents.push(
				notCheckedDocumentFolderInfoDocuments
			);
			nock('http://test/')
				.get('/appeals/1/lpa-questionnaires/2')
				.reply(200, updatedLPAQuestionnaireData);

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render an error when a file has a virus', async () => {
			//Create a document with virus scan still in progress
			let updatedLPAQuestionnaireData = cloneDeep(lpaQuestionnaireData);
			updatedLPAQuestionnaireData.documents.conservationAreaMap.documents.push(
				notCheckedDocumentFolderInfoDocuments
			);
			nock('http://test/')
				.get('/appeals/1/lpa-questionnaires/2')
				.reply(200, updatedLPAQuestionnaireData);

			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /', () => {
		it('should render LPA Questionnaire review with error (no answer provided)', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const response = await request.post(baseUrl).send({
				'review-outcome': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the complete page if no errors are present and posted outcome is "complete"', async () => {
			nock('http://test/')
				.get('/appeals/1/lpa-questionnaires/2')
				.reply(200, lpaQuestionnaireData)
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'complete' });

			const response = await request.post(baseUrl).send({
				'review-outcome': 'complete'
			});

			expect(response.statusCode).toBe(302);
		});
	});
	describe('GET /appeals-service/appeal-details/1/lpa-questionnaire/2/incomplete', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(`${baseUrl}/incomplete`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the incomplete reason page if required data is present in the session', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const lpaQuestionnairePostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQuestionnairePostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/incomplete`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals-service/appeal-details/1/lpa-questionnaire/2/incomplete', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let lpaQPostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);

			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			// post to LPA questionnaire page controller is necessary to set required data in the session
			lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the incomplete reason page with the expected error message if no incomplete reason was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty string', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithTextIds[0],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty array', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithTextIds[0],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: []
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty strings', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
				[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty arrays', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [],
				[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: [
					'test reason text 1',
					'test reason text 2'
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property exceeds the character limit', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithTextIds[0],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
					textInputCharacterLimits.lpaQuestionnaireNotValidReason + 1
				)
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties exceed the character limit', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
				[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: 'a'.repeat(
					textInputCharacterLimits.lpaQuestionnaireNotValidReason + 1
				)
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single incomplete reason without text was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithoutTextIds[0]
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if a single incomplete reason with text within the character limit was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithTextIds[0],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
					textInputCharacterLimits.lpaQuestionnaireNotValidReason
				)
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons without text were provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithoutTextIds[0], incompleteReasonsWithoutTextIds[1]]
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons with text within the character limit were provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
					'a'.repeat(textInputCharacterLimits.lpaQuestionnaireNotValidReason),
					'test reason text 2'
				],
				[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: 'a'.repeat(
					textInputCharacterLimits.lpaQuestionnaireNotValidReason
				)
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appeals-service/appeal-details/1/lpa-questionnaire/2/incomplete/date', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(`${baseUrl}/incomplete/date`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the update due date page if required data is present in the session', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonIds
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/incomplete/date`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals-service/appeal-details/1/lpa-questionnaire/2/incomplete/date', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let lpaQPostResponse;
		/**
		 * @type {import("superagent").Response}
		 */
		let incompleteReasonPostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);

			// post to LPA questionnaire page controller is necessary to set required data in the session
			lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			// post to incomplete reason page controller is necessary to set required data in the session
			incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonIds
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the update date page with the expected error message if no date was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '',
				'due-date-month': '',
				'due-date-year': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if provided date is not in the future', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '1',
				'due-date-year': '2000'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid day was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '0',
				'due-date-month': '1',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '32',
				'due-date-month': '1',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': 'first',
				'due-date-month': '1',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid month was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '0',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '13',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': 'dec',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid year was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '1',
				'due-date-year': '23'
			});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '1',
				'due-date-year': 'abc'
			});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid date was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '29',
				'due-date-month': '2',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a valid date was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete/date`).send({
				'due-date-day': '1',
				'due-date-month': '12',
				'due-date-year': '3000'
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appeals-service/appeal-details/1/lpa-questionnaire/2/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(`${baseUrl}/check-your-answers`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check your answers page with the expected content if outcome is "incomplete" and required data is present in the session', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
				[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
					'test reason text 1',
					'test reason text 2'
				],
				[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: 'test reason text 1'
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/check-your-answers`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals-service/appeal-details/1/lpa-questionnaire/2/check-your-answers', () => {
		afterEach(() => {
			nock.cleanAll();
		});

		it('should send a patch request to the LPA questionnaire API endpoint and redirect to the decision incomplete confirmation page, if posted outcome was "incomplete"', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonIds
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedlpaQuestionnairesEndpoint = nock('http://test/')
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(`${baseUrl}/check-your-answers`);

			expect(mockedlpaQuestionnairesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appeals-service/appeal-details/1/lpa-questionnaire/2/incomplete/confirmation', () => {
		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(`${baseUrl}/incomplete/confirmation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the confirmation page with the expected content if required data is present in the session', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonIds
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedlpaQuestionnairesEndpoint = nock('http://test/')
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'incomplete' });

			// post to check and confirm page controller is necessary to set required data in the session
			const checkAndConfirmPostResponse = await request.post(`${baseUrl}/check-your-answers`);

			expect(mockedlpaQuestionnairesEndpoint.isDone()).toBe(true);
			expect(checkAndConfirmPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/incomplete/confirmation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appeals-service/appeal-details/1/lpa-questionnaire/2/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(`${baseUrl}/confirmation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the confirmation page with the expected content if required data is present in the session', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			nock('http://test/')
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'incomplete' });

			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'complete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/confirmation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /lpa-questionnaire/2/add-documents/:folderId/', () => {
		it('should render a document upload page with a single file upload component', async () => {
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);

			const response = await request.get(`${baseUrl}/add-documents/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /lpa-questionnaire/2/add-documents/:folderId/:documentId', () => {
		it('should render a document upload page with a single file upload component', async () => {
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);

			const response = await request.get(`${baseUrl}/add-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /lpa-questionnaire/2/add-document-details/:folderId/', () => {
		it('should render the add document details page with one item per unpublished document', async () => {
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);

			const response = await request.get(`${baseUrl}/add-document-details/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /lpa-questionnaire/2/add-document-details/:folderId/', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/')
				.get('/appeals/1/document-folders/1')
				.reply(200, {
					folderId: 23,
					path: 'lpa_questionnaire/conservationAreaMap',
					caseId: '1',
					documents: [
						{
							id: '4541e025-00e1-4458-aac6-d1b51f6ae0a7',
							receivedDate: '2023-02-01',
							redactionStatus: 2
						}
					]
				});
			nock('http://test/')
				.patch('/appeals/1/documents')
				.reply(200, {
					documents: [
						{
							id: '4541e025-00e1-4458-aac6-d1b51f6ae0a7',
							receivedDate: '2023-02-01',
							redactionStatus: 2
						}
					]
				});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the document details page with the expected error message if the request body is in an incorrect format', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is empty', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '',
							month: '2',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is non-numeric', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: 'a',
							month: '2',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is less than 1', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '0',
							month: '2',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate day is greater than 31', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '32',
							month: '2',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is empty', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is non-numeric', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: 'a',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is less than 1', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '0',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate month is greater than 12', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '13',
							year: '2030'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate year is empty', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '2',
							year: ''
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate year is non-numeric', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '2',
							year: 'a'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the document details page with the expected error message if receivedDate is not a valid date', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '29',
							month: '2',
							year: '2023'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should send a patch request to the appeal documents endpoint and redirect to the lpa questionnaire page, if complete and valid document details were provided', async () => {
			const response = await request.post(`${baseUrl}/add-document-details/1`).send({
				items: [
					{
						documentId: 'a6681be2-7cf8-4c9f-b223-f97f003577f3',
						receivedDate: {
							day: '1',
							month: '2',
							year: '2023'
						},
						redactionStatus: 'unredacted'
					}
				]
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /lpa-questionnaire/2/manage-documents/:folderId/', () => {
		beforeEach(() => {
			// @ts-ignore
			usersService.getUserByRoleAndId = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);

			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		it('should render a 404 error page if the folderId is not valid', async () => {
			const response = await request.get(`${baseUrl}/manage-documents/99/`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage documents listing page with one document item for each document present in the folder, if the folderId is valid', async () => {
			const response = await request.get(`${baseUrl}/manage-documents/1/`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /lpa-questionnaire/2/manage-documents/:folderId/:documentId', () => {
		beforeEach(() => {
			// @ts-ignore
			usersService.getUsersByRole = jest.fn().mockResolvedValue(activeDirectoryUsersData);
			// @ts-ignore
			usersService.getUserByRoleAndId = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);
			// @ts-ignore
			usersService.getUserById = jest.fn().mockResolvedValue(activeDirectoryUsersData[0]);

			nock('http://test/')
				.get('/appeals/document-redaction-statuses')
				.reply(200, documentRedactionStatuses);
			nock('http://test/').get('/appeals/1/document-folders/1').reply(200, documentFolderInfo);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		it('should render a 404 error page if the folderId is not valid', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(`${baseUrl}/manage-documents/99/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render a 404 error page if the documentId is not valid', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(`${baseUrl}/manage-documents/1/99`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is null', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfo);

			const response = await request.get(`${baseUrl}/manage-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "not_checked"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoNotChecked);

			const response = await request.get(`${baseUrl}/manage-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "failed_virus_check"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoVirusFound);

			const response = await request.get(`${baseUrl}/manage-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the manage individual document page with the expected content if the folderId and documentId are both valid and the document virus check status is "checked"', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoChecked);

			const response = await request.get(`${baseUrl}/manage-documents/1/1`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the delete document page with single document verson', async () => {
			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoChecked);

			const response = await request.get(`${baseUrl}/manage-documents/1/1/1/delete`);

			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the delete document page with multiple document versons', async () => {
			const multipleVersionsDocument = { ...documentFileVersionsInfoChecked };
			multipleVersionsDocument.documentVersion.push(multipleVersionsDocument.documentVersion[0]);

			nock('http://test/')
				.get('/appeals/1/documents/1/versions')
				.reply(200, documentFileVersionsInfoChecked);

			const response = await request.get(`${baseUrl}/manage-documents/1/1/1/delete`);

			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

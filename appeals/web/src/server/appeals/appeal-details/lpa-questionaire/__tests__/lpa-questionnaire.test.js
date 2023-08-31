import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import {
	lpaQuestionnaireData,
	lpaQuestionnaireIncompleteReasons
} from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';
import { TEXTAREA_MAXIMUM_CHARACTERS } from '#lib/validators/textarea-validator.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details/1/lpa-questionnaire/2';
const otherReasonId = lpaQuestionnaireIncompleteReasons.find(
	(reason) => reason.name.toLowerCase() === 'other'
)?.id;

const incompleteReasonsWithoutOther = lpaQuestionnaireIncompleteReasons.filter(
	(reason) => reason.name.toLowerCase() !== 'other'
);
const incompleteReasonIdsWithoutOther = incompleteReasonsWithoutOther.map((reason) => reason.id);

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

	describe('POST /', () => {
		it('should render LPA Questionnaire review with error (no answer provided)', async () => {
			nock('http://test/').get('/appeals/1/lpa-questionnaires/2').reply(200, lpaQuestionnaireData);

			const response = await request.post(baseUrl).send({
				'review-outcome': ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the complete page if no errors are present', async () => {
			nock('http://test/')
				.get('/appeals/1/lpa-questionnaires/2')
				.reply(200, lpaQuestionnaireData)
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'complete' });

			const response = await request.post(baseUrl).send({
				'review-outcome': 'complete'
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
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

			const response = await request.post(`${baseUrl}/incomplete`).send({
				otherReason: '',
				otherReasonId: otherReasonId
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if "other" reason was selected but no "otherReason" was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: otherReasonId,
				otherReason: '',
				otherReasonId: otherReasonId
			});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if "other" reason text exceeds the character limit', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const otherReasonTextOverCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS + 1);
			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: otherReasonId,
				otherReason: otherReasonTextOverCharacterLimit,
				otherReasonId: otherReasonId
			});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single incomplete reason was provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonsWithoutOther[0].id,
				otherReason: '',
				otherReasonId: otherReasonId
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons were provided', async () => {
			expect(lpaQPostResponse.statusCode).toBe(302);

			const otherReasonTextWithinCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS);
			const response = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: lpaQuestionnaireIncompleteReasons.map((reason) => reason.id),
				otherReason: otherReasonTextWithinCharacterLimit,
				otherReasonId: otherReasonId
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
				incompleteReason: incompleteReasonIdsWithoutOther,
				otherReasonId
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
				incompleteReason: incompleteReasonIdsWithoutOther,
				otherReasonId
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
				incompleteReason: incompleteReasonIdsWithoutOther,
				otherReasonId
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(`${baseUrl}/check-your-answers`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appeals-service/appeal-details/1/lpa-questionnaire/2/check-your-answers', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/lpa-questionnaire-incomplete-reasons')
				.reply(200, lpaQuestionnaireIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should send a patch request to the LPA questionnaire API endpoint and render the decision incomplete confirmation page, if posted outcome was "incomplete"', async () => {
			// post to LPA questionnaire page controller is necessary to set required data in the session
			const lpaQPostResponse = await request.post(baseUrl).send({
				'review-outcome': 'incomplete'
			});

			expect(lpaQPostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request.post(`${baseUrl}/incomplete`).send({
				incompleteReason: incompleteReasonIdsWithoutOther,
				otherReasonId
			});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedlpaQuestionnairesEndpoint = nock('http://test/')
				.patch('/appeals/1/lpa-questionnaires/2')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(`${baseUrl}/check-your-answers`);

			expect(mockedlpaQuestionnairesEndpoint.isDone()).toBe(true);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

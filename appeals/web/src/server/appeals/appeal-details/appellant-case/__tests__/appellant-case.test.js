import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import {
	appellantCaseData,
	appellantCaseInvalidReasons,
	appellantCaseIncompleteReasons
} from '#testing/app/fixtures/referencedata.js';
import { appellantCaseReviewOutcomes } from '#appeals/appeal.constants.js';
import { TEXTAREA_MAXIMUM_CHARACTERS } from '#lib/validators/textarea-validator.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const appellantCasePagePath = '/appellant-case';
const invalidReasonPagePath = '/invalid';
const incompleteReasonPagePath = '/incomplete';
const updateDueDatePagePath = '/date';
const checkYourAnswersPagePath = '/check-your-answers';
const otherReasonId = appellantCaseInvalidReasons.find(
	(reason) => reason.name.toLowerCase() === 'other'
)?.id;
const invalidReasonsWithoutOther = appellantCaseInvalidReasons.filter(
	(reason) => reason.name.toLowerCase() !== 'other'
);
const invalidReasonIdsWithoutOther = invalidReasonsWithoutOther.map((reason) => reason.id);
const incompleteReasonsWithoutOther = appellantCaseIncompleteReasons.filter(
	(reason) => reason.name.toLowerCase() !== 'other'
);
const incompleteReasonIdsWithoutOther = incompleteReasonsWithoutOther.map((reason) => reason.id);

describe('appellant-case', () => {
	beforeEach(() => {
		installMockApi();
	});
	afterEach(teardown);

	describe('GET /appellant-case', () => {
		it('should render the appellant case page', async () => {
			const response = await request.get(`${baseUrl}/1${appellantCasePagePath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the appellant case page with the expected error message if no review outcome was selected', async () => {
			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: ''
			});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should send a patch request to the appellant-cases API endpoint and redirect to the confirmation page if selected review outcome value is "valid"', async () => {
			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: appellantCaseReviewOutcomes.valid });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: appellantCaseReviewOutcomes.valid
			});

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the invalid reason page if selected review outcome value is "invalid"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: appellantCaseReviewOutcomes.invalid });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: appellantCaseReviewOutcomes.invalid
			});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/invalid', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the invalid reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.invalid
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/invalid', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: appellantCaseReviewOutcomes.invalid
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the invalid reason page with the expected error message if no invalid reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					otherReason: '',
					otherReasonId: otherReasonId
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if "other" reason was selected but no "otherReason" was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					invalidReason: otherReasonId,
					otherReason: '',
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if "other" reason text exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const otherReasonTextOverCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS + 1);
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					invalidReason: otherReasonId,
					otherReason: otherReasonTextOverCharacterLimit,
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single invalid reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutOther[0].id,
					otherReason: '',
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple invalid reasons were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const otherReasonTextWithinCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS);
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					invalidReason: appellantCaseInvalidReasons.map((reason) => reason.id),
					otherReason: otherReasonTextWithinCharacterLimit,
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/incomplete', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the incomplete reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.incomplete
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/incomplete', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: appellantCaseReviewOutcomes.incomplete
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the incomplete reason page with the expected error message if no incomplete reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`)
				.send({
					otherReason: '',
					otherReasonId: otherReasonId
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if "other" reason was selected but no "otherReason" was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`)
				.send({
					incompleteReason: otherReasonId,
					otherReason: '',
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if "other" reason text exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const otherReasonTextOverCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS + 1);
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`)
				.send({
					incompleteReason: otherReasonId,
					otherReason: otherReasonTextOverCharacterLimit,
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single incomplete reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutOther[0].id,
					otherReason: '',
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const otherReasonTextWithinCharacterLimit = 'a'.repeat(TEXTAREA_MAXIMUM_CHARACTERS);
			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}`)
				.send({
					incompleteReason: appellantCaseIncompleteReasons.map((reason) => reason.id),
					otherReason: otherReasonTextWithinCharacterLimit,
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/incomplete/date', () => {
		beforeEach(() => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the update due date page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.incomplete
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteReasonPagePath}`)
				.send({
					incompleteReason: incompleteReasonIdsWithoutOther,
					otherReasonId
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/incomplete/date', () => {
		/**
		 * @type {import("superagent").Response}
		 */
		let appellantCasePostResponse;
		/**
		 * @type {import("superagent").Response}
		 */
		let incompleteReasonPostResponse;

		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);

			// post to appellant case page controller is necessary to set required data in the session
			appellantCasePostResponse = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: appellantCaseReviewOutcomes.incomplete
			});

			// post to incomplete reason page controller is necessary to set required data in the session
			incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteReasonPagePath}`)
				.send({
					incompleteReason: incompleteReasonIdsWithoutOther,
					otherReasonId
				});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the update date page with the expected error message if no date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '',
					'due-date-month': '',
					'due-date-year': ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid day was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '0',
					'due-date-month': '1',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '32',
					'due-date-month': '1',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': 'first',
					'due-date-month': '1',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid month was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '0',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '13',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': 'dec',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid year was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': '23'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': 'abc'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '29',
					'due-date-month': '2',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(200);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a valid date was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteReasonPagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '12',
					'due-date-year': '2023'
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
			nock('http://test/')
				.get('/appeals/appellant-case-incomplete-reasons')
				.reply(200, appellantCaseIncompleteReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check your answers page with the expected content if outcome is "invalid" and required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.invalid
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidReasonPagePath}`)
				.send({
					invalidReason: invalidReasonIdsWithoutOther,
					otherReasonId
				});

			expect(invalidReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the check your answers page with the expected content if outcome is "incomplete" and required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.incomplete
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteReasonPagePath}`)
				.send({
					incompleteReason: incompleteReasonIdsWithoutOther,
					otherReasonId
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /appellant-case/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should send a patch request to the appellant-cases API endpoint and render the decision invalid confirmation page, if posted outcome was "invalid"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.invalid
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidReasonPagePath}`)
				.send({
					invalidReason: invalidReasonIdsWithoutOther,
					otherReasonId
				});

			expect(invalidReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: appellantCaseReviewOutcomes.invalid });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should send a patch request to the appellant-cases API endpoint and render the decision incomplete confirmation page, if posted outcome was "incomplete"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: appellantCaseReviewOutcomes.incomplete
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteReasonPagePath}`)
				.send({
					incompleteReason: incompleteReasonIdsWithoutOther,
					otherReasonId
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: appellantCaseReviewOutcomes.incomplete });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import {
	appellantCaseData,
	appellantCaseInvalidReasons,
	appellantCaseIncompleteReasons
} from '#testing/app/fixtures/referencedata.js';
import { textInputCharacterLimits } from '../../../appeal.constants.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const appellantCasePagePath = '/appellant-case';
const validOutcomePagePath = '/valid';
const invalidOutcomePagePath = '/invalid';
const incompleteOutcomePagePath = '/incomplete';
const updateDueDatePagePath = '/date';
const checkYourAnswersPagePath = '/check-your-answers';
const confirmationPagePath = '/confirmation';

const invalidReasonsWithoutText = appellantCaseInvalidReasons.filter(
	(reason) => reason.hasText === false
);
const invalidReasonsWithText = appellantCaseInvalidReasons.filter(
	(reason) => reason.hasText === true
);
const incompleteReasonsWithoutText = appellantCaseIncompleteReasons.filter(
	(reason) => reason.hasText === false
);
const incompleteReasonsWithText = appellantCaseIncompleteReasons.filter(
	(reason) => reason.hasText === true
);

const invalidReasonsWithoutTextIds = invalidReasonsWithoutText.map((reason) => reason.id);
const invalidReasonsWithTextIds = invalidReasonsWithText.map((reason) => reason.id);
const incompleteReasonsWithoutTextIds = incompleteReasonsWithoutText.map((reason) => reason.id);
const incompleteReasonsWithTextIds = incompleteReasonsWithText.map((reason) => reason.id);

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
				.reply(200, { validationOutcome: 'valid' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'valid'
			});

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the invalid reason page if selected review outcome value is "invalid"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'invalid' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'invalid'
			});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the incomplete reason page if selected review outcome value is "incomplete"', async () => {
			nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(`${baseUrl}/1${appellantCasePagePath}`).send({
				reviewOutcome: 'incomplete'
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
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the invalid reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`
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
				reviewOutcome: 'invalid'
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the invalid reason page with the expected error message if no invalid reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property is an empty string', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property is an empty array', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties are empty strings', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties are empty arays', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if a single invalid reason with text was provided but the matching text property exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the invalid reason page with the expected error message if multiple invalid reasons with text were provided but any of the matching text properties exceed the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single invalid reason without text was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds[0]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if a single invalid reason with text within the character limit was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithTextIds[0],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple invalid reasons without text were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple invalid reasons with text within the character limit were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					],
					[`invalidReason-${invalidReasonsWithTextIds[1]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
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
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the incomplete reason page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`
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
				reviewOutcome: 'incomplete'
			});
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should re-render the incomplete reason page with the expected error message if no incomplete reason was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty string', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property is an empty array', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty strings', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties are empty arrays', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: []
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if a single incomplete reason with text was provided but the matching text property exceeds the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the incomplete reason page with the expected error message if multiple incomplete reasons with text were provided but any of the matching text properties exceed the character limit', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: 'a'.repeat(
						textInputCharacterLimits.appellantCaseNotValidReason + 1
					)
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should redirect to the check and confirm page if a single incomplete reason without text was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page a single incomplete reason with text within the character limit was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithTextIds[0],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					]
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons without text were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds
				});

			expect(response.statusCode).toBe(302);
		});

		it('should redirect to the check and confirm page if multiple incomplete reasons with text within the character limit were provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason)
					],
					[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: [
						'a'.repeat(textInputCharacterLimits.appellantCaseNotValidReason),
						'test reason text 3'
					]
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
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the update due date page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
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
				reviewOutcome: 'incomplete'
			});

			// post to incomplete reason page controller is necessary to set required data in the session
			incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '',
					'due-date-month': '',
					'due-date-year': ''
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if provided date is not in the future', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '1',
					'due-date-year': '2000'
				});

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the update date page with the expected error message if an invalid day was provided', async () => {
			expect(appellantCasePostResponse.statusCode).toBe(302);
			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			let response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '0',
					'due-date-month': '1',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '32',
					'due-date-month': '1',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': 'first',
					'due-date-month': '1',
					'due-date-year': '3000'
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '0',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			let element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '13',
					'due-date-year': '3000'
				});

			expect(response.statusCode).toBe(200);

			element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();

			response = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': 'dec',
					'due-date-year': '3000'
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '29',
					'due-date-month': '2',
					'due-date-year': '3000'
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
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '12',
					'due-date-year': '3000'
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
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidOutcomePagePath}`)
				.send({
					invalidReason: [invalidReasonsWithTextIds[0], invalidReasonsWithTextIds[1]],
					[`invalidReason-${invalidReasonsWithTextIds[0]}`]: 'test reason text 1',
					[`invalidReason-${invalidReasonsWithTextIds[1]}`]: [
						'test reason text 1',
						'test reason text 2'
					]
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
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: [incompleteReasonsWithTextIds[0], incompleteReasonsWithTextIds[1]],
					[`incompleteReason-${incompleteReasonsWithTextIds[0]}`]: [
						'test reason text 1',
						'test reason text 2'
					],
					[`incompleteReason-${incompleteReasonsWithTextIds[1]}`]: 'test reason text 1'
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			// post to update date page controller is necessary to set updated due date
			const updateDateResponse = await request
				.post(
					`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${updateDueDatePagePath}`
				)
				.send({
					'due-date-day': '1',
					'due-date-month': '12',
					'due-date-year': '3000'
				});

			expect(updateDateResponse.statusCode).toBe(302);

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

		it('should send a patch request to the appellant-cases API endpoint and redirect to the decision invalid confirmation page, if posted outcome was "invalid"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to invalid reason page controller is necessary to set required data in the session
			const invalidReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${invalidOutcomePagePath}`)
				.send({
					invalidReason: invalidReasonsWithoutTextIds[0]
				});

			expect(invalidReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'invalid' });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});

		it('should send a patch request to the appellant-cases API endpoint and redirect to the decision incomplete confirmation page, if posted outcome was "incomplete"', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			// post to incomplete reason page controller is necessary to set required data in the session
			const incompleteReasonPostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}/${incompleteOutcomePagePath}`)
				.send({
					incompleteReason: incompleteReasonsWithoutTextIds[0]
				});

			expect(incompleteReasonPostResponse.statusCode).toBe(302);

			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/valid/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${validOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome valid confirmation page if required data is present in the session', async () => {
			const mockedAppellantCasesEndpoint = nock('http://test/')
				.patch('/appeals/1/appellant-cases/0')
				.reply(200, { validationOutcome: 'incomplete' });

			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'valid'
				});

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);
			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${validOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/invalid/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome invalid confirmation page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${invalidOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /appellant-case/incomplete/confirmation', () => {
		it('should render the 500 error page if required data is not present in the session', async () => {
			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the outcome incomplete confirmation page if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'incomplete'
				});

			expect(appellantCasePostResponse.statusCode).toBe(302);

			const response = await request.get(
				`${baseUrl}/1${appellantCasePagePath}${incompleteOutcomePagePath}${confirmationPagePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

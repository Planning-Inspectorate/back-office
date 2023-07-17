import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';
import {
	appellantCaseData,
	appellantCaseInvalidReasons
} from '../../../../../testing/app/fixtures/referencedata.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const appellantCasePagePath = '/appellant-case';
const invalidReasonPagePath = '/invalid';
const checkYourAnswersPagePath = '/check-your-answers';
const otherReasonId = appellantCaseInvalidReasons.find(
	(reason) => reason.name.toLowerCase() === 'other'
)?.id;
const invalidReasonsWithoutOther = appellantCaseInvalidReasons.filter(
	(reason) => reason.name.toLowerCase() !== 'other'
);
const invalidReasonIdsWithoutOther = invalidReasonsWithoutOther.map((reason) => reason.id);

describe('appellant-case', () => {
	beforeEach(() => {
		installMockApi();
	});
	afterEach(teardown);

	describe('GET /appellant-case', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1/appellant-cases/0').reply(200, appellantCaseData);
		});

		afterEach(() => {
			nock.cleanAll();
		});
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

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
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
					reviewOutcome: 'invalid'
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
				reviewOutcome: 'invalid'
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

			const response = await request
				.post(`${baseUrl}/1${appellantCasePagePath}${invalidReasonPagePath}`)
				.send({
					invalidReason: appellantCaseInvalidReasons.map((reason) => reason.id),
					otherReason: 'test other reason',
					otherReasonId: otherReasonId
				});

			expect(response.statusCode).toBe(302);
		});
	});

	describe('GET /appellant-case/check-your-answers', () => {
		beforeEach(async () => {
			nock('http://test/')
				.get('/appeals/appellant-case-invalid-reasons')
				.reply(200, appellantCaseInvalidReasons);
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

		it('should render the check your answers page with the expected content if required data is present in the session', async () => {
			// post to appellant case page controller is necessary to set required data in the session
			const appellantCasePostResponse = await request
				.post(`${baseUrl}/1${appellantCasePagePath}`)
				.send({
					reviewOutcome: 'invalid'
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
					reviewOutcome: 'invalid'
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
				.reply(200, { validationOutcome: 'invalid' });

			const response = await request.post(
				`${baseUrl}/1${appellantCasePagePath}${checkYourAnswersPagePath}`
			);

			expect(mockedAppellantCasesEndpoint.isDone()).toBe(true);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

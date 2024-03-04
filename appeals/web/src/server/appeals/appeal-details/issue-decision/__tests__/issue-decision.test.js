import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import { mapDecisionOutcome } from '../issue-decision.mapper.js';
import { documentFileInfo, inspectorDecisionData } from '#testing/appeals/appeals.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';
const issueDecisionPath = '/issue-decision';
const decisionPath = '/decision';
const decisionLetterUploadPath = '/decision-letter-upload';
const decisionLetterDatePath = '/decision-letter-date';
const checkYourDecisionPath = '/check-your-decision';

describe('issue-decision', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /change-appeal-type/appeal-type', () => {
		it('should render the decision page', async () => {
			const response = await request.get(`${baseUrl}/1${issueDecisionPath}/${decisionPath}`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
	describe('POST /:appealId/issue-decision/decision', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, inspectorDecisionData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});
		afterEach(teardown);

		it('should render the decision details correctly', async () => {
			const mockAppealId = '1';
			const mockAppealDecision = 'allowed';
			const response = await request
				.post(`${baseUrl}/${mockAppealId}/issue-decision/decision`)
				.send({ decision: mockAppealDecision })
				.expect(302);

			expect(response.headers.location).toBe(
				`/appeals-service/appeal-details/${mockAppealId}/issue-decision/decision-letter-upload`
			);
		});

		it('should send the decision details for invalid, and redirect correctly', async () => {
			const mockAppealId = '1';
			const mockAppealDecision = 'Invalid';
			const response = await request
				.post(`${baseUrl}/${mockAppealId}/issue-decision/decision`)
				.send({ decision: mockAppealDecision })
				.expect(302);

			expect(response.headers.location).toBe(
				`/appeals-service/appeal-details/${mockAppealId}/issue-decision/invalid-reason`
			);
		});
	});

	describe('GET /change-appeal-type/decision-letter-upload', () => {
		it('should render the decision letter upload page', async () => {
			const response = await request.get(
				`${baseUrl}/1${issueDecisionPath}/${decisionLetterUploadPath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /change-appeal-type/decision-letter-date', () => {
		it('should render the decision letter date page', async () => {
			const response = await request.get(
				`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /:appealId/issue-decision/decision-letter-date', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, inspectorDecisionData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});
		afterEach(teardown);

		it('should render the decision letter date correctly', async () => {
			const mockAppealId = '1';
			const mockLetterDecisionDate = {
				'decision-letter-date-day': '1',
				'decision-letter-date-month': '1',
				'decision-letter-date-year': '2023'
			};
			const response = await request
				.post(`${baseUrl}/${mockAppealId}/issue-decision/decision-letter-date`)
				.send(mockLetterDecisionDate)
				.expect(302);

			expect(response.headers.location).toBe(
				`/appeals-service/appeal-details/${mockAppealId}/issue-decision/check-your-decision`
			);
		});

		it('should re-render the  decision letter date page with an error message if the provided date day is invalid', async () => {
			const response = await request
				.post(`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`)
				.send({
					'decision-letter-date-day': 0,
					'decision-letter-date-month': 11,
					'decision-letter-date-year': 2024
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the  decision letter date page with an error message if the provided date month is invalid', async () => {
			const response = await request
				.post(`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`)
				.send({
					'decision-letter-date-day': 1,
					'decision-letter-date-month': 0,
					'decision-letter-date-year': 2024
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the  decision letter date page with an error message if the provided date year is invalid', async () => {
			const response = await request
				.post(`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`)
				.send({
					'decision-letter-date-day': 1,
					'decision-letter-date-month': 11,
					'decision-letter-date-year': 'x'
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the  decision letter date page with an error message if the provided date year is not in the past', async () => {
			teardown;
			const response = await request
				.post(`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`)
				.send({
					'decision-letter-date-day': 1,
					'decision-letter-date-month': 11,
					'decision-letter-date-year': 3000
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should re-render the  decision letter date page with an error message if the provided date is not a business day', async () => {
			teardown;
			const response = await request
				.post(`${baseUrl}/1${issueDecisionPath}/${decisionLetterDatePath}`)
				.send({
					'decision-letter-date-day': 25,
					'decision-letter-date-month': 12,
					'decision-letter-date-year': 2024
				});

			expect(response.statusCode).toBe(200);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /invalid-reason', () => {
		it('should render the invalid reason page', async () => {
			const mockAppealId = '1';
			const response = await request.get(
				`${baseUrl}/${mockAppealId}/issue-decision/invalid-reason`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('POST /invalid-reason', () => {
		it('should process the invalid reason page and redirect', async () => {
			const mockAppealId = '1';
			const mockReason = 'Reasons!';
			const response = await request
				.post(`${baseUrl}/${mockAppealId}/issue-decision/invalid-reason`)
				.send({ decisionInvalidReason: mockReason })
				.expect(302);

			expect(response.headers.location).toBe(
				`/appeals-service/appeal-details/${mockAppealId}/issue-decision/check-invalid-decision`
			);
		});
	});

	describe('GET /change-appeal-type/check-your-decision', () => {
		it('should render the check your decision letter page', async () => {
			const response = await request.get(
				`${baseUrl}/1${issueDecisionPath}/${checkYourDecisionPath}`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /check-invalid-decision', () => {
		it('should render the check your answer page for invalid decision', async () => {
			const mockAppealId = '1';
			const mockReason = 'Reasons!';
			const invalidReasonResponse = await request
				.post(`${baseUrl}/${mockAppealId}/issue-decision/invalid-reason`)
				.send({ decisionInvalidReason: mockReason })
				.expect(302);

			expect(invalidReasonResponse.headers.location).toBe(
				`/appeals-service/appeal-details/${mockAppealId}/issue-decision/check-invalid-decision`
			);

			const response = await request.get(`${baseUrl}/1${issueDecisionPath}/check-invalid-decision`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

describe('mapDecisionOutcome', () => {
	it('should map "allowed" to "Allowed"', () => {
		const result = mapDecisionOutcome('allowed');
		expect(result).toBe('Allowed');
	});

	it('should map "dismissed" to "Dismissed"', () => {
		const result = mapDecisionOutcome('dismissed');
		expect(result).toBe('Dismissed');
	});

	it('should map "split" to "Split decision"', () => {
		const result = mapDecisionOutcome('split');
		expect(result).toBe('Split decision');
	});

	it('should return an empty string for undefined outcome', () => {
		const result = mapDecisionOutcome(undefined);
		expect(result).toBe('');
	});

	it('should return an empty string for invalid outcome', () => {
		const result = mapDecisionOutcome('invalid');
		expect(result).toBe('');
	});
});

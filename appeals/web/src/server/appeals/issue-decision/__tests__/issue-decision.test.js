import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '#testing/index.js';
import { mapDecisionOutcome } from '../issue-decision.mapper.js';
import { documentFileInfo, inspectorDecisionData } from '#testing/appeals/appeals.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeal-details';

describe('issue-decision', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('POST /:appealId/issue-decision/decision', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, inspectorDecisionData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		afterEach(() => {
			nock.cleanAll();
		});

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
	});

	describe('POST /:appealId/issue-decision/decision-letter-date', () => {
		beforeEach(() => {
			nock('http://test/').get('/appeals/1').reply(200, inspectorDecisionData);
			nock('http://test/').get('/appeals/1/documents/1').reply(200, documentFileInfo);
		});

		afterEach(() => {
			nock.cleanAll();
		});

		it('should render the decision details correctly', async () => {
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

	it('should map "split decision" to "Split-decision"', () => {
		const result = mapDecisionOutcome('split decision');
		expect(result).toBe('Split-decision');
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

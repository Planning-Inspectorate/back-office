import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../../testing/index.js';
import { representationFixture } from '../../../__fixtures__/representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockCaseReference = { title: 'mock title', status: 'in test', reference: 'mock reference' };
const nocks = () => {
	nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
	nock('http://test/').get('/applications/1/representations/1').reply(200, representationFixture);
};

describe('Representation address details page', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/1/relevant-representations/check-answers?repId=1';

	describe('GET /applications-service/case/1/relevant-representations/check-answers', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should have required fields', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Organisation name');
			expect(element.innerHTML).toContain('Full name');
			expect(element.innerHTML).toContain('Job title');
			expect(element.innerHTML).toContain('Email address');
			expect(element.innerHTML).toContain('Address');
			expect(element.innerHTML).toContain('Preferred contact method');
			expect(element.innerHTML).toContain('Type');
			expect(element.innerHTML).toContain('Under 18');
			expect(element.innerHTML).toContain('Representation on behalf of');
			expect(element.innerHTML).toContain('Agent details');
			expect(element.innerHTML).toContain('Representation');
			expect(element.innerHTML).toContain('Date received');
			expect(element.innerHTML).toContain('Original representation');
		});
	});

	describe('POST /applications-service/case/1/relevant-representations/check-answers', () => {
		describe('and there are errors', () => {
			beforeEach(async () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseReference);
				nock('http://test/')
					.get('/applications/1/representations/1')
					.reply(200, {
						...representationFixture,
						type: ''
					});
			});

			it('should render the page with errors', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
			});
		});

		describe('and there are no errors', () => {
			beforeEach(async () => {
				nocks();
				nock('http://test/')
					.patch(`/applications/1/representations/1`, {
						status: 'AWAITING_REVIEW'
					})
					.reply(200, { message: 'ok' });
			});

			it('should redirect to the next page', async () => {
				const response = await request.post(baseUrl);

				expect(response?.headers?.location).toEqual(
					'/applications-service/case/1/relevant-representations'
				);
			});
		});
	});
});

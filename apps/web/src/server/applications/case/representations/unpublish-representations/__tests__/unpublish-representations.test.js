// @ts-nocheck
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/applications-service/case/1/relevant-representations/unpublish-representations';

const mockCaseData = { title: 'mock title' };
const mockRepresentations = {
	items: [
		{ id: 1, status: 'PUBLISHED' },
		{ id: 2, status: 'PUBLISHED' }
	]
};
const publishedRepIds = [1, 2];

describe('unpublish-representations.controller (integration)', () => {
	beforeEach(installMockApi);
	afterEach(() => {
		teardown();
		nock.cleanAll();
	});

	describe('GET /applications-service/:caseId/relevant-representations/unpublish-representations', () => {
		it('should render the page with the correct data', async () => {
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').reply(200, mockRepresentations);
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);
			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('mock title');
		});

		it('should redirect to error page if case details missing', async () => {
			nock('http://test/').get('/applications/1').reply(200, {});
			const response = await request.get(baseUrl);
			expect(response.headers.location).toContain('publishing-error');
		});

		it('should redirect to error page if representations fetch fails', async () => {
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').replyWithError('fail');
			const response = await request.get(baseUrl);
			expect(response.headers.location).toContain('publishing-error');
		});

		it('should redirect to error page if representations missing', async () => {
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').reply(200, {});
			const response = await request.get(baseUrl);
			expect(response.headers.location).toContain('publishing-error');
		});
	});

	describe('POST /applications-service/:caseId/relevant-representations/unpublish-representations', () => {
		it('should redirect to relevant-representations if no publishedRepIds', async () => {
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').reply(200, { items: [] });
			const response = await request.post(baseUrl).send({});
			expect(response.headers.location).toContain(
				'/applications-service/case/1/relevant-representations'
			);
		});

		it('should batch unpublish and redirect with count', async () => {
			const patchNock = nock('http://test/')
				.patch('/applications/1/representations/unpublish')
				.reply(200, { unpublished: publishedRepIds });
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').reply(200, mockRepresentations);
			const response = await request.post(baseUrl).send({});
			expect(patchNock.isDone()).toBe(true);
			expect(response.headers.location).toContain(
				'/applications-service/case/1/relevant-representations?unpublished=2'
			);
		});

		it('should redirect to error page on service error', async () => {
			const patchNock = nock('http://test/')
				.patch('/applications/1/representations/unpublish')
				.replyWithError('fail');
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/').get('/applications/1/representations').reply(200, mockRepresentations);
			const response = await request.post(baseUrl).send({});
			expect(patchNock.isDone()).toBe(true);
			expect(response.headers.location).toContain('publishing-error');
		});
	});
});

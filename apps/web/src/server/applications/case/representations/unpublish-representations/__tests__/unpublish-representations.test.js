import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const baseUrl = '/applications-service/case/1/relevant-representations/unpublish-representations';

const mockCaseData = {
	title: 'mock title'
};

const unpublishableRepresentationsFixture = {
	count: 3
};

describe('unpublish-representations', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	describe('GET /applications-service/:caseId/relevant-representations/unpublish-representations', () => {
		describe('and the unpublishable rep count is > 0', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/unpublish')
					.reply(200, unpublishableRepresentationsFixture);
			};
			nocks();

			it('should render the page with the unpublish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Unpublish all representations');
			});
		});

		describe('and the unpublishable rep count is 0', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/unpublish')
					.reply(200, { count: 0 });
			};
			nocks();

			it('should render the page without the unpublish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('Unpublish all representations');
			});
		});
	});

	describe('POST /applications-service/:caseId/relevant-representations/unpublish-representations', () => {
		describe('unsuccessful', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.patch('/applications/1/representations/unpublish')
					.reply(500, { error: 'Internal server error' });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to the error page', async () => {
				const response = await request.post(baseUrl);

				expect(response?.headers?.location).toContain('unpublishing-error');
			});
		});

		describe('successful', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.patch('/applications/1/representations/unpublish')
					.reply(200, { count: 3 });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to the correct URL', async () => {
				const response = await request.post(baseUrl);

				expect(response?.headers?.location).toContain(
					'/applications-service/case/1/relevant-representations?unpublished=3'
				);
			});
		});
	});
});

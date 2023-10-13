import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const baseUrl =
	'/applications-service/case/1/relevant-representations/publish-valid-representations';

const mockCaseData = {
	title: 'mock title'
};

describe('publish-valid-representations', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	describe('GET /applications-service/:caseId/relevant-representations/publish-valid-representations', () => {
		describe('and the publishable rep count is > 0', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/publishable')
					.reply(200, { itemCount: 1 });
			};
			nocks();

			it('should render the page with the publish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Publish documents');
			});
		});

		describe('and the publishable rep count is 0', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/publishable')
					.reply(200, { itemCount: 0 });
			};
			nocks();

			it('should render the page with the publish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('Publish documents');
			});
		});
	});
});

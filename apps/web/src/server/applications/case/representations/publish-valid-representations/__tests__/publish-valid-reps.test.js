import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import {
	publishableRepresentationsFixture,
	generateAdditionalItems
} from '../../__fixtures__/publishable-representations.fixture.js';

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
					.reply(200, publishableRepresentationsFixture);
			};
			nocks();

			it('should render the page with the publish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Publish representations');
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

			it('should render the page without the publish button', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('Publish representations');
			});
		});
	});

	describe('POST /applications-service/:caseId/relevant-representations/publish-valid-representations', () => {
		describe('unsuccessful', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/publishable')
					.reply(200, publishableRepresentationsFixture);
				nock('http://test/')
					.patch('/applications/1/representations/publish')
					.reply(200, { publishedRepIds: [] });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to the error page', async () => {
				const response = await request.post(baseUrl).send({ representationId: ['1', '2', '3'] });

				expect(response?.headers?.location).toContain('publishing-error');
			});
		});

		describe('successful', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/publishable')
					.reply(200, publishableRepresentationsFixture);
				nock('http://test/')
					.patch('/applications/1/representations/publish')
					.reply(200, { publishedRepIds: [1, 2, 3] });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to the correct URL', async () => {
				const response = await request.post(baseUrl).send({ representationId: ['1', '2', '3'] });

				expect(response?.headers?.location).toContain(
					'/applications-service/case/1/relevant-representations?published=3'
				);
			});
		});
		describe('and publish api calls are batched', () => {
			const largeNumberOfReps = generateAdditionalItems(publishableRepresentationsFixture, 1000);
			const firstBatchOfIds = Array.from({ length: 1000 }, (i) => (i + 1).toString());

			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/publishable')
					.reply(200, largeNumberOfReps);
				nock('http://test/')
					.patch('/applications/1/representations/publish')
					.reply(200, { publishedRepIds: firstBatchOfIds });
				nock('http://test/')
					.patch('/applications/1/representations/publish')
					.reply(200, { publishedRepIds: [1001, 1002, 1003] });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to the correct URL', async () => {
				const ids = Array.from({ length: 1003 }, (i) => (i + 1).toString());
				const response = await request.post(baseUrl).send({ representationId: ids });

				expect(response?.headers?.location).toContain(
					'/applications-service/case/1/relevant-representations?published=1003'
				);
			});
		});
	});
});

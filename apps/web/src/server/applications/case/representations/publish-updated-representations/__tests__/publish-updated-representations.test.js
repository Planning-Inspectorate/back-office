import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import { publishableRepresentationsFixture } from '../../__fixtures__/publishable-representations.fixture.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const baseUrl =
	'/applications-service/case/1/relevant-representations/select-representations-for-publishing';

const mockCaseData = {
	title: 'mock title'
};

describe('publish-updated-representations.controller', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	describe('GET /applications-service/:caseId/relevant-representations/select-representations-for-publishing', () => {
		const nocks = () => {
			nock('http://test/').get('/applications/1').reply(200, mockCaseData);
			nock('http://test/')
				.get('/applications/1/representations/publishable')
				.reply(200, publishableRepresentationsFixture);
		};
		nocks();

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Select representations for publishing');
			expect(element.innerHTML).toContain('The queue contains <strong>3</strong> representations.');
		});
	});

	describe('POST /applications-service/:caseId/relevant-representations/select-representations-for-publishing', () => {
		describe('unsuccessful', () => {
			const nocks = () => {
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
	});
});

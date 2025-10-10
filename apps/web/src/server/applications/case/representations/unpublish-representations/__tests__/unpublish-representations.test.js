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
	itemCount: 3,
	items: [
		{
			id: 1,
			reference: 'mock-reference-1',
			status: 'PUBLISHED',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		},
		{
			id: 2,
			reference: 'mock-reference-2',
			status: 'PUBLISHED',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		},
		{
			id: 3,
			reference: 'mock-reference-3',
			status: 'PUBLISHED',
			redacted: true,
			received: '2023-10-10T10:47:21.846Z',
			firstName: 'mock name',
			lastName: 'mock last name',
			organisationName: 'mock org'
		}
	]
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
					.reply(200, { itemCount: 0, items: [] });
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
					.get('/applications/1/representations/unpublish')
					.reply(200, unpublishableRepresentationsFixture);
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
					.get('/applications/1/representations/unpublish')
					.reply(200, unpublishableRepresentationsFixture);
				nock('http://test/')
					.patch('/applications/1/representations/unpublish')
					.reply(200, { unpublishedRepIds: [1, 2, 3] });
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

		describe('when no representations to unpublish', () => {
			const nocks = () => {
				nock('http://test/').get('/applications/1').reply(200, mockCaseData);
				nock('http://test/')
					.get('/applications/1/representations/unpublish')
					.reply(200, { itemCount: 0, items: [] });
			};

			beforeEach(async () => {
				nocks();
			});

			it('should redirect to relevant representations page', async () => {
				const response = await request.post(baseUrl);

				expect(response?.headers?.location).toContain(
					'/applications-service/case/1/relevant-representations'
				);
			});
		});
	});
});

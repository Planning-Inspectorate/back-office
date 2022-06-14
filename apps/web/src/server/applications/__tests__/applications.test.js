import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { applicationSummaries } from '../../../../testing/applications/applications.js';
import { createTestApplication } from '../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

describe('applications', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /case-officer', () => {
		const baseUrl = '/applications-service/case-officer';

		it('should render a placeholder when there are no open applications', async () => {
			nock('http://test/').get('/applications/case-officer').reply(200, {
				items: []
			});

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the open applications belonging to the user', async () => {
			nock('http://test/')
				.get('/applications/case-officer')
				.reply(200, { items: applicationSummaries });

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /case-admin-officer', () => {
		const baseUrl = '/applications-service/case-admin-officer';

		it('should render a placeholder when there are no open applications', async () => {
			nock('http://test/').get('/applications/case-admin-officer').reply(200, {
				items: []
			});

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the open applications belonging to the user', async () => {
			nock('http://test/')
				.get('/applications/case-admin-officer')
				.reply(200, { items: applicationSummaries });

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /inspector', () => {
		const baseUrl = '/applications-service/inspector';

		it('should render a placeholder when there are no open applications', async () => {
			nock('http://test/').get('/applications/inspector').reply(200, {
				items: []
			});

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the open applications belonging to the user', async () => {
			nock('http://test/')
				.get('/applications/inspector')
				.reply(200, { items: applicationSummaries });

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureApplications } from '../../../../../../../testing/applications/fixtures/applications.js';
import { fixtureDocumentationCategory } from '../../../../../../../testing/applications/fixtures/options-item.js';
import { createTestApplication } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, []);

	nock('http://test/').get('/applications/123').reply(200, fixtureApplications[3]);

	nock('http://test/').get('/applications/123/documents').reply(200, fixtureDocumentationCategory);
};

describe('applications documentation', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
	});

	const baseUrl = '/applications-service/case/123';

	describe('GET /case/123/project-documentation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-documentation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('All documents');
		});
	});
});

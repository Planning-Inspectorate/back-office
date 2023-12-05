import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

describe('applications', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		const baseUrl = '/applications-service/';

		it('should render a placeholder when there are no open applications', async () => {
			nock('http://test/').get('/applications/').reply(200, []);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the open applications belonging to the user', async () => {
			nock('http://test/').get('/applications/case-team').reply(200, fixtureCases);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render the `create new case` button', async () => {
			nock('http://test/').get('/applications/case-team').reply(200, fixtureCases);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('Create new case');
		});
	});
});

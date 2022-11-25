import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, {});
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[5]);
};

describe('applications view case summary', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
	});

	const baseUrl = '/applications-service/case/123';

	describe('GET /case/123', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Summary information');
		});
	});

	describe('GET /case/123/project-information', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-information`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Project details');
		});
	});
});

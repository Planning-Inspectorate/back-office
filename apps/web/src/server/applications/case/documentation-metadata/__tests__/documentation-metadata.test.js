import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, {});
};

describe('Edit applications documentation metadata', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/project-documentation/18/document/456/edit';

	describe('Edit name', () => {
		describe('GET /case/123/project-documentation/18/document/456/edit/name', () => {
			describe('If user is inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/inspector').reply(200, {});

					await request.get('/applications-service/inspector');
				});

				it('should not render the page', async () => {
					const response = await request.get(`${baseUrl}/name`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('If user is not inspector', () => {
				beforeEach(async () => {
					nocks();

					await request.get('/applications-service/case-team');
				});

				it('should render the page', async () => {
					const response = await request.get(`${baseUrl}/name`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Enter file name');
				});
			});
		});
	});
});

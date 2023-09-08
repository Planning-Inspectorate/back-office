import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';

import { fixtureCases } from '../../../../../../testing/applications/applications.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, []);
	nock('http://test/').get('/applications/inspector').reply(200, []);

	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
};

describe('S51 Advice', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/key-dates';

	describe('Key dates page', () => {
		describe('GET /case/123/key-dates/', () => {
			describe('If user is inspector', () => {
				it('should not render the page', async () => {
					await request.get('/applications-service/inspector');

					const response = await request.get(`${baseUrl}`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('If user is not inspector', () => {
				it('should render the page', async () => {
					await request.get('/applications-service/case-team');

					const response = await request.get(`${baseUrl}`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Provide details on dates');
				});
			});
		});
	});
});

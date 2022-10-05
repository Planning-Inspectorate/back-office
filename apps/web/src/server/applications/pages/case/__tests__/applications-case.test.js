import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestApplication } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestApplication();
const request = supertest(app);
const successGetResponse = { id: 1, applicants: [{ id: 1 }] };

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, []);
	nock('http://test/')
		.get(/\/applications\/123(.*)/g)
		.times(2)
		.reply(200, successGetResponse);
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

	const baseUrl = '/applications-service/create-new-case/123';

	describe('GET /case', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});

	describe('GET /create-new-case/project-information', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-information`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

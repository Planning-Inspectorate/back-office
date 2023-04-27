import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeals-list';

describe('national-list', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render national list', async () => {
			nock('http://test/').get('/appeals/').reply(200, []);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

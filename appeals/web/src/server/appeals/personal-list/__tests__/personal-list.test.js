import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { assignedAppealsSummary } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/personal-list';

describe('personal-list', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render the personal list with the expected content', async () => {
			nock('http://test/')
				.get('/appeals/my-appeals?pageNumber=1&pageSize=30')
				.reply(200, assignedAppealsSummary);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

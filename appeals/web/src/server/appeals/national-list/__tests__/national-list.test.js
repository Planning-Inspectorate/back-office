import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { appealsNationalList } from '../../../../../testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeals-list';

describe('national-list', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	describe('GET /', () => {
		it('should render national list - no pagination', async () => {
			nock('http://test/').get('/appeals?pageNumber=1&pageSize=30').reply(200, appealsNationalList);

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render national list - 10 pages - all page indexes in one row', async () => {
			nock('http://test/')
				.get('/appeals?pageNumber=1&pageSize=30')
				.reply(200, { ...appealsNationalList, pageCount: 10 });

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render national list - 15 pages - pagination with ellipsis logic', async () => {
			nock('http://test/')
				.get('/appeals?pageNumber=1&pageSize=30')
				.reply(200, { ...appealsNationalList, pageCount: 15 });

			const response = await request.get(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

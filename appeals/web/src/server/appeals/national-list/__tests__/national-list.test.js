import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { appealsNationalList } from '#testing/app/fixtures/referencedata.js';
import { createTestEnvironment } from '#testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const baseUrl = '/appeals-service/appeals-list';
const statuses = [
	'assign_case_officer',
	'ready_to_start',
	'lpa_questionnaire_due',
	'issue_determination',
	'complete'
];

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

		it('should render national list - search term', async () => {
			nock('http://test/')
				.get('/appeals?pageNumber=1&pageSize=30&searchTerm=BS7%208LQ')
				.reply(200, appealsNationalList);

			const response = await request.get(`${baseUrl}?&searchTerm=BS7%208LQ`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render national list - search term - no result', async () => {
			nock('http://test/').get('/appeals?pageNumber=1&pageSize=30&searchTerm=NORESULT').reply(200, {
				itemCount: 0,
				items: [],
				statuses,
				page: 1,
				pageCount: 0,
				pageSize: 30
			});

			const response = await request.get(`${baseUrl}?&searchTerm=NORESULT`);
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

		it('should render national list - search term - filter applied', async () => {
			nock('http://test/')
				.get('/appeals?pageNumber=1&pageSize=30&searchTerm=BS7%208LQ&status=lpa_questionnaire_due')
				.reply(200, {
					itemCount: 1,
					items: [appealsNationalList.items[0]],
					statuses,
					page: 1,
					pageCount: 0,
					pageSize: 30
				});

			const response = await request.get(
				`${baseUrl}?searchTerm=BS7%208LQ&appealStatusFilter=lpa_questionnaire_due`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});

		it('should render national list - no search term - filter applied', async () => {
			nock('http://test/')
				.get('/appeals?pageNumber=1&pageSize=30&status=lpa_questionnaire_due')
				.reply(200, {
					itemCount: 1,
					items: [appealsNationalList.items[0]],
					statuses,
					page: 1,
					pageCount: 0,
					pageSize: 30
				});

			const response = await request.get(`${baseUrl}?appealStatusFilter=lpa_questionnaire_due`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});

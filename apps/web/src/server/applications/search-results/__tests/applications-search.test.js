import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const successFullResponse = {
	page: 1,
	pageSize: 1,
	pageCount: 1,
	itemCount: 1,
	items: [
		{
			id: 76,
			reference: null,
			modifiedDate: '1662373959',
			title: 'Title',
			status: 'Draft',
			publishedDate: null
		}
	]
};

const successEmptyResponse = {
	page: 1,
	pageSize: 1,
	pageCount: 1,
	itemCount: 0,
	items: []
};

describe('applications search', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-team');
	});

	describe('POST /applications-service/search-results', () => {
		const baseUrl = '/applications-service/search-results';

		it('should render the page with the results if params are correct', async () => {
			nock('http://test/').post('/applications/search').reply(200, successFullResponse);

			const response = await request.post(baseUrl).send({ query: 'query' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain(
				'<a class="govuk-body" href="/applications-service/create-new-case/76/check-your-answers"> Title</a>'
			);
		});

		it('should render a message if no results are found', async () => {
			nock('http://test/').post('/applications/search').reply(200, successEmptyResponse);

			const response = await request.post(baseUrl).send({ query: 'query' });
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('There are no matching results');
		});

		it('should render a message if the query is empty', async () => {
			const response = await request.post(baseUrl);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Enter a search term');
		});
	});
});

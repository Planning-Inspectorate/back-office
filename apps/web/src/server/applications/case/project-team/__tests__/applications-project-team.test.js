import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureCases } from '../../../../../../testing/applications/applications.js';
import { installMockADToken } from '../../../../../../testing/app/mocks/project-team.js';
import { fixtureProjectTeamMembers } from '../../../../../../testing/applications/fixtures/project-team.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, []);
	nock('http://test/').get('/applications/inspector').reply(200, []);

	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
};

describe('Project team', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/project-team';

	describe('List page', () => {
		describe('GET /case/123/project-team/', () => {
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
					expect(element.innerHTML).toContain('Project team');
				});
			});
		});
	});

	describe('Search page', () => {
		beforeEach(async () => {
			await request.get('/applications-service/case-team');
			nocks();
		});

		describe('GET /case/123/project-team/search', () => {
			it('should render the page with the search bar', async () => {
				const response = await request.get(`${baseUrl}/search`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Search for a team member');
			});

			it('should render the page with the search bar and the results of the query', async () => {
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/search?q=searchTerm`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('200 results');
			});
		});

		describe('POST /case/123/project-team/search', () => {
			it('should render an error if search term is empty', async () => {
				const response = await request.post(`${baseUrl}/search`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a search term');
			});

			it('should render an error if AD token is not found', async () => {
				const response = await request.post(`${baseUrl}/search`).send({ query: 'search term' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('permissions to search for team members');
			});

			it('should render an empty list if there are no results', async () => {
				installMockADToken([]);

				const response = await request.post(`${baseUrl}/search`).send({ query: 'search term' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There are no matching results');
			});

			it('should render the result list', async () => {
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.post(`${baseUrl}/search`).send({ query: 'search term' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('200 results');
			});
		});
	});
});

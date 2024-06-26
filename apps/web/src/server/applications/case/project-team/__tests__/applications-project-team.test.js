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
	nock('http://test/').get('/applications').reply(200, []);

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
	const query = (
		fixtureProjectTeamMembers[2].givenName +
		' ' +
		fixtureProjectTeamMembers[2].surname
	).toLocaleLowerCase();

	describe('List page', () => {
		describe('GET /case/123/project-team/', () => {
			it('should render the page without users', async () => {
				nock('http://test/').get('/applications/123/project-team').reply(200, []);
				installMockADToken(fixtureProjectTeamMembers);

				await request.get('/applications-service/');

				const response = await request.get(`${baseUrl}`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('Actions');
				expect(element.innerHTML).toContain('Project team');
			});

			it('should render the page with users', async () => {
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, [fixtureProjectTeamMembers[0]]);
				installMockADToken(fixtureProjectTeamMembers);

				await request.get('/applications-service/');

				const response = await request.get(`${baseUrl}`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
				expect(element.innerHTML).toContain('Project team');
			});
		});
	});

	describe('Search page', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		describe('GET /case/123/project-team/search', () => {
			it('should render the page with the search bar', async () => {
				const response = await request.get(`${baseUrl}/search`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Search for a team member');
			});

			it('should render the page with the search bar and the pagination', async () => {
				installMockADToken(Array(50).fill(fixtureProjectTeamMembers[2]));

				const response = await request.get(`${baseUrl}/search?q=${query}`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Page 2');
				expect(element.innerHTML).toContain('50 results');
			});

			it('should render the page with the results of the query', async () => {
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/search?q=${query}`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('17 results');
			});
		});

		describe('POST /case/123/project-team/search', () => {
			it('should render an error if search term is empty', async () => {
				const response = await request.post(`${baseUrl}/search`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Enter a search term');
			});

			it('should render an empty list if there are no results', async () => {
				installMockADToken([]);

				const response = await request.post(`${baseUrl}/search`).send({ query });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There are no matching results');
			});

			it('should render the result list', async () => {
				installMockADToken(fixtureProjectTeamMembers);
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, [{ userId: '3' }]);

				const response = await request.post(`${baseUrl}/search`).send({ query });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('17 results');
				expect(element.innerHTML).toContain('Added');
				expect(element.innerHTML).toContain('Select');
			});
		});
	});

	describe('Choose role page', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();
		});

		describe('GET /case/123/project-team/1/choose-role', () => {
			it('should render the page with the name of the NEW user and no default option', async () => {
				nock('http://test/').get('/applications/123/project-team/1').reply(500, {});
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, [{ userId: '3' }]);
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/1/choose-role`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('checked');
				expect(element.innerHTML).toContain('case_manager');
				expect(element.innerHTML).toContain('inspector');
				expect(element.innerHTML).toContain('Choose role');
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
				expect(element.innerHTML).toContain('another');
			});

			it('should render the page with the name of the NEW user, no default option and no Case Manager option', async () => {
				nock('http://test/').get('/applications/123/project-team/1').reply(500, {});
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, [
						{ userId: '3', role: 'case_manager' },
						{ userId: '5', role: 'inspector' }
					]);
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/1/choose-role`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('checked');
				expect(element.innerHTML).not.toContain('case_manager');
				expect(element.innerHTML).toContain('inspector');
				expect(element.innerHTML).toContain('Choose role');
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
				expect(element.innerHTML).toContain('another');
			});

			it('should render the page with the name of the existing user and default option', async () => {
				const mockedTeamMemberWithRole = { ...fixtureProjectTeamMembers[0], role: 'inspector' };
				nock('http://test/')
					.get('/applications/123/project-team/1')
					.reply(200, mockedTeamMemberWithRole);
				installMockADToken(fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/1/choose-role`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('checked');
				expect(element.innerHTML).toContain('Change role');
				expect(element.innerHTML).not.toContain('another');
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
			});
		});

		describe('POST /case/123/project-team/1/choose-role', () => {
			beforeEach(() => {
				installMockADToken(fixtureProjectTeamMembers);
			});

			it('should render an error if role is not selected', async () => {
				const response = await request.post(`${baseUrl}/1/choose-role`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('must select a role');
			});

			it('should render a API error if upserting did not work', async () => {
				const response = await request.post(`${baseUrl}/1/choose-role`).send({ role: 'officer' });
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('The role could not be saved, try again');
			});

			it('should redirect to project-team page if no errors', async () => {
				nock('http://test/').patch('/applications/123/project-team/1').reply(200, {});

				const response = await request.post(`${baseUrl}/1/choose-role`).send({ role: 'officer' });

				expect(response?.headers?.location).toEqual('../');
			});

			it('should redirect to project-team page if no errors and click on "add another', async () => {
				nock('http://test/').patch('/applications/123/project-team/1').reply(200, {});

				const response = await request
					.post(`${baseUrl}/1/choose-role?toSearchPage=1`)
					.send({ role: 'officer' });

				expect(response?.headers?.location).toEqual('../search');
			});
		});
	});

	describe('Remove member', () => {
		beforeEach(async () => {
			await request.get('/applications-service/');
			nocks();

			const mockedTeamMemberWithRole = { ...fixtureProjectTeamMembers[0], role: 'inspector' };
			nock('http://test/')
				.get('/applications/123/project-team/1')
				.reply(200, mockedTeamMemberWithRole);
			installMockADToken(fixtureProjectTeamMembers);
		});

		describe('GET /case/123/project-team/1/remove', () => {
			it('should render the page', async () => {
				const response = await request.get(`${baseUrl}/1/remove`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Remove team member');
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
			});
		});

		describe('POST /case/123/project-team/1/remove', () => {
			it('should render an error if removal did not work', async () => {
				const response = await request.post(`${baseUrl}/1/remove`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('The team member could not be removed');
			});

			it('should redirect to project-team page if no errors', async () => {
				nock('http://test/').post('/applications/123/project-team/remove-member').reply(200, {});

				const response = await request.post(`${baseUrl}/1/remove`);

				expect(response?.headers?.location).toEqual('../');
			});
		});
	});
});

const {
	app: appUnauth,
	installMockApi: installMockApiUnauth,
	teardown: teardownUnauth
} = createTestEnvironment({ authenticated: true, groups: ['not_valid_group'] });

const requestUnauth = supertest(appUnauth);

describe('Project team pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /applications-service/case/123/project-team/1', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get('/applications-service/case/123/project-team/1');

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});

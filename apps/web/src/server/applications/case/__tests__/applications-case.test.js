import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../testing/index.js';
import { installMockADToken } from '../../../../../testing/app/mocks/project-team.js';
import { fixtureProjectTeamMembers } from '../../../../../testing/applications/fixtures/project-team.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-team').reply(200, {});
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);
};

describe('Applications case pages', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123';

	describe('Project overview page', () => {
		describe('GET /case/123', () => {
			beforeEach(async () => {
				nocks();
				await request.get('/applications-service/case-team');

				installMockADToken(fixtureProjectTeamMembers);
			});

			it('should render the page with no project team members', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Overview');
				expect(element.innerHTML).toContain('No project members have been added yet');
			});

			it('should render the page with no displayable members', async () => {
				const mockedTeamMembersWithRole = [{ ...fixtureProjectTeamMembers[0], role: 'inspector' }];
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, mockedTeamMembersWithRole);

				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Overview');
				expect(element.innerHTML).toContain(
					'Some team members have been added, but only Case Managers and NSIP Officers'
				);
			});

			it('should render the page with displayable members', async () => {
				const mockedTeamMembersWithRole = [
					{ ...fixtureProjectTeamMembers[0], role: 'case_manager' }
				];
				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, mockedTeamMembersWithRole);

				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Overview');
				expect(element.innerHTML).toContain(fixtureProjectTeamMembers[0].givenName);
			});
		});
	});

	describe('Project information page', () => {
		describe('GET /case/123/project-information', () => {
			beforeEach(async () => {
				await request.get('/applications-service/case-team');
			});

			describe('When the case is not published', () => {
				beforeEach(async () => {
					nocks();
				});

				it('should show no info about previous publishings', async () => {
					const response = await request.get(`${baseUrl}/project-information`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Change');
					expect(element.innerHTML).not.toContain('There are unpublished changes');
					expect(element.innerHTML).toContain('Internal use only');
				});
			});

			describe('When the case is published', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/case-team').reply(200, {});
				});

				it('with no pending changes, should show publishing info and unpublish link', async () => {
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[5]);

					const response = await request.get(`${baseUrl}/project-information`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('There are unpublished changes');
				});

				it('with pending changes, should show publishing info, unpublish link and warning about unpublished changes', async () => {
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

					const response = await request.get(`${baseUrl}/project-information`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
				});
			});
		});
	});

	describe('Preview and publish page', () => {
		describe('GET /case/123/preview-and-publish', () => {
			beforeEach(async () => {
				nock('http://test/').get('/applications/case-team').reply(200, {});
				await request.get('/applications-service/case-team');
			});

			it('if already published, should render the page with the previous publishing info', async () => {
				nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

				const response = await request.get(`${baseUrl}/preview-and-publish`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Accept and publish changes');
			});

			it('if not yet published, should render the page with no previous publishing info', async () => {
				nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);

				const response = await request.get(`${baseUrl}/preview-and-publish`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Accept and publish project');
			});
		});

		describe('POST /case/123/preview-and-publish', () => {
			beforeEach(async () => {
				nock('http://test/').get('/applications/case-team').reply(200, {});
				nock('http://test/')
					.patch('/applications/123/publish')
					.reply(200, { publishedDate: 1_673_882_517 });
				await request.get('/applications-service/case-team');
			});

			it('if the case is not published yet, should go the first-time success banner page', async () => {
				nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);

				const response = await request.post(`${baseUrl}/preview-and-publish`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('successfully published');
			});
		});
	});

	describe('Unpublish case page', () => {
		beforeEach(async () => {
			nock('http://test/').get('/applications/case-team').reply(200, {});
			nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

			await request.get('/applications-service/case-team');
		});

		describe('GET /case/123/unpublish', () => {
			it('should render the page with the right info', async () => {
				const response = await request.get(`${baseUrl}/unpublish`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Unpublish the project');
			});
		});

		describe('POST /case/123/unpublish', () => {
			it('should go to success page if unpublished worked', async () => {
				const response = await request.post(`${baseUrl}/unpublish`);

				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('successfully unpublished');
			});
		});
	});
});

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
	nock('http://test/').get('/applications').reply(200, {});
	// default case nock
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);
	// // nock for project team
	// nock('http://test/').get('/applications/123/project-team').reply(200, {
	//     members: fixtureProjectTeamMembers
	// });
};

const baseUrl = '/applications-service/case/123';
const overviewUrl = `${baseUrl}/overview`;

describe('Applications case pages', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		nocks();
		await request.get('/applications-service/');

		installMockADToken(fixtureProjectTeamMembers);
	});

	describe('Overview page', () => {
		describe('GET /case/123/overview', () => {
			it('should render the page with a publish button if subsector is not generating_stations', async () => {
				nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);

				nock('http://test/')
					.get('/applications/4/project-team')
					.reply(200, fixtureProjectTeamMembers);
				// The default nock in beforeEach is for a non-generating station case.
				const response = await request.get(`${baseUrl}/overview`);
				const element = parseHtml(response.text);
				// Look for any element that acts as a publish button or link.
				const publishActionElement =
					element.querySelector('a[href*="preview-and-publish"]') ||
					element.querySelector('button[formaction*="preview-and-publish"]') ||
					element.querySelector('.govuk-button');

				expect(element.innerHTML).toContain('Publish');
				const text = publishActionElement?.textContent?.trim() || '';
				expect(text).toMatch(/Publish|Preview and publish/);
			});

			it('should render the page with project type info if subsector is generating_stations', async () => {
				// clean previous mock inside this test block
				nock.removeInterceptor({
					hostname: 'test',
					path: '/applications/123',
					method: 'GET'
				});

				const generatingStationCase = {
					...fixtureCases[3], // base fixture used everywhere else in suite
					id: 123,
					sector: { name: 'energy', displayNameEn: 'Energy' },
					subSector: { name: 'generating_stations', displayNameEn: 'Generating stations' },
					additionalDetails: { subProjectType: 'solar' }
				};

				nock('http://test/').get('/applications/123').reply(200, generatingStationCase);

				nock('http://test/')
					.get('/applications/123/project-team')
					.reply(200, fixtureProjectTeamMembers);

				const response = await request.get(`${baseUrl}/overview`);
				const element = parseHtml(response.text);
				expect(response.status).toBe(200);
				expect(element.innerHTML).toContain('Overview');
				expect(element.innerHTML).toContain('Project type');
				expect(element.innerHTML).toContain('solar');
			});
		});

		describe('POST /case/123/overview', () => {
			it('should show a validation error when generating_stations and project type is blank', async () => {
				// Remove the default GET /applications/123 mock
				nock.removeInterceptor({
					hostname: 'test',
					path: '/applications/123',
					method: 'GET'
				});
				// Remove the default GET /applications/123/project-team mock
				nock.removeInterceptor({
					hostname: 'test',
					path: '/applications/123/project-team',
					method: 'GET'
				});
				const generatingStationCase = {
					...fixtureCases[3],
					subSector: { name: 'generating_stations', displayNameEn: 'Generating stations' },
					additionalDetails: { subProjectType: '' }
				};
				// Required mocks for POST → redirect → GET render
				nock('http://test/')
					.get('/applications/123')
					.twice() // POST redirects back to GET → called twice
					.reply(200, generatingStationCase);
				nock('http://test/')
					.get('/applications/4/project-team')
					.reply(200, fixtureProjectTeamMembers);
				const response = await request
					.post(overviewUrl)
					.type('form')
					.send({
						organisationName: 'Org',
						subSectorName: 'Generating stations',
						subProjectType: '' // intentionally blank
					})
					.redirects(1); // follow the POST redirect back to the GET page
				expect(response.status).toBe(200);
				expect(response.text).toContain('govuk-error-summary');
				expect(response.text).toContain('Choose the project type');
			});
		});
	});

	describe('Project information page', () => {
		describe('GET /case/123/project-information', () => {
			beforeEach(async () => {
				await request.get('/applications-service/');
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
					nock('http://test/').get('/applications').reply(200, {});
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
				nock('http://test/').get('/applications').reply(200, {});
				await request.get('/applications-service/');
			});

			it('if already published, should render the page with the previous publishing info', async () => {
				nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

				const response = await request.get(`${baseUrl}/preview-and-publish`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Accept and publish project');
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
				nock('http://test/').get('/applications').reply(200, {});
				nock('http://test/')
					.patch('/applications/123/publish')
					.reply(200, { publishedDate: 1_673_882_517 });
				await request.get('/applications-service/');
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
			nock('http://test/').get('/applications').reply(200, {});
			nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

			await request.get('/applications-service/');
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

const {
	app: appUnauth,
	installMockApi: installMockApiUnauth,
	teardown: teardownUnauth
} = createTestEnvironment({ authenticated: true, groups: ['not_valid_group'] });

const requestUnauth = supertest(appUnauth);

describe('Applications case pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /case/123', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get('/applications-service/case/123');

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});

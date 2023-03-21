import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../testing/applications/fixtures/cases.js';
import { createTestEnvironment } from '../../../../../testing/index.js';

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
			});

			it('should render the page', async () => {
				const response = await request.get(baseUrl);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Summary information');
			});
		});
	});

	describe('Project information page', () => {
		describe('GET /case/123/project-information', () => {
			describe('When domainType is inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/inspector').reply(200, {});
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

					await request.get('/applications-service/inspector');
				});

				it('should show no change links or publishing links', async () => {
					const response = await request.get(`${baseUrl}/project-information`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('Change');
					expect(element.innerHTML).not.toContain('Preview and publish project');
					expect(element.innerHTML).not.toContain('There are unpublished changes');
					expect(element.innerHTML).not.toContain('Unpublish project');
				});
			});

			describe('When domainType is not inspector', () => {
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
						expect(element.innerHTML).toContain('Not Published');
						expect(element.innerHTML).not.toContain('Last updated:');
						expect(element.innerHTML).not.toContain('There are unpublished changes');
						expect(element.innerHTML).not.toContain('Unpublish project');
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
						expect(element.innerHTML).toContain('Published');
						expect(element.innerHTML).toContain('Last updated:');
						expect(element.innerHTML).not.toContain('There are unpublished changes');
						expect(element.innerHTML).toContain('Unpublish project');
					});

					it('with pending changes, should show publishing info, unpublish link and warning about unpublished changes', async () => {
						nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

						const response = await request.get(`${baseUrl}/project-information`);
						const element = parseHtml(response.text);

						expect(element.innerHTML).toMatchSnapshot();
						expect(element.innerHTML).toContain('Published');
						expect(element.innerHTML).toContain('Last updated:');
						expect(element.innerHTML).toContain('There are unpublished changes');
						expect(element.innerHTML).toContain('Unpublish project');
					});
				});
			});
		});
	});

	describe('Preview and publish page', () => {
		describe('GET /case/123/preview-and-publish', () => {
			describe('When domainType is inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/inspector').reply(200, {});
					await request.get('/applications-service/inspector');
				});

				it('should not render the page', async () => {
					const response = await request.get(`${baseUrl}/preview-and-publish`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('When domainType is not inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/case-team').reply(200, {});
					await request.get('/applications-service/case-team');
				});

				it('if already published, should render the page with the previous publishing info', async () => {
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

					const response = await request.get(`${baseUrl}/preview-and-publish`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Published');
					expect(element.innerHTML).toContain('Accept and publish changes');
					expect(element.innerHTML).toContain('Last updated:');
					expect(element.innerHTML).not.toContain('Internal use only');
				});

				it('if not yet published, should render the page with no previous publishing info', async () => {
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);

					const response = await request.get(`${baseUrl}/preview-and-publish`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Accept and publish project');
					expect(element.innerHTML).toContain('Not Published');
					expect(element.innerHTML).not.toContain('Last updated:');
				});
			});
		});

		describe('POST /case/123/preview-and-publish', () => {
			describe('When domainType is inspector', () => {
				beforeEach(async () => {
					nock('http://test/').get('/applications/inspector').reply(200, {});
					await request.get('/applications-service/inspector');
				});

				it('should not render the page', async () => {
					const response = await request.post(`${baseUrl}/preview-and-publish`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('problem with your login');
				});
			});

			describe('When domainType is not inspector', () => {
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
					expect(element.innerHTML).toContain('Project page published ');
				});

				it('if the case is already published, should go the 2nd-time success banner page', async () => {
					nock('http://test/').get('/applications/123').reply(200, fixtureCases[6]);

					const response = await request.post(`${baseUrl}/preview-and-publish`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Project page updates published');
				});
			});
		});
	});
});

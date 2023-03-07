import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureDocumentationFiles,
	fixturePaginatedDocumentationFiles
} from '../../../../../../testing/applications/fixtures/documentation-files.js';
import {
	fixtureDocumentationFolderPath,
	fixtureDocumentationSingleFolder,
	fixtureDocumentationSubFolders,
	fixtureDocumentationTopLevelFolders
} from '../../../../../../testing/applications/fixtures/options-item.js';
import { createTestEnvironment } from '../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = (/** @type {string} */ domainType) => {
	nock('http://test/').get(`/applications/${domainType}`).reply(200, {});
	nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/123/folders')
		.reply(200, fixtureDocumentationTopLevelFolders);
	nock('http://test/')
		.get('/applications/123/folders/21')
		.times(2)
		.reply(200, fixtureDocumentationSingleFolder);
	nock('http://test/')
		.get('/applications/123/folders/21/parent-folders')
		.times(2)
		.reply(200, fixtureDocumentationFolderPath);
	nock('http://test/')
		.get('/applications/123/folders/21/sub-folders')
		.times(2)
		.reply(200, fixtureDocumentationSubFolders);
	nock('http://test/')
		.get('/applications/123/documents/100')
		.times(2)
		.reply(200, fixtureDocumentationFiles[3]);
	nock('http://test/')
		.get('/applications/123/documents/90')
		.times(2)
		.reply(200, fixtureDocumentationFiles[89]);
	nock('http://test/')
		.post('/applications/123/documents/100/delete')
		.times(2)
		.reply(200, { isDeleted: true });
};

describe('applications documentation', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123';

	describe('GET /case/123/project-documentation', () => {
		beforeEach(async () => {
			nocks('case-team');
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-documentation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('All documents');
		});
	});

	describe('/case/123/project-documentation/21/sub-folder-level2', () => {
		describe('GET', () => {
			describe('Inspector', () => {
				beforeEach(async () => {
					nocks('inspector');
					await request.get('/applications-service/inspector');
				});

				it('should render the page with no list and no upload button', async () => {
					nock('http://test/')
						.post('/applications/123/folders/21/documents')
						.reply(200, fixturePaginatedDocumentationFiles(1, 50));

					const response = await request.get(
						`${baseUrl}/project-documentation/21/sub-folder-level2`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).not.toContain('Upload files');
					expect(element.innerHTML).not.toContain('Apply changes ');
				});
			});

			describe('Case admin officer', () => {
				beforeEach(async () => {
					nocks('case-admin-officer');
					await request.get('/applications-service/case-admin-officer');
				});

				it('should render the page with no panel and no table if there are no documents', async () => {
					const fixturePaginatedDocumentationFilesEmpty = {
						...fixturePaginatedDocumentationFiles,
						items: [],
						itemCount: 0
					};

					nock('http://test/')
						.post('/applications/123/folders/21/documents')
						.reply(200, fixturePaginatedDocumentationFilesEmpty);

					const response = await request.get(`${baseUrl}/project-documentation/21/no-documents`);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('This folder contains 0 document(s).');
					expect(element.innerHTML).not.toContain('Select documents to make changes to statuses');
				});

				it('should render the page with default pagination if there is no data in the session', async () => {
					nock('http://test/')
						.post('/applications/123/folders/21/documents')
						.reply(200, fixturePaginatedDocumentationFiles(1, 50));

					const response = await request.get(
						`${baseUrl}/project-documentation/21/sub-folder-level2`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('This folder contains 123 document');
					expect(element.innerHTML).toContain('Showing 1 - 50 document');
				});

				it('should render the page with the right number of files', async () => {
					nock('http://test/')
						.post('/applications/123/folders/21/documents')
						.reply(200, fixturePaginatedDocumentationFiles(2, 30));

					const response = await request.get(
						`${baseUrl}/project-documentation/21/sub-folder-level2?number=2&size=30`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Showing 31 - 60 document');
				});

				it('should render the page with custom pagination if there is data in the session', async () => {
					nock('http://test/')
						.post('/applications/123/folders/21/documents')
						.times(2)
						.reply(200, fixturePaginatedDocumentationFiles(1, 30));

					await request.get(
						`${baseUrl}/project-documentation/21/sub-folder-level2?number=1&size=30`
					);

					const response = await request.get(
						`${baseUrl}/project-documentation/21/sub-folder-level2`
					);

					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Showing 1 - 30 document');
				});
			});
		});
		describe('POST', () => {
			beforeEach(async () => {
				nocks('case-admin-officer');
				nock('http://test/')
					.post('/applications/123/folders/21/documents')
					.reply(200, fixturePaginatedDocumentationFiles(1, 50));
				await request.get('/applications-service/case-admin-officer');
			});

			it('should display an error if no documents are selected', async () => {
				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2`)
					.send({
						selectedFilesIds: []
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select documents to make changes to statuses');
			});

			it('should display an error if API returns an error', async () => {
				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2`)
					.send({
						selectedFilesIds: ['something_not_valid']
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There is a problem');
			});

			it('should refresh the page if there are no errors', async () => {
				nock('http://test/').patch('/applications/123/documents/update').reply(200, []);

				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2`)
					.send({
						selectedFilesIds: ['2']
					});

				expect(response?.headers?.location).toEqual('.');
			});
		});
	});

	describe('GET /case/123/project-documentation/21/sub-folder-level2/upload', () => {
		beforeEach(async () => {
			nocks('case-team');
			await request.get('/applications-service/case-team');
		});

		it('should render the page', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/sub-folder-level2/upload`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('No file chosen');
		});
	});

	describe('Document properties page', () => {
		describe('If the user is inspector', () => {
			beforeAll(async () => {
				nock('http://test/').get(`/applications/inspector`).reply(200, {});
				nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);

				await request.get('/applications-service/inspector');
			});
			it('page should not render', async () => {
				const response = await request.get(`${baseUrl}/123/document/100/properties`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('there is a problem with your login');
			});
		});

		describe('If the user is not inspector', () => {
			beforeEach(async () => {
				nocks('case-team');
				await request.get('/applications-service/case-team');
			});

			it('page should render', async () => {
				const response = await request.get(
					`${baseUrl}/project-documentation/21/document/100/properties`
				);

				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Document properties');
				expect(element.innerHTML).toContain('/edit/published-date');
			});

			it('should not show publishedDate edit link if document is not published', async () => {
				const response = await request.get(
					`${baseUrl}/project-documentation/21/document/90/properties`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).not.toContain('/edit/published-date');
			});
		});
	});

	describe('Document properties delete page', () => {
		describe('If the user is inspector', () => {
			beforeAll(async () => {
				nock('http://test/').get(`/applications/inspector`).reply(200, {});
				nock('http://test/').get('/applications/123').times(2).reply(200, fixtureCases[3]);

				await request.get('/applications-service/inspector');
			});
			it('page should not render', async () => {
				const response = await request.get(`${baseUrl}/123/document/100/delete`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('there is a problem with your login');
			});
		});

		describe('If the user is not inspector', () => {
			beforeEach(async () => {
				nocks('case-team');
				await request.get('/applications-service/case-team');
			});

			describe('GET /case/123/project-documentation/21/100/delete', () => {
				it('page should render', async () => {
					const response = await request.get(
						`${baseUrl}/project-documentation/21/document/100/delete`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Delete selected document');
				});

				it('should display warning if status is "ready_to_publish"', async () => {
					const response = await request.get(
						`${baseUrl}/project-documentation/21/document/90/delete`
					);

					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('is in the publishing queue ready to be published');
				});
			});
			describe('POST /case/123/project-documentation/21/100/delete', () => {
				it('should go to success page if status is not "ready-to-publish"', async () => {
					const response = await request.post(
						`${baseUrl}/project-documentation/21/document/100/delete`
					);
					const element = parseHtml(response.text);

					expect(element.innerHTML).toMatchSnapshot();
					expect(element.innerHTML).toContain('Document successfully deleted');
				});
			});
		});
	});
});

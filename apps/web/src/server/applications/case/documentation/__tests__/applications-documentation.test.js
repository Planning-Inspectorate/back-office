import { jest } from '@jest/globals';
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureDocumentFileVersions,
	fixturePaginatedDocumentationFiles,
	fixturePublishedDocumentationFile,
	fixtureReadyToPublishDocumentationFile,
	fixtureReadyToPublishDocumentationPdfFile
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

const nocks = () => {
	nock('http://test/').get(`/applications`).reply(200, {});
	nock('http://test/').get('/applications/123').times(4).reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/123/folders')
		.reply(200, fixtureDocumentationTopLevelFolders);
	nock('http://test/')
		.get('/applications/123/folders/21')
		.times(6)
		.reply(200, fixtureDocumentationSingleFolder);
	nock('http://test/')
		.get('/applications/123/folders/21/parent-folders')
		.times(5)
		.reply(200, fixtureDocumentationFolderPath);
	nock('http://test/')
		.get('/applications/123/folders/21/sub-folders')
		.times(5)
		.reply(200, fixtureDocumentationSubFolders);

	nock('http://test/')
		.get('/applications/123/documents/100/properties')
		.times(2)
		.reply(200, fixturePublishedDocumentationFile);

	nock('http://test/')
		.get('/applications/document/100/versions')
		.times(2)
		.reply(200, fixtureDocumentFileVersions);

	nock('http://test/')
		.get('/applications/123/documents/95/properties')
		.times(2)
		.reply(200, fixtureReadyToPublishDocumentationPdfFile);

	nock('http://test/')
		.get('/applications/document/95/versions')
		.times(2)
		.reply(200, fixtureDocumentFileVersions);

	nock('http://test/')
		.get('/applications/123/documents/90/properties')
		.times(2)
		.reply(200, fixtureReadyToPublishDocumentationFile);
	nock('http://test/')
		.get('/applications/document/90/versions')
		.times(2)
		.reply(200, fixtureDocumentFileVersions);
	nock('http://test/')
		.post('/applications/123/documents/100/delete')
		.times(2)
		.reply(200, { isDeleted: true });
};

const mockDate = new Date('2023-11-01T00:00:00Z');

describe('applications documentation', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123';

	describe('GET /case/123/project-documentation', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
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
			beforeEach(async () => {
				nocks();
				await request.get('/applications-service/case-admin-officer');
			});

			it('should render the page with no panel and no table if there are no documents', async () => {
				const fixturePaginatedDocumentationFilesEmpty = {
					...fixturePaginatedDocumentationFiles,
					items: [],
					itemCount: 0
				};

				nock('http://test/')
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 50, pageNumber: 1, sortBy: '-dateCreated' })
					.reply(200, fixturePaginatedDocumentationFilesEmpty);

				const response = await request.get(`${baseUrl}/project-documentation/21/no-documents`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('This folder contains 0 document(s).');
				expect(element.innerHTML).not.toContain('Select documents to make changes to statuses');
			});

			it('should render the page with default pagination if there is no data in the session', async () => {
				nock('http://test/')
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 50, pageNumber: 1, sortBy: '-dateCreated' })
					.reply(200, fixturePaginatedDocumentationFiles(1, 50));

				const response = await request.get(`${baseUrl}/project-documentation/21/sub-folder-level2`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('This folder contains 200 document');
				expect(element.innerHTML).toContain('Showing 1 - 50 document');
			});

			it('should render the page with the right number of files', async () => {
				nock('http://test/')
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 30, pageNumber: 2, sortBy: '-dateCreated' })
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
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 30, pageNumber: 1, sortBy: '-dateCreated' })
					.times(2)
					.reply(200, fixturePaginatedDocumentationFiles(1, 30));

				await request.get(`${baseUrl}/project-documentation/21/sub-folder-level2?number=1&size=30`);

				const response = await request.get(`${baseUrl}/project-documentation/21/sub-folder-level2`);

				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Showing 1 - 30 document');
			});
		});
		describe('POST', () => {
			beforeEach(async () => {
				nocks();
				nock('http://test/')
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 50, pageNumber: 1, sortBy: '-dateCreated' })
					.reply(200, fixturePaginatedDocumentationFiles(1, 50));
				await request.get('/applications-service/case-admin-officer');
			});

			it('should display an error if no documents are selected', async () => {
				const response = await request
					.get(`${baseUrl}/project-documentation/21/sub-folder-level2`)
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

			it('should return an error if no action is selected', async () => {
				nock('http://test/').patch('/applications/123/documents').reply(200, []);

				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2`)
					.send({
						selectedFilesIds: ['2']
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select a status to apply a change');
			});

			it('should refresh the page if there are no errors', async () => {
				nock('http://test/').patch('/applications/123/documents').reply(200, []);

				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2`)
					.send({
						status: 'not_checked',
						selectedFilesIds: ['2']
					});

				expect(response?.headers?.location).toEqual('.');
			});
		});
	});

	describe('GET /case/123/project-documentation/21/sub-folder-level2/upload', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
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
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('page should render without Open button', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/100/properties`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Document properties');
			expect(element.innerHTML).toContain('/edit/published-date');
			expect(element.innerHTML).toContain('Download');
			expect(element.innerHTML).not.toContain('Open');
		});

		it('page should render with Open button', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/95/properties`
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Document properties');
			expect(element.innerHTML).toContain('/edit/receipt-date');
			expect(element.innerHTML).toContain('Download');
			expect(element.innerHTML).toContain('Open');
		});

		it('should not show publishedDate edit link if document is not published', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/90/properties`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).not.toContain('/edit/published-date');
		});

		it('should not show publishedStatus edit link if document is published', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/100/properties`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).not.toContain('/edit/published-status');
			expect(element.innerHTML).not.toContain('/project-documentation/publishing-queue');
		});

		it('should show publishing queue link if document is ready to publish', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/90/properties`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('/edit/published-status');
			expect(element.innerHTML).toContain('/project-documentation/publishing-queue');
		});
	});

	describe('Document upload new version', () => {
		beforeAll(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		it('page should render', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/document/100/new-version`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Upload new version');
		});
	});

	describe('Document properties delete page', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		beforeAll(() => {
			jest.useFakeTimers({ advanceTimers: true }).setSystemTime(mockDate);
		});

		afterAll(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		describe('GET /case/123/project-documentation/21/100/delete', () => {
			it('page should render', async () => {
				const response = await request.get(
					`${baseUrl}/project-documentation/21/document/100/delete`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Delete document');
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

	describe('Document publishing queue', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/publishing-queue`', () => {
			it('page should render', async () => {
				nock('http://test/')
					.post('/applications/123/documents/ready-to-publish')
					.reply(200, fixturePaginatedDocumentationFiles(1, 125));

				const response = await request.get(`${baseUrl}/project-documentation/publishing-queue`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select documents for publishing');
				expect(element.innerHTML).toContain('File name: 125 ');
				expect(element.innerHTML).not.toContain('File name: 126 ');
			});

			it('page should render with correct pagination', async () => {
				nock('http://test/')
					.post('/applications/123/documents/ready-to-publish')
					.reply(200, fixturePaginatedDocumentationFiles(2, 125));

				const response = await request.get(
					`${baseUrl}/project-documentation/publishing-queue?number=2`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select documents for publishing');
				expect(element.innerHTML).not.toContain('File name: 125 ');
				expect(element.innerHTML).toContain('File name: 126 ');
			});
		});

		describe('POST /case/123/project-documentation/publishing-queue`', () => {
			beforeEach(() => {
				nock('http://test/')
					.post('/applications/123/documents/ready-to-publish')
					.reply(200, fixturePaginatedDocumentationFiles(1, 125));
			});

			it('should return frontend validation errors if no file is selected', async () => {
				const response = await request
					.post(`${baseUrl}/project-documentation/publishing-queue`)
					.send({
						selectedFilesIds: []
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('You must select documents to publish');
			});

			it('should return backend errors if request is not ok', async () => {
				nock('http://test/').patch('/applications/123/documents/publish').reply(500, {});

				const response = await request
					.post(`${baseUrl}/project-documentation/publishing-queue`)
					.send({
						selectedFilesIds: ['not a valid request']
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(
					'Your documents could not be published, please try again'
				);
			});

			it('should redirect to success page if there is no error', async () => {
				nock('http://test/')
					.patch('/applications/123/documents/publish')
					.reply(200, [{ guid: 'abc' }, { guid: 'def' }]);

				// needs this to set the session variable "backlink"
				await request.get(`${baseUrl}/project-documentation/21/folder-name`);

				const response = await request
					.post(`${baseUrl}/project-documentation/publishing-queue`)
					.send({
						selectedFilesIds: ['guid-abc', 'guid-def']
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('2 documents published to the NI website');
			});
		});
	});

	describe('Document search', () => {
		beforeEach(async () => {
			nocks();
			await request.get('/applications-service/');
		});

		describe('GET /case/123/project-documentation/search-results', () => {
			it('page should render with errors if api failed', async () => {
				const response = await request.get(`${baseUrl}/project-documentation/search-results`);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Your search could not be carried out, try again.');
				expect(element.innerHTML).toContain('Search results');
			});

			it('page should render with suggestion if no results', async () => {
				nock('http://test/')
					.get('/applications/123/documents?page=1&pageSize=25&criteria=word')
					.reply(200, { searchResult: {} });

				const response = await request.get(
					`${baseUrl}/project-documentation/search-results?q=word`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('There are no matching results');
				expect(element.innerHTML).toContain('Search results');
			});

			it('page should render with results', async () => {
				const results = fixturePaginatedDocumentationFiles(1, 25);
				nock('http://test/')
					.get('/applications/123/documents?page=1&pageSize=25&criteria=word')
					.reply(200, results);

				const response = await request.get(
					`${baseUrl}/project-documentation/search-results?q=word`
				);
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain(results.items[0].fileName);
				expect(element.innerHTML).toContain(`${results.itemCount} results`);
				expect(element.innerHTML).toContain('Search results');
			});
		});
	});

	describe('Move documents file list page', () => {
		describe('POST /case/123/project-documentation/21/sub-folder-level2/move-documents', () => {
			beforeEach(async () => {
				nocks();
				nock('http://test/')
					.get('/applications/123/folders/21/documents')
					.query({ pageSize: 50, pageNumber: 1, sortBy: '-dateCreated' })
					.reply(200, [fixtureReadyToPublishDocumentationFile]);
				nock('http://test/')
					.get('/applications/123/documents/1/properties')
					.reply(200, fixtureReadyToPublishDocumentationFile);
				await request.get('/applications-service/case-admin-officer');
			});

			it('should return frontend validation errors if no file is selected', async () => {
				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2/move-documents`)
					.send({
						selectedFilesIds: []
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Select documents to move');
			});

			it('should render the move documents file list page if documents are selected', async () => {
				const response = await request
					.post(`${baseUrl}/project-documentation/21/sub-folder-level2/move-documents`)
					.send({
						selectedFilesIds: ['1']
					});
				const element = parseHtml(response.text);

				expect(element.innerHTML).toMatchSnapshot();
				expect(element.innerHTML).toContain('Move documents');
				expect(element.innerHTML).toContain(fixtureReadyToPublishDocumentationFile.fileName);
				expect(element.innerHTML).toContain(fixtureReadyToPublishDocumentationFile.author);
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

describe('Project documentation pages when user belongs to wrong group', () => {
	beforeEach(installMockApiUnauth);
	afterEach(teardownUnauth);

	describe('GET /case/123/project-documentation', () => {
		it('should not render the page due to an authentication error', async () => {
			const response = await requestUnauth.get(
				'/applications-service/case/123/project-documentation'
			);

			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain('You are not permitted to access this URL');
		});
	});
});

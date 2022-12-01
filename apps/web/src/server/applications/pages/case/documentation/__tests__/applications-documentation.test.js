import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { fixtureCases } from '../../../../../../../testing/applications/fixtures/cases.js';
import {
	fixtureDocumentationFolderPath,
	fixtureDocumentationSingleFolder,
	fixtureDocumentationSubFolders,
	fixtureDocumentationTopLevelFolders
} from '../../../../../../../testing/applications/fixtures/options-item.js';
import { createTestEnvironment } from '../../../../../../../testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications/case-officer').reply(200, {});
	nock('http://test/').get('/applications/123').reply(200, fixtureCases[3]);
	nock('http://test/')
		.get('/applications/123/folders/21/documents')
		.reply(200, [
			{ guid: '1111-2222-0001', documentName: 'name1', status: 'unchecked' },
			{ guid: '1111-2222-0002', documentName: 'name2', status: 'unchecked' }
		]);
	nock('http://test/')
		.get('/applications/123/folders')
		.reply(200, fixtureDocumentationTopLevelFolders);
	nock('http://test/')
		.get('/applications/123/folders/21')
		.reply(200, fixtureDocumentationSingleFolder);
	nock('http://test/')
		.get('/applications/123/folders/21/parent-folders')
		.reply(200, fixtureDocumentationFolderPath);
	nock('http://test/')
		.get('/applications/123/folders/21/sub-folders')
		.reply(200, fixtureDocumentationSubFolders);
};

describe('applications documentation', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	afterAll(() => {
		nock.cleanAll();
	});

	beforeEach(async () => {
		await request.get('/applications-service/case-officer');
	});

	const baseUrl = '/applications-service/case/123';

	describe('GET /case/123/project-documentation', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-documentation`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('All documents');
		});
	});

	describe('GET /case/123/project-documentation/21/sub-folder-level2', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should render the page', async () => {
			const response = await request.get(`${baseUrl}/project-documentation/21/sub-folder-level2`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('This folder contains 123 document');
			expect(element.innerHTML).toContain('Showing 1 - 50 document');
		});

		it('should render the page with the right number of files', async () => {
			const response = await request.get(
				`${baseUrl}/project-documentation/21/sub-folder-level2?number=2&size=30`
			);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toMatchSnapshot();
			expect(element.innerHTML).toContain('Showing 31 - 60 document');
		});
	});

	describe('GET /case/123/project-documentation/21/sub-folder-level2/upload', () => {
		beforeEach(async () => {
			nocks();
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
});

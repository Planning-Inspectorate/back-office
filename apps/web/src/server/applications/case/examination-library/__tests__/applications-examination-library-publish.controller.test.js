//@ts-nocheck
import { jest } from '@jest/globals';
import nock from 'nock';
import {
	getExaminationLibraryPublish,
	postExaminationLibraryPublish
} from '../applications-examination-library-publish.controller.js';

describe('applications examination library publish controller', () => {
	let req;
	let res;

	beforeEach(() => {
		nock.cleanAll();
		req = {
			params: { caseId: '123', slug: 'application-documents' },
			query: { page: 1, pageSize: 25 },
			headers: {}
		};
		res = {
			locals: { case: { title: 'Test Case' } },
			status: jest.fn().mockReturnThis(),
			render: jest.fn(),
			redirect: jest.fn()
		};
	});

	afterEach(() => {
		nock.cleanAll();
	});

	describe('getExaminationLibraryPublish', () => {
		it('should return 404 if section does not exist', async () => {
			req.params.slug = 'unknown-slug';

			await getExaminationLibraryPublish(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('app/404');
		});

		it('should query published documents and total count, then render publish view', async () => {
			const mockPublishedDocs = {
				page: 1,
				pageSize: 25,
				pageCount: 1,
				itemCount: 20,
				items: [
					{
						caseId: 123,
						folderId: 10,
						isDeleted: false,
						latestDocumentVersion: {
							documentGuid: 'doc-1',
							fileName: 'app-form.pdf',
							description: 'Application Form',
							author: 'Applicant',
							draftExaminationLibraryReference: 'APP-001'
						}
					}
				]
			};

			const mockAllDocs = {
				page: 1,
				pageSize: 1,
				pageCount: 25,
				itemCount: 25,
				items: []
			};

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.publishedStatus === 'published' && query.categoryCode === 'APP')
				.reply(200, mockPublishedDocs);

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => !query.publishedStatus && query.categoryCode === 'APP')
				.reply(200, mockAllDocs);

			nock('http://test/')
				.get('/applications/123/examination-library')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, [{ categoryCode: 'APP', publishedStatus: 'in progress' }]);

			await getExaminationLibraryPublish(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'applications/case-examination-library/examination-library-publish.njk',
				expect.objectContaining({
					sectionHeading: 'Application documents',
					totalPublishedCount: 20,
					unpublishedCount: 5,
					hasUnpublishedItems: true,
					totalItemsText:
						'The Application documents category for the examination library will contain references for 20 items.',
					unpublishedInsetText:
						'5 items are not yet published and will not be assigned an examination library reference number. The other references have been adjusted to reflect this.',
					caseId: '123'
				})
			);
		});

		it('should render section page with error if unpublished category has 0 published documents or no documents', async () => {
			const mockEmptyDocs = {
				page: 1,
				pageSize: 25,
				pageCount: 0,
				itemCount: 0,
				items: []
			};

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.publishedStatus === 'published' && query.categoryCode === 'APP')
				.reply(200, mockEmptyDocs);

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => !query.publishedStatus && query.categoryCode === 'APP')
				.reply(200, mockEmptyDocs);

			nock('http://test/')
				.get('/applications/123/examination-library')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, [{ categoryCode: 'APP', publishedStatus: 'unpublished' }]);

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP' && !query.publishedStatus)
				.reply(200, mockEmptyDocs);

			await getExaminationLibraryPublish(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'applications/case-examination-library/examination-library-section.njk',
				expect.objectContaining({
					errors: 'Examination library category does not contain any new published documents'
				})
			);
		});

		it('should render section page with error if category is already published', async () => {
			const mockPublishedDocs = {
				page: 1,
				pageSize: 25,
				pageCount: 1,
				itemCount: 1,
				items: [{ guid: 'doc-1' }]
			};

			const mockAllDocs = {
				page: 1,
				pageSize: 1,
				pageCount: 1,
				itemCount: 1,
				items: [{ guid: 'doc-1' }]
			};

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.publishedStatus === 'published' && query.categoryCode === 'APP')
				.reply(200, mockPublishedDocs);

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => !query.publishedStatus && query.categoryCode === 'APP')
				.reply(200, mockAllDocs);

			nock('http://test/')
				.get('/applications/123/examination-library')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, [{ categoryCode: 'APP', publishedStatus: 'published' }]);

			// Subsequent call from getExaminationLibrarySectionData (categoriesResponse is reused)
			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP' && !query.publishedStatus)
				.reply(200, mockAllDocs);

			await getExaminationLibraryPublish(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'applications/case-examination-library/examination-library-section.njk',
				expect.objectContaining({
					errors: 'Examination library category does not contain any new published documents'
				})
			);
		});

		it('should return 404 if section does not have a category code to publish', async () => {
			req.params.slug = 'deadlines-1';

			await getExaminationLibraryPublish(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('app/404');
		});
	});

	describe('postExaminationLibraryPublish', () => {
		it('should return 404 if section does not exist', async () => {
			req.params.slug = 'unknown-slug';

			await postExaminationLibraryPublish(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('app/404');
		});

		it('should publish static category and redirect with published=true', async () => {
			nock('http://test/')
				.post('/applications/123/examination-library/publish', { categoryCode: 'APP' })
				.reply(200, { success: true });

			await postExaminationLibraryPublish(req, res);

			expect(res.redirect).toHaveBeenCalledWith(
				'/applications-service/case/123/examination-library/category/application-documents?published=true'
			);
		});

		it('should render section page with error when API returns 400 on publish', async () => {
			nock('http://test/')
				.post('/applications/123/examination-library/publish', { categoryCode: 'APP' })
				.reply(400, {
					errors: 'Examination library category does not contain any new published documents'
				});

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, { page: 1, pageSize: 25, pageCount: 0, itemCount: 0, items: [] });

			nock('http://test/')
				.get('/applications/123/examination-library')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, [{ categoryCode: 'APP', publishedStatus: 'in progress' }]);

			await postExaminationLibraryPublish(req, res);

			expect(res.render).toHaveBeenCalledWith(
				'applications/case-examination-library/examination-library-section.njk',
				expect.objectContaining({
					errors: 'Examination library category does not contain any new published documents'
				})
			);
		});

		it('should return 404 if section does not have a category code to publish', async () => {
			req.params.slug = 'deadlines-1';

			await postExaminationLibraryPublish(req, res);

			expect(res.status).toHaveBeenCalledWith(404);
			expect(res.render).toHaveBeenCalledWith('app/404');
		});
	});
});

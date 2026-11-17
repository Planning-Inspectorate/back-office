//@ts-nocheck
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureExaminationLibraryIndex } from '../../../../../../testing/applications/fixtures/examination-library.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';
const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = ({ includeDocuments = true, appCategoryStatus = 'in progress' } = {}) => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureExaminationLibraryIndex.caseData);
	nock('http://test/')
		.get('/applications/123/examination-library')
		.query({ categoryCode: 'APP' })
		.reply(200, [
			{
				categoryCode: 'APP',
				categoryName: 'Application form',
				publishedStatus: appCategoryStatus
			}
		]);
	nock('http://test/')
		.get('/applications/123/examination-library')
		.query(true)
		.reply(200, [
			{
				categoryCode: 'APP',
				categoryName: 'Application form',
				publishedStatus: 'published'
			},
			{
				categoryCode: 'AoC',
				categoryName: 'Adequacy of consultation responses',
				publishedStatus: 'published'
			},
			{
				categoryCode: 'PD',
				categoryName: 'Procedural decisions and notifications from Examining Authority',
				publishedStatus: 'published'
			},
			{
				categoryCode: 'AS',
				categoryName: 'Additional submissions',
				publishedStatus: 'published'
			},
			{
				categoryCode: 'OD',
				categoryName: 'Other documents',
				publishedStatus: 'published'
			},
			{
				categoryCode: 'RR',
				categoryName: 'Relevant representations',
				publishedStatus: 'published'
			}
		]);

	if (includeDocuments) {
		nock('http://test/')
			.get('/applications/123/examination-library/documents')
			.query(true)
			.reply(200, {
				page: 1,
				pageSize: 25,
				pageCount: 1,
				itemCount: 0,
				items: []
			});
	}

	nock('http://test/').get('/applications-service/').reply(200, {});
};

describe('Examination Library', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/examination-library';

	describe('GET /', () => {
		beforeEach(() => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;
		});

		it('should render the page with correct heading and description', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Examination library');
			expect(element.innerHTML).toContain(
				'The examination library lists all the documents submitted about the project'
			);
		});

		it('should render 6 static sections as separate task lists with headings', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const taskLists = element.querySelectorAll('.govuk-task-list');
			expect(taskLists.length).toBe(6);

			expect(element.innerHTML).toContain('Application documents');
			expect(element.innerHTML).toContain('Adequacy of consultation responses');
			expect(element.innerHTML).toContain('Relevant representations (registration comments)');
			expect(element.innerHTML).toContain(
				'Procedural decisions and notifications from Examining Authority'
			);
			expect(element.innerHTML).toContain('Additional submissions');
			expect(element.innerHTML).toContain('Other documents');
		});

		it('should display status tags from the API with correct colour classes for static sections', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const tags = element.querySelectorAll('.govuk-task-list .govuk-tag');
			expect(tags.length).toBe(6);

			tags.forEach((tag) => {
				expect(tag.textContent.trim()).toBe('Published');
				expect(tag.classList.contains('govuk-tag--green')).toBe(true);
			});
		});

		it('should display hint text for sections that have descriptions', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain(
				'Any amended versions accepted before or at the Preliminary Meeting'
			);
			expect(element.innerHTML).toContain('Examining Authority&#39;s written questions');
			expect(element.innerHTML).toContain(
				'anything accepted at the discretion of the Examining Authority'
			);
			expect(element.innerHTML).toContain('s127/131/138 information');
		});

		it('should link each static section to its detail page', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/application-documents"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/adequacy-of-consultation-responses"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/relevant-representations"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/procedural-decisions"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/additional-submissions"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/other-documents"'
			);
		});

		it('should use task list links with correct CSS class', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			const taskLinks = element.querySelectorAll('.govuk-task-list__link');
			expect(taskLinks.length).toBe(6);
		});

		it('should NOT render the page when feature flag is OFF', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = false;

			const response = await request.get(`${baseUrl}`);

			expect(response.status).toBe(404);
		});
	});

	describe('GET /category/:slug', () => {
		beforeEach(() => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;
		});

		it('should display static category subpages', async () => {
			const response = await request.get(`${baseUrl}/category/application-documents`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Application documents');
			expect(element.innerHTML).toContain('Items in the examination library');
		});

		it('should return 404 for an invalid section code', async () => {
			const response = await request.get(`${baseUrl}/category/invalid-section`);

			expect(response.status).toBe(404);
		});

		it('should NOT render the section page when feature flag is OFF', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = false;

			const response = await request.get(`${baseUrl}/category/application-documents`);

			expect(response.status).toBe(404);
		});

		it('should display sortable column headers', async () => {
			const response = await request.get(`${baseUrl}/category/application-documents`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const sortLinks = element.querySelectorAll('.sort-table__link');

			expect(sortLinks.length).toBe(2);

			expect(element.innerHTML).toContain('sortBy=description');
			expect(element.innerHTML).toContain('sortBy=publishedStatus');
		});

		it('should display the active column with descending sort link', async () => {
			const response = await request.get(
				`${baseUrl}/category/application-documents?sortBy=description`
			);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const descriptionSortLink = element
				.querySelectorAll('.sort-table__link')
				.find((link) => link.textContent.includes('Document description'));

			expect(descriptionSortLink.getAttribute('href')).toContain('sortBy=-description');
		});

		it('should display "Preview and publish category to library" button when category is in progress', async () => {
			const response = await request.get(`${baseUrl}/category/application-documents`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Preview and publish category to library');
		});

		it('should NOT display publish button when category is published', async () => {
			nock.cleanAll();
			nocks({ appCategoryStatus: 'published', includeDocuments: false });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query(true)
				.reply(200, {
					page: 1,
					pageSize: 25,
					pageCount: 1,
					itemCount: 1,
					items: [
						{
							caseId: 123,
							folderId: 1,
							isDeleted: false,
							latestDocumentVersion: {
								documentGuid: 'doc-1',
								fileName: 'test.pdf',
								examinationLibraryReferenceLocked: false
							}
						}
					]
				});

			const response = await request.get(`${baseUrl}/category/application-documents`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).not.toContain('Publish updates');
			expect(element.innerHTML).not.toContain('Preview and publish category to library');
		});

		it('should display "Preview and publish category to library" button when category is unpublished', async () => {
			nock.cleanAll();
			nocks({ appCategoryStatus: 'unpublished', includeDocuments: false });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query(true)
				.reply(200, {
					page: 1,
					pageSize: 25,
					pageCount: 1,
					itemCount: 0,
					items: []
				});

			const response = await request.get(`${baseUrl}/category/application-documents`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Preview and publish category to library');
		});
	});

	it('should pass sorting and pagination query parameters to the documents API', async () => {
		nock('http://test/')
			.get('/applications/123/examination-library/documents')
			.query({
				categoryCode: 'APP',
				sortBy: 'description',
				pageSize: '50',
				page: '2'
			})
			.reply(200, {
				page: 2,
				pageSize: 50,
				pageCount: 2,
				itemCount: 60,
				items: []
			});

		const response = await request.get(
			`${baseUrl}/category/application-documents?sortBy=description&page=2&pageSize=50`
		);

		expect(response.status).toBe(200);
	});

	describe('GET /category/:slug/publish', () => {
		beforeEach(() => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;
		});

		it('should render section page with error summary when category has 0 published documents', async () => {
			nock.cleanAll();
			nocks({ appCategoryStatus: 'in progress', includeDocuments: false });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.publishedStatus === 'published' && query.categoryCode === 'APP')
				.reply(200, { page: 1, pageSize: 25, pageCount: 0, itemCount: 0, items: [] });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => !query.publishedStatus && query.categoryCode === 'APP')
				.reply(200, { page: 1, pageSize: 1, pageCount: 1, itemCount: 2, items: [] });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, { page: 1, pageSize: 25, pageCount: 1, itemCount: 2, items: [] });

			const response = await request.get(`${baseUrl}/category/application-documents/publish`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('There is a problem');
			expect(element.innerHTML).toContain(
				'Examination library category does not contain any new published documents'
			);
		});
	});

	describe('GET /category/:slug/unpublish', () => {
		beforeEach(() => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;
		});

		it('should return 404 if section does NOT exist', async () => {
			const slug = 'invalid-category';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should return 404 if section category code does NOT exist ', async () => {
			const slug = 'deadlines';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should render category unpublish page when feature flag is ON', async () => {
			nock.cleanAll();
			nocks({ appCategoryStatus: 'published', includeDocuments: false });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query(true)
				.reply(200, {
					page: 1,
					pageSize: 25,
					pageCount: 1,
					itemCount: 1,
					items: [
						{
							caseId: 123,
							folderId: 1,
							isDeleted: false,
							latestDocumentVersion: {
								documentGuid: 'doc-1',
								fileName: 'test.pdf',
								examinationRefNo: 'APP-001',
								examinationLibraryReferenceLocked: true
							}
						}
					]
				});

			const slug = 'application-documents';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);
			const element = parseHtml(response.text);

			expect(element.innerHTML).toContain(
				'Unpublishing this category will remove it from the examination library'
			);
		});

		it('should NOT render category unpublish page when feature flag is OFF', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = false;

			const slug = 'application-documents';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should render category page with error summary when category to unpublish is NOT published', async () => {
			nock.cleanAll();
			nocks({ appCategoryStatus: 'in progress', includeDocuments: false });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP' && query.examinationRefNo === 'true')
				.reply(200, { page: 1, pageSize: 25, pageCount: 0, itemCount: 0, items: [] });

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP' && !query.examinationRefNo)
				.reply(200, { page: 1, pageSize: 1, pageCount: 1, itemCount: 2, items: [] });

			const slug = 'application-documents';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain(
				'This examination library category is not published, so cannot be unpublished'
			);
		});
	});

	describe('POST /category/:slug/unpublish', () => {
		beforeEach(() => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;
		});

		it('should return 404 if section does NOT exist', async () => {
			const slug = 'invalid-category';

			const response = await request.post(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should return 404 if section category code does NOT exist ', async () => {
			const slug = 'deadlines';

			const response = await request.post(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should redirect to category page if category unpublish was successful', async () => {
			nock('http://test/').post('/applications/123/examination-library/unpublish').reply(200, {});

			const slug = 'application-documents';

			const response = await request
				.post(`${baseUrl}/category/${slug}/unpublish`)
				.send({ categoryCode: 'APP' });

			expect(response?.headers?.location).toEqual(`${baseUrl}/category/${slug}`);
		});

		it('should render category page with error summary if API returns 400 on unpublish', async () => {
			nock('http://test/').post('/applications/123/examination-library/unpublish').reply(400, {
				errors: 'This examination library category is not published, so cannot be unpublished'
			});

			nock('http://test/')
				.get('/applications/123/examination-library/documents')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, { page: 1, pageSize: 25, pageCount: 0, itemCount: 0, items: [] });

			nock('http://test/')
				.get('/applications/123/examination-library')
				.query((query) => query.categoryCode === 'APP')
				.reply(200, [{ categoryCode: 'APP', publishedStatus: 'in progress' }]);

			const slug = 'application-documents';

			const response = await request
				.post(`${baseUrl}/category/${slug}/unpublish`)
				.send({ categoryCode: 'APP' });

			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain(
				'This examination library category is not published, so cannot be unpublished'
			);
		});
	});
});

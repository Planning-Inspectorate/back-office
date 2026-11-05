import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureExaminationLibraryIndex } from '../../../../../../testing/applications/fixtures/examination-library.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const mockDocumentResponse = {
	page: 1,
	pageSize: 25,
	pageCount: 1,
	itemCount: 20,
	items: []
};

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureExaminationLibraryIndex.caseData);
	nock('http://test/')
		.get('/applications/123/examination-library/documents')
		.query(true)
		.reply(200, mockDocumentResponse);
};

describe('applications examination library category unpublish', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	beforeEach(async () => {
		nocks();
	});

	afterAll(() => {
		nock.cleanAll();
	});

	const baseUrl = '/applications-service/case/123/examination-library';

	describe('GET /category/:slug/unpublish', () => {
		it('should return 404 if section does NOT exist', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

			const slug = 'invalid-category';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should return 404 if section category code does NOT exist ', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

			const slug = 'deadlines';

			const response = await request.get(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should render category unpublish page when feature flag is ON', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

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
	});

	describe('POST /category/:slug/unpublish', () => {
		it('should return 404 if section does NOT exist', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

			const slug = 'invalid-category';

			const response = await request.post(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should return 404 if section category code does NOT exist ', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

			const slug = 'deadlines';

			const response = await request.post(`${baseUrl}/category/${slug}/unpublish`);

			expect(response.status).toBe(404);
		});

		it('should redirect to category page if category unpublish was successful', async () => {
			const flags = staticFlags;
			flags['idas-607-examination-library'] = true;

			const slug = 'application-documents';

			nock('http://test/').post('/applications/123/examination-library/unpublish').reply(200, {});

			const response = await request
				.post(`${baseUrl}/category/${slug}/unpublish`)
				.send({ categoryCode: 'APP' });

			expect(response?.headers?.location).toEqual(`${baseUrl}/category/${slug}`);
		});
	});
});

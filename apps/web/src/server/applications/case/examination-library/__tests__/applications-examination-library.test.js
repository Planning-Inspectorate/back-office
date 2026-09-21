import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureExaminationLibraryIndex } from '../../../../../../testing/applications/fixtures/examination-library.js';
import { placeholderSectionStatuses } from '../examination-library.constants.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureExaminationLibraryIndex.caseData);
	nock('http://test/')
		.get('/applications/123/examination-library/section-statuses')
		.reply(200, placeholderSectionStatuses);
	nock('http://test/')
		.get('/applications/123/examination-library/documents')
		.query(true)
		.reply(200, []);
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

		it('should render 10 static and dynamic sections as separate task lists with headings', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const taskLists = element.querySelectorAll('.govuk-task-list');
			expect(taskLists.length).toBe(10);

			expect(element.innerHTML).toContain('Application documents');
			expect(element.innerHTML).toContain('Adequacy of consultation responses');
			expect(element.innerHTML).toContain('Relevant representations (registration comments)');
			expect(element.innerHTML).toContain(
				'Procedural decisions and notifications from Examining Authority'
			);
			expect(element.innerHTML).toContain('Additional submissions');
			expect(element.innerHTML).toContain('Change requests');
			expect(element.innerHTML).toContain('Events and hearings');
			expect(element.innerHTML).toContain('Procedural deadlines');
			expect(element.innerHTML).toContain('Deadlines');
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
			expect(taskLinks.length).toBe(14);
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

		it('should display dynamic category subpages', async () => {
			const response = await request.get(`${baseUrl}/category/procedural-deadlines-1`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Procedural deadlines 1');
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
	});
});

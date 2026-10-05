//@ts-nocheck
import { parseHtml } from '@pins/platform';
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { fixtureExaminationLibraryIndex } from '../../../../../../testing/applications/fixtures/examination-library.js';
import { placeholderSectionStatuses } from '../examination-library.constants.js';
import staticFlags from '@pins/feature-flags/src/static-feature-flags.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const timetableItems = [
	{
		id: 12,
		name: 'Open floor hearing 1',
		ExaminationTimetableType: { templateType: 'open-floor-hearing' }
	},
	{
		id: 37,
		name: 'Procedural deadline 1',
		ExaminationTimetableType: { templateType: 'procedural-deadline' }
	},
	{
		id: 58,
		name: 'Deadline 1',
		ExaminationTimetableType: { templateType: 'deadline' }
	},
	{
		id: 91,
		name: 'Other timetable item',
		ExaminationTimetableType: { templateType: 'other' }
	}
];

let documentsQuery;

const nocks = ({ includeDocuments = true } = {}) => {
	nock('http://test/').get('/applications').reply(200, []);
	nock('http://test/').get('/applications/123').reply(200, fixtureExaminationLibraryIndex.caseData);
	nock('http://test/')
		.get('/applications/examination-timetable-items/case/123')
		.reply(200, { items: timetableItems });
	nock('http://test/')
		.get('/applications/123/examination-library/section-statuses')
		.reply(200, placeholderSectionStatuses);

	if (includeDocuments) {
		nock('http://test/')
			.get('/applications/123/examination-library/documents')
			.query((query) => {
				documentsQuery = query;
				return true;
			})
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
		documentsQuery = undefined;
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

		it('should render populated static and dynamic sections as separate task lists with headings', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const taskLists = element.querySelectorAll('.govuk-task-list');
			expect(taskLists.length).toBe(9);

			expect(element.innerHTML).toContain('Application documents');
			expect(element.innerHTML).toContain('Adequacy of consultation responses');
			expect(element.innerHTML).toContain('Relevant representations (registration comments)');
			expect(element.innerHTML).toContain(
				'Procedural decisions and notifications from Examining Authority'
			);
			expect(element.innerHTML).toContain('Additional submissions');
			expect(element.innerHTML).not.toContain('Change requests');
			expect(element.innerHTML).toContain('Events and hearings');
			expect(element.innerHTML).toContain('Procedural deadlines');
			expect(element.innerHTML).toContain('Deadlines');
			expect(element.innerHTML).toContain('Other documents');
		});

		it('should display published static statuses and in-progress dynamic statuses', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);

			const tags = element.querySelectorAll('.govuk-task-list .govuk-tag');
			expect(tags.length).toBe(9);

			const publishedTags = tags.filter((tag) => tag.textContent.trim() === 'Published');
			const inProgressTags = tags.filter((tag) => tag.textContent.trim() === 'In progress');

			expect(publishedTags.length).toBe(6);
			expect(inProgressTags.length).toBe(3);

			publishedTags.forEach((tag) => {
				expect(tag.textContent.trim()).toBe('Published');
				expect(tag.classList.contains('govuk-tag--green')).toBe(true);
			});

			inProgressTags.forEach((tag) => {
				expect(tag.textContent.trim()).toBe('In progress');
				expect(tag.classList.contains('govuk-tag--blue')).toBe(true);
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

		it('should link timetable items in their dynamic sections and exclude unrelated item types', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/open-floor-hearing-1"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/procedural-deadline-1"'
			);
			expect(element.innerHTML).toContain(
				'href="/applications-service/case/123/examination-library/category/deadline-1"'
			);
			expect(element.innerHTML).not.toContain('Other timetable item');
		});

		it('should use task list links with correct CSS class', async () => {
			const response = await request.get(`${baseUrl}`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			const taskLinks = element.querySelectorAll('.govuk-task-list__link');
			expect(taskLinks.length).toBe(9);
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
			const response = await request.get(`${baseUrl}/category/procedural-deadline-1`);
			const element = parseHtml(response.text);

			expect(response.status).toBe(200);
			expect(element.innerHTML).toContain('Procedural deadline 1');
			expect(element.innerHTML).toContain('Items in the examination library');
			expect(response.text).toContain(
				'<title>Procedural deadline 1 - Title CASE/123 - NSIP applications</title>'
			);
			expect(documentsQuery).toEqual({
				examinationTimetableItemId: '37',
				sortBy: '',
				pageSize: '25',
				page: '1'
			});
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
	});

	it('should pass sorting and pagination query parameters to the documents API', async () => {
		const response = await request.get(
			`${baseUrl}/category/application-documents?sortBy=description&page=2&pageSize=50`
		);

		expect(response.status).toBe(200);
		expect(documentsQuery).toEqual({
			categoryCode: 'APP',
			sortBy: 'description',
			pageSize: '50',
			page: '2'
		});
	});
});

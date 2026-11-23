// @ts-nocheck
import nock from 'nock';
import { getExaminationLibrarySectionData } from '../applications-examination-library-section.controller.js';

describe('applications examination library section controller', () => {
	const caseId = 100000082;
	const categories = [
		{
			categoryCode: 'APP',
			categoryName: 'Application documents',
			publishedStatus: 'in progress',
			source: 'SYSTEM'
		},
		{
			categoryCode: 'EV1',
			categoryName: 'Open Floor Hearing 1',
			publishedStatus: 'in progress',
			source: 'TIMETABLE'
		},
		{
			categoryCode: 'PDA',
			categoryName: 'Procedural Deadline 1',
			publishedStatus: 'in progress',
			source: 'TIMETABLE'
		}
	];

	const documentsResponse = {
		items: [],
		totalItems: 0
	};

	const mockCategories = (response = categories) =>
		nock('http://test/').get(`/applications/${caseId}/examination-library`).reply(200, response);
	const mockDocuments = (categoryCode) =>
		nock('http://test/')
			.get(`/applications/${caseId}/examination-library/documents`)
			.query((query) => query.categoryCode === categoryCode)
			.reply(200, documentsResponse);

	beforeEach(() => {
		nock.cleanAll();
	});

	afterEach(() => {
		nock.cleanAll();
	});

	describe('#getExaminationLibrarySectionData', () => {
		it('should fetch documents using the static category code', async () => {
			mockCategories();

			const documentsRequest = mockDocuments('APP');
			const result = await getExaminationLibrarySectionData(caseId, 'application-documents');

			expect(documentsRequest.isDone()).toBe(true);
			expect(result.sectionViewModel.sectionHeading).toEqual('Application documents');
		});

		it('should fetch documents using the dynamic category code', async () => {
			mockCategories();

			const documentsRequest = mockDocuments('EV1');
			const result = await getExaminationLibrarySectionData(
				caseId,
				'open-floor-hearing-1',
				{},
				{ sectionSlug: 'events-and-hearings' }
			);

			expect(documentsRequest.isDone()).toBe(true);
			expect(result.sectionViewModel.sectionHeading).toEqual('Open Floor Hearing 1');
			expect(result.sectionUrl).toContain('/category/events-and-hearings/open-floor-hearing-1');
		});

		it('should resolve procedural deadline categories', async () => {
			mockCategories();

			const documentsRequest = mockDocuments('PDA');
			await getExaminationLibrarySectionData(
				caseId,
				'procedural-deadline-1',
				{},
				{ sectionSlug: 'procedural-deadlines' }
			);

			expect(documentsRequest.isDone()).toBe(true);
		});

		it('should resolve deadline categories', async () => {
			mockCategories([
				...categories,
				{
					categoryCode: 'REP1',
					categoryName: 'Deadline 1',
					publishedStatus: 'in progress',
					source: 'TIMETABLE'
				}
			]);

			const documentsRequest = mockDocuments('REP1');
			const result = await getExaminationLibrarySectionData(
				caseId,
				'deadline-1',
				{},
				{ sectionSlug: 'deadlines' }
			);

			expect(documentsRequest.isDone()).toBe(true);
			expect(result.sectionUrl).toContain('/category/deadlines/deadline-1');
		});

		it('should return null when the dynamic category does not exist', async () => {
			mockCategories();

			const result = await getExaminationLibrarySectionData(
				caseId,
				'unknown-hearing',
				{},
				{ sectionSlug: 'events-and-hearings' }
			);

			expect(result).toBeNull();
			expect(nock.isDone()).toBe(true);
		});

		it('should use prefetched categories and documents when provided', async () => {
			const result = await getExaminationLibrarySectionData(
				caseId,
				'application-documents',
				{},
				{
					categoriesResponse: categories,
					documentsResponse
				}
			);

			expect(result).not.toBeNull();
			expect(nock.isDone()).toBe(true);
		});

		it('should use the published status from the query string', async () => {
			mockCategories();
			mockDocuments('APP');

			const result = await getExaminationLibrarySectionData(caseId, 'application-documents', {
				published: 'true'
			});

			expect(result.sectionStatus).toEqual('published');
			expect(result.isPublishedQuery).toEqual(true);
			expect(nock.isDone()).toBe(true);
		});
	});
});

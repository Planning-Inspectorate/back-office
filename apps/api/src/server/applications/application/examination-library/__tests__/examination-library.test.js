import { request } from '#app-test';
import { jest } from '@jest/globals';
import { databaseConnector } from '#utils/database-connector.js';

describe('Examination Library Routes', () => {
	const caseId = 1;

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('GET /applications/:id/examination-library', () => {
		it('should fetch categories from the database', async () => {
			const mockCategories = [{ id: 1, categoryCode: 'APP', categoryName: 'Application' }];
			databaseConnector.examinationLibraryCategory.findMany.mockResolvedValue(mockCategories);

			const response = await request.get(
				`/applications/${caseId}/examination-library?categoryCode=APP`
			);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(mockCategories);
			expect(databaseConnector.examinationLibraryCategory.findMany).toHaveBeenCalledWith({
				where: { caseId, categoryCode: 'APP' },
				orderBy: { id: 'asc' }
			});
		});
	});

	describe('POST /applications/:id/examination-library', () => {
		it('should create category from single object payload in the database', async () => {
			const payload = { categoryCode: 'APP', categoryName: 'Application' };
			databaseConnector.examinationLibraryCategory.createMany.mockResolvedValue({ count: 1 });

			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send(payload);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ count: 1 });
			expect(databaseConnector.examinationLibraryCategory.createMany).toHaveBeenCalledWith({
				data: [{ categoryCode: 'APP', categoryName: 'Application', source: 'STATIC', caseId }]
			});
		});

		it('should create categories from an array payload in the database', async () => {
			const payload = [
				{ categoryCode: 'APP', categoryName: 'Application' },
				{ categoryCode: 'PLN', categoryName: 'Plans' }
			];
			databaseConnector.examinationLibraryCategory.createMany.mockResolvedValue({ count: 2 });

			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send(payload);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ count: 2 });
			expect(databaseConnector.examinationLibraryCategory.createMany).toHaveBeenCalledWith({
				data: [
					{ categoryCode: 'APP', categoryName: 'Application', source: 'STATIC', caseId },
					{ categoryCode: 'PLN', categoryName: 'Plans', source: 'STATIC', caseId }
				]
			});
		});

		it('should return flat validation errors when required fields are missing on single object', async () => {
			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send({ categoryCode: 'APP' });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				errors: {
					categoryName: 'Category name is required and must be a string'
				}
			});
		});

		it('should return flat validation errors when field types are invalid on single object', async () => {
			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send({ categoryCode: 123, categoryName: '' });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				errors: {
					categoryCode: 'Category code is required and must be a string',
					categoryName: 'Category name is required and must be a string'
				}
			});
		});

		it('should return 400 error when duplicate category is created (P2002)', async () => {
			const error = new Error('Unique constraint failed');
			// @ts-ignore
			error.code = 'P2002';
			databaseConnector.examinationLibraryCategory.createMany.mockRejectedValue(error);

			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send({ categoryCode: 'APP', categoryName: 'Application' });

			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				errors:
					'An examination library category with this code and name already exists for this case'
			});
		});
	});

	describe('GET /applications/:id/examination-library/documents', () => {
		it('should fetch and paginate documents from the database', async () => {
			const mockDocuments = [
				{
					guid: 'doc-1',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant A',
						description: 'Document A'
					}
				},
				{
					guid: 'doc-2',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant B',
						description: 'Document B'
					}
				}
			];

			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const response = await request.get(
				`/applications/${caseId}/examination-library/documents?categoryCode=APP&publishedStatus=published`
			);

			expect(response.status).toBe(200);

			expect(response.body).toEqual({
				page: 1,
				pageSize: 25,
				pageCount: 1,
				itemCount: 2,
				items: mockDocuments
			});

			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				where: {
					caseId,
					latestDocumentVersion: {
						examinationLibraryCategoryId: { not: null },
						ExaminationLibraryCategory: {
							categoryCode: 'APP'
						},
						publishedStatus: 'published'
					}
				},
				include: {
					latestDocumentVersion: {
						include: {
							ExaminationLibraryCategory: true
						}
					}
				}
			});
		});

		it('should filter documents by examination timetable item ID', async () => {
			databaseConnector.document.findMany.mockResolvedValue([]);

			const response = await request.get(
				`/applications/${caseId}/examination-library/documents?examinationTimetableItemId=37`
			);

			expect(response.status).toBe(200);
			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				where: {
					caseId,
					latestDocumentVersion: {
						examinationLibraryCategoryId: { not: null },
						ExaminationLibraryCategory: {
							examinationTimetableItemId: 37
						}
					}
				},
				include: {
					latestDocumentVersion: {
						include: {
							ExaminationLibraryCategory: true
						}
					}
				}
			});
		});

		it('should reject an invalid examination timetable item ID', async () => {
			const response = await request.get(
				`/applications/${caseId}/examination-library/documents?examinationTimetableItemId=invalid`
			);

			expect(response.status).toBe(400);
			expect(databaseConnector.document.findMany).not.toHaveBeenCalled();
		});

		it('should apply the default Examination Library sort when sortBy is not provided', async () => {
			const mockDocuments = [
				{
					guid: 'individual',
					latestDocumentVersion: {
						typeOfParty: 'Individual',
						author: 'Alpha',
						description: 'Document'
					}
				},
				{
					guid: 'local-authority',
					latestDocumentVersion: {
						typeOfParty: 'Local authority',
						author: 'Alpha',
						description: 'Document'
					}
				},
				{
					guid: 'applicant',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Alpha',
						description: 'Document'
					}
				}
			];

			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const response = await request.get(`/applications/${caseId}/examination-library/documents`);

			expect(response.body.items.map(({ guid }) => guid)).toEqual([
				'applicant',
				'local-authority',
				'individual'
			]);
		});

		it('should apply selected sort before pagination', async () => {
			const mockDocuments = [
				{
					guid: 'doc-6',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Foxtrot'
					}
				},
				{
					guid: 'doc-5',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Echo'
					}
				},
				{
					guid: 'doc-4',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Delta'
					}
				},
				{
					guid: 'doc-3',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Charlie'
					}
				},
				{
					guid: 'doc-2',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Bravo'
					}
				},
				{
					guid: 'doc-1',
					latestDocumentVersion: {
						typeOfParty: 'Applicant',
						author: 'Applicant',
						description: 'Alpha'
					}
				}
			];

			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const response = await request.get(
				`/applications/${caseId}/examination-library/documents?sortBy=%2Bdescription&page=2&pageSize=2`
			);

			expect(response.status).toBe(200);

			expect(response.body).toEqual({
				page: 2,
				pageSize: 2,
				pageCount: 3,
				itemCount: 6,
				items: [
					expect.objectContaining({ guid: 'doc-3' }),
					expect.objectContaining({ guid: 'doc-4' })
				]
			});
		});
	});
});

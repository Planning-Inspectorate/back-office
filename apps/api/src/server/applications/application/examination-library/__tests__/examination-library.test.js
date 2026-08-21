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
		it('should create categories in the database', async () => {
			const payload = [{ categoryCode: 'APP', categoryName: 'Application' }];
			databaseConnector.examinationLibraryCategory.createMany.mockResolvedValue({ count: 1 });

			const response = await request
				.post(`/applications/${caseId}/examination-library`)
				.send(payload);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ count: 1 });
			expect(databaseConnector.examinationLibraryCategory.createMany).toHaveBeenCalledWith({
				data: [{ categoryCode: 'APP', categoryName: 'Application', caseId }]
			});
		});
	});

	describe('GET /applications/:id/examination-library/documents', () => {
		it('should fetch documents from the database', async () => {
			const mockDocuments = [{ guid: 'doc-1', name: 'Test Doc' }];
			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const response = await request.get(
				`/applications/${caseId}/examination-library/documents?publishedStatus=published`
			);

			expect(response.status).toBe(200);
			expect(response.body).toEqual(mockDocuments);
			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				where: {
					caseId,
					isDeleted: false,
					latestDocumentVersion: {
						examinationLibraryCategoryId: { not: null },
						isDeleted: false,
						publishedStatus: 'published'
					}
				},
				include: {
					latestDocumentVersion: {
						include: {
							ExaminationLibraryCategory: true
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			});
		});
	});
});

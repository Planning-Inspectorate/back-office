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
		it('should create categories from array payload in the database', async () => {
			const payload = [{ categoryCode: 'APP', categoryName: 'Application' }];
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

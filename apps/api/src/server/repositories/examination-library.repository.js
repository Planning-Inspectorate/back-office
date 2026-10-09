import { databaseConnector } from '#utils/database-connector.js';
import { EXAM_LIBRARY_STATIC_CATEGORIES } from '../applications/constants.js';

/**
 * @typedef {import('#database-client').ExaminationLibraryCategory} ExaminationLibraryCategory
 * @typedef {import('#database-client').Prisma.ExaminationLibraryCategoryCreateInput} ExaminationLibraryCategoryCreateInput
 * @typedef {import('#database-client').Prisma.ExaminationLibraryCategoryUncheckedCreateInput} ExaminationLibraryCategoryUncheckedCreateInput
 */

/**
 * Get Examination Library Categories for a case.
 * Optionally filter by id or categoryCode.
 *
 * @param {number} caseId
 * @param {{id?: number, categoryCode?: string}} [filters]
 * @returns {import('#database-client').PrismaPromise<ExaminationLibraryCategory[]>}
 */
export const getCategories = (caseId, filters = {}) => {
	/** @type {Record<string, any>} */
	const where = { caseId };

	if (filters.id) {
		where.id = filters.id;
	}
	if (filters.categoryCode) {
		where.categoryCode = filters.categoryCode;
	}

	return databaseConnector.examinationLibraryCategory.findMany({
		where,
		orderBy: {
			id: 'asc'
		}
	});
};

/**
 * Create one or multiple Examination Library Categories for a case.
 *
 * @param {number} caseId
 * @param {Omit<ExaminationLibraryCategoryUncheckedCreateInput, 'caseId'>[]} categoriesData
 * @returns {import('#database-client').PrismaPromise<import('#database-client').Prisma.BatchPayload>}
 */
export const createCategories = (caseId, categoriesData) => {
	const dataToInsert = categoriesData.map((category) => ({
		...category,
		source: category.source ?? 'STATIC',
		caseId
	}));

	// Note: We cannot use `skipDuplicates: true` here because Prisma does not support it
	// on Microsoft SQL Server. If used, it throws the following error during transaction execution:
	// "Unknown argument skipDuplicates. Available options are marked with ?"
	return databaseConnector.examinationLibraryCategory.createMany({
		data: dataToInsert
	});
};

/**
 * Get all Examination Library documents with their assigned category for a given case.
 * Optionally filter by categoryCode and/or publishedStatus.
 *
 * @param {number} caseId
 * @param {{categoryCode?: string, examinationTimetableItemId?: number, publishedStatus?: string}} [filters]
 * @returns {import('#database-client').PrismaPromise<import('#database-client').Document[]>}
 */
export const getDocuments = (caseId, filters = {}) => {
	// The frontend requires documents linked to a category for this case.
	// Since documents are linked to categories via their latestDocumentVersion
	// Deleted files are included as they need to be displayed on category subpages

	/** @type {Record<string, any>} */
	const versionWhere = {
		examinationLibraryCategoryId: { not: null }
	};

	if (filters.categoryCode || filters.examinationTimetableItemId) {
		versionWhere.ExaminationLibraryCategory = {};
		if (filters.categoryCode) {
			versionWhere.ExaminationLibraryCategory.categoryCode = filters.categoryCode;
		}
		if (filters.examinationTimetableItemId) {
			versionWhere.ExaminationLibraryCategory.examinationTimetableItemId =
				filters.examinationTimetableItemId;
		}
	}

	if (filters.publishedStatus) {
		versionWhere.publishedStatus = filters.publishedStatus;
	}

	return databaseConnector.document.findMany({
		where: {
			caseId,
			latestDocumentVersion: versionWhere
		},
		include: {
			latestDocumentVersion: {
				include: {
					ExaminationLibraryCategory: true
				}
			}
		}
	});
};

/**
 * Creates the static initial Examination Library Categories for a newly started case.
 *
 * @param {number} caseId
 * @returns {import('#database-client').PrismaPromise<import('#database-client').Prisma.BatchPayload>}
 */
export const createStaticCategories = (caseId) => {
	return createCategories(caseId, EXAM_LIBRARY_STATIC_CATEGORIES);
};

/**
 * Marks the Examination Library category as published
 * Sets the Examination Library reference for each category document
 * Returns the updated Examination Library category document data for broadcast
 *
 * @param {number} caseId
 * @param {string} categoryCode
 * @param {Array} [documents]
 * @returns {Promise<{caseReference: string, documents: any[]}>}
 */
export const publishCategory = async (caseId, categoryCode, documents = []) => {
	return databaseConnector.$transaction(async (tx) => {
		const category = await tx.examinationLibraryCategory.findFirst({
			where: {
				caseId,
				categoryCode
			}
		});

		if (!category) {
			throw new Error(`Category not found for case ${caseId} and code ${categoryCode}`);
		}

		await tx.examinationLibraryCategory.updateMany({
			where: {
				caseId,
				categoryCode
			},
			data: { publishedStatus: 'published' }
		});

		await Promise.all(
			documents.map(async (document) => {
				const documentReference = document.latestDocumentVersion?.draftExaminationLibraryReference;
				if (!documentReference) return;

				await tx.documentVersion.update({
					where: {
						documentGuid_version: {
							documentGuid: document.guid,
							version: document.latestDocumentVersion.version
						}
					},
					data: {
						examinationLibraryReferenceLocked: true,
						examinationLibraryIndex: documentReference
					}
				});
			})
		);

		const caseData = await tx.case.findUnique({
			where: { id: caseId },
			select: { reference: true }
		});

		if (!caseData) {
			throw new Error(`Case reference not found for case ${caseId}`);
		}

		const publishedCategoryDocuments = await tx.document.findMany({
			where: {
				caseId,
				latestDocumentVersion: {
					examinationLibraryCategoryId: { not: null },
					ExaminationLibraryCategory: { categoryCode }
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

		return {
			caseReference: caseData.reference,
			documents: publishedCategoryDocuments
		};
	});
};

/**
 * Marks the Examination Library category as unpublished
 * Returns category data for broadcast
 *
 * @param {number} caseId
 * @param {string | string[]} categoryCode
 * @returns {Promise<{caseReference: string, categories: string[]}>}
 */
export const unpublishCategory = async (caseId, categoryCode) => {
	const categoryCodes = Array.isArray(categoryCode) ? categoryCode : [categoryCode];

	return databaseConnector.$transaction(async (tx) => {
		const category = await tx.examinationLibraryCategory.findFirst({
			where: {
				caseId,
				categoryCode: { in: categoryCodes }
			}
		});

		if (!category) {
			throw new Error(`Category not found for case ${caseId} and code ${categoryCodes.join(', ')}`);
		}

		await tx.examinationLibraryCategory.updateMany({
			where: {
				caseId,
				categoryCode: { in: categoryCodes }
			},
			data: {
				publishedStatus: 'unpublished'
			}
		});

		const caseData = await tx.case.findUnique({
			where: { id: caseId },
			select: { reference: true }
		});

		if (!caseData) {
			throw new Error(`Case reference not found for case ${caseId}`);
		}

		return {
			caseReference: caseData.reference,
			categories: categoryCodes
		};
	});
};

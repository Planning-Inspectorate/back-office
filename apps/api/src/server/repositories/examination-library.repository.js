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
 * @param {{categoryCode?: string, publishedStatus?: string}} [filters]
 * @returns {import('#database-client').PrismaPromise<import('#database-client').Document[]>}
 */
export const getDocuments = (caseId, filters = {}) => {
	// The frontend requires documents linked to a category for this case.
	// Since documents are linked to categories via their latestDocumentVersion

	/** @type {Record<string, any>} */
	const versionWhere = {
		examinationLibraryCategoryId: { not: null },
		isDeleted: false
	};

	if (filters.categoryCode) {
		versionWhere.ExaminationLibraryCategory = {
			categoryCode: filters.categoryCode
		};
	}

	if (filters.publishedStatus) {
		versionWhere.publishedStatus = filters.publishedStatus;
	}

	return databaseConnector.document.findMany({
		where: {
			caseId,
			isDeleted: false,
			latestDocumentVersion: versionWhere
		},
		include: {
			latestDocumentVersion: {
				include: {
					ExaminationLibraryCategory: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc' // initial sort order to be confirmed
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

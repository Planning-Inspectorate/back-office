import * as examinationLibraryRepository from '#repositories/examination-library.repository.js';
import {
	sortExaminationLibraryDocuments,
	addDraftExaminationLibraryReferences
} from './examination-library.utils.js';
import { NO_EXAMINATION_LIBRARY_CATEGORY_CODE } from './examination-library.constants.js';

/**
 * @typedef {import('#database-client').ExaminationLibraryCategory} ExaminationLibraryCategory
 * @typedef {import('#database-client').Prisma.ExaminationLibraryCategoryUncheckedCreateInput} ExaminationLibraryCategoryUncheckedCreateInput
 */

/**
 * Get Examination Library Categories for a case.
 * Optionally filter by id or categoryCode.
 *
 * @param {number} caseId
 * @param {{id?: number, categoryCode?: string}} [filters]
 * @returns {Promise<ExaminationLibraryCategory[]>}
 */
export const getExaminationLibraryCategories = async (caseId, filters) => {
	return examinationLibraryRepository.getCategories(caseId, filters);
};

/**
 * Create one or multiple Examination Library Categories for a case.
 *
 * @param {number} caseId
 * @param {Omit<ExaminationLibraryCategoryUncheckedCreateInput, 'caseId'>[]} categoriesData
 * @returns {Promise<import('#database-client').Prisma.BatchPayload>}
 */
export const createExaminationLibraryCategories = async (caseId, categoriesData) => {
	return examinationLibraryRepository.createCategories(caseId, categoriesData);
};

/**
 * Get all Examination Library documents with their assigned category for a given case.
 * Optionally filter by categoryCode and/or publishedStatus.
 * Documents are sorted before pagination is applied.
 *
 * @param {number} caseId
 * @param {{categoryCode?: string, examinationTimetableItemId?: number, publishedStatus?: string}} filters
 * @param {{page: number, pageSize: number}} pagination
 * @param {Object<string, string>[] | undefined} sort
 * @returns {Promise<{
 *   count: number,
 *   items: import('#database-client').Document[]
 * }>}
 */
export const getExaminationLibraryDocuments = async (caseId, filters, pagination, sort) => {
	const documents = await examinationLibraryRepository.getDocuments(caseId, filters);

	const documentsWithDraftReferences = addDraftExaminationLibraryReferences(documents);

	const sortedDocuments = sort
		? sortExaminationLibraryDocuments(documentsWithDraftReferences, sort)
		: documentsWithDraftReferences;

	const startIndex = (pagination.page - 1) * pagination.pageSize;
	const endIndex = startIndex + pagination.pageSize;

	return {
		count: sortedDocuments.length,
		items: sortedDocuments.slice(startIndex, endIndex)
	};
};

/**
 * Get the draft Examination Library reference for a document.
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {string} categoryCode
 * @returns {Promise<string | null>}
 */
export const getExaminationLibraryDocumentDraftReference = async (
	caseId,
	documentGuid,
	categoryCode
) => {
	if (categoryCode === NO_EXAMINATION_LIBRARY_CATEGORY_CODE) {
		return null;
	}

	const documents = await examinationLibraryRepository.getDocuments(caseId, {
		categoryCode
	});

	const documentsWithDraftReferences = addDraftExaminationLibraryReferences(documents);

	const document = documentsWithDraftReferences.find((document) => document.guid === documentGuid);

	return document?.latestDocumentVersion?.draftExaminationLibraryReference ?? null;
};

/**
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {string} examinationRefNo
 */
export const isExaminationLibraryReferenceLocked = async (
	caseId,
	documentGuid,
	examinationRefNo
) => {
	const document = await examinationLibraryRepository.getLockedDocumentByExaminationReference(
		caseId,
		examinationRefNo
	);

	return document !== null && document.guid !== documentGuid;
};

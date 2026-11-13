import BackOfficeAppError from '#utils/app-error.js';
import * as examinationLibraryRepository from '#repositories/examination-library.repository.js';
import {
	sortExaminationLibraryDocuments,
	addDraftExaminationLibraryReferences
} from './examination-library.utils.js';
import { NO_EXAMINATION_LIBRARY_CATEGORY_CODE } from './examination-library.constants.js';
import {
	broadcastExaminationLibraryPublishEvent,
	broadcastExaminationLibraryUnpublishEvent
} from '#infrastructure/event-broadcasters.js';

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
 * @param {{categoryCode?: string, publishedStatus?: string}} filters
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
 * Check if an Examination Library reference number is already locked by another document.
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {string} examinationRefNo
 * @returns {Promise<boolean>}
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

/**
 * Check if a document is eligible to be included when publishing an Examination Library category.
 * Eligible documents are either already locked, or active (non-deleted) with published status.
 *
 * @param {import('#database-client').Document} document
 * @returns {boolean}
 */
const isDocumentEligibleForCategoryPublication = (document) => {
	const version = document.latestDocumentVersion;

	if (version?.examinationLibraryReferenceLocked) {
		return true;
	}

	const isDeleted = document.isDeleted || version?.isDeleted;
	return !isDeleted && version?.publishedStatus === 'published';
};

/**
 * Publishes an Examination Library category
 * Maps Examination Library category document data for broadcast
 *
 * @param {number} caseId
 * @param {string | { categoryCode?: string }} [categoryData]
 * @returns {Promise<any>}
 */
export const publishExaminationLibraryCategory = async (caseId, categoryData) => {
	const categoryCode = typeof categoryData === 'string' ? categoryData : categoryData?.categoryCode;
	if (!categoryCode) {
		throw new Error(
			`Category code is required to publish examination library category for case ${caseId}`
		);
	}

	const [category] = await examinationLibraryRepository.getCategories(caseId, {
		categoryCode
	});

	if (!category) {
		throw new Error(`Category not found for case ${caseId} and code ${categoryCode}`);
	}

	const categoryDocuments = await examinationLibraryRepository.getDocuments(caseId, {
		categoryCode
	});

	const eligibleDocuments = categoryDocuments.filter(isDocumentEligibleForCategoryPublication);
	const isAlreadyPublished = category.publishedStatus?.toLowerCase() === 'published';
	const hasNewDocumentsToPublish = eligibleDocuments.some(
		(doc) => !doc.latestDocumentVersion?.examinationLibraryReferenceLocked
	);

	if (!eligibleDocuments.length || (isAlreadyPublished && !hasNewDocumentsToPublish)) {
		throw new BackOfficeAppError(
			'Examination library category does not contain any new published documents',
			400
		);
	}

	const documentsWithDraftReferences = addDraftExaminationLibraryReferences(eligibleDocuments);

	const publishedCategory = await examinationLibraryRepository.publishCategory(
		caseId,
		categoryCode,
		documentsWithDraftReferences
	);

	if (!publishedCategory?.documents?.length) {
		return null;
	}

	return broadcastExaminationLibraryPublishEvent(publishedCategory);
};

/**
 * Unpublishes an Examination Library category
 *
 * @param {number} caseId
 * @param {string} categoryCode
 * @returns {Promise<any>}
 */
export const unpublishExaminationLibraryCategory = async (caseId, categoryCode) => {
	if (!categoryCode) {
		throw new Error(
			`Category code is required to unpublish examination library category for case ${caseId}`
		);
	}

	const [category] = await examinationLibraryRepository.getCategories(caseId, {
		categoryCode
	});

	if (!category) {
		throw new Error(`Category not found for case ${caseId} and code ${categoryCode}`);
	}

	const unpublishedCategory = await examinationLibraryRepository.unpublishCategory(
		caseId,
		categoryCode
	);

	return broadcastExaminationLibraryUnpublishEvent(unpublishedCategory);
};

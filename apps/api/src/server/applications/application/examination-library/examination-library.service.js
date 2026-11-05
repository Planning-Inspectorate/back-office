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

	// Only documents that are currently locked or eligible for publication:
	// - Already locked documents (retain their existing references)
	// - Unlocked documents that are NOT deleted and have publishedStatus === 'published'
	const eligibleDocuments = categoryDocuments.filter((document) => {
		const version = document.latestDocumentVersion;
		if (version?.examinationLibraryReferenceLocked) {
			return true;
		}
		return !document.isDeleted && !version?.isDeleted && version?.publishedStatus === 'published';
	});

	// Guard: Cannot publish an in-progress category with no published documents
	const hasPublishedDocuments = eligibleDocuments.some(
		(doc) => doc.latestDocumentVersion?.publishedStatus === 'published'
	);

	const hasLockedDocuments = eligibleDocuments.some(
		(doc) => doc.latestDocumentVersion?.examinationLibraryReferenceLocked
	);

	if (!hasPublishedDocuments && !hasLockedDocuments) {
		throw new BackOfficeAppError(
			'You cannot publish an examination library category with no published documents',
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

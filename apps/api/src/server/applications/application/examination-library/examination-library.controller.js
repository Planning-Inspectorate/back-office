import BackOfficeAppError from '#utils/app-error.js';
import {
	getExaminationLibraryCategories,
	createExaminationLibraryCategories,
	getExaminationLibraryDocuments,
	getExaminationLibraryDocumentDraftReference,
	publishExaminationLibraryCategory,
	unpublishExaminationLibraryCategory
} from './examination-library.service.js';
import { sortByFromQuery } from '#utils/query/sort-by.js';

/**
 * @type {import('express').RequestHandler}
 */
export const getExaminationLibraryCategoriesHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { id, categoryCode } = req.query;

	const filters = {};
	if (id !== undefined && id !== null && id !== '') {
		filters.id = Number(id);
	}
	if (categoryCode) filters.categoryCode = String(categoryCode);

	const categories = await getExaminationLibraryCategories(caseId, filters);
	res.send(categories);
};

/**
 * @type {import('express').RequestHandler}
 */
export const createExaminationLibraryCategoriesHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const categoriesData = Array.isArray(req.body) ? req.body : [req.body];

	try {
		const result = await createExaminationLibraryCategories(caseId, categoriesData);
		res.send(result);
	} catch (/** @type {*} */ error) {
		if (error?.code === 'P2002') {
			throw new BackOfficeAppError(
				'An examination library category with this code and name already exists for this case',
				400
			);
		}
		throw error;
	}
};

/**
 * @type {import('express').RequestHandler}
 */
export const getExaminationLibraryDocumentsHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const {
		categoryCode,
		examinationTimetableItemId,
		publishedStatus,
		page = '1',
		pageSize = '25',
		sortBy
	} = req.query;

	const filters = {};

	if (categoryCode) {
		filters.categoryCode = String(categoryCode);
	}

	if (examinationTimetableItemId) {
		filters.examinationTimetableItemId = Number(examinationTimetableItemId);
	}

	if (publishedStatus) {
		filters.publishedStatus = String(publishedStatus);
	}

	const pagination = {
		page: Number(page),
		pageSize: Number(pageSize)
	};

	const sort = sortByFromQuery(sortBy);

	const { count, items } = await getExaminationLibraryDocuments(caseId, filters, pagination, sort);

	res.send({
		page: pagination.page,
		pageSize: pagination.pageSize,
		pageCount: Math.ceil(Math.max(1, count) / pageSize),
		itemCount: count,
		items
	});
};

/**
 * @type {import('express').RequestHandler}
 */
export const getExaminationLibraryDocumentDraftReferenceHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { documentGuid } = req.params;
	const { categoryCode } = req.query;

	const draftExaminationLibraryReference = await getExaminationLibraryDocumentDraftReference(
		caseId,
		documentGuid,
		categoryCode
	);

	res.send({ draftExaminationLibraryReference });
};

/**
 * Publishes the Examination Library category
 *
 * @type {import('express').RequestHandler}
 */
export const publishExaminationLibraryCategoryHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { categoryCode } = req.body;

	let publishedCategory = {};

	try {
		publishedCategory = await publishExaminationLibraryCategory(caseId, categoryCode);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Case ${caseId} not found`, 404);
		}
	}

	if (!Object.keys(publishedCategory).length || !publishedCategory.examinationDocuments.length) {
		throw new BackOfficeAppError(`Error publishing category with code ${categoryCode}`, 500);
	}

	return res.send(publishedCategory);
};

/**
 * Unpublishes the Examination Library category
 *
 * @type {import('express').RequestHandler}
 */
export const unpublishExaminationLibraryCategoryHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { categoryCode } = req.body;

	let unpublishedCategory = {};

	try {
		unpublishedCategory = await unpublishExaminationLibraryCategory(caseId, categoryCode);
	} catch (error) {
		if (error?.code === 'P2025') {
			throw new BackOfficeAppError(`Case ${caseId} not found`, 404);
		}
	}

	if (!Object.keys(unpublishedCategory).length || !unpublishedCategory.categories.length) {
		throw new BackOfficeAppError(`Error unpublishing category with code ${categoryCode}`, 404);
	}

	return res.send(unpublishedCategory);
};

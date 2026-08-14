import {
	getExaminationLibraryCategories,
	createExaminationLibraryCategories,
	getExaminationLibraryDocuments
} from './examination-library.service.js';

/**
 * @type {import('express').RequestHandler}
 */
export const getExaminationLibraryCategoriesHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { id, categoryCode } = req.query;

	const filters = {};
	if (id) filters.id = Number(id);
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

	const result = await createExaminationLibraryCategories(caseId, categoriesData);
	res.send(result);
};

/**
 * @type {import('express').RequestHandler}
 */
export const getExaminationLibraryDocumentsHandler = async (req, res) => {
	const caseId = Number(req.params.id);
	const { categoryCode, publishedStatus } = req.query;

	const filters = {};
	if (categoryCode) filters.categoryCode = String(categoryCode);
	if (publishedStatus) filters.publishedStatus = String(publishedStatus);

	const documents = await getExaminationLibraryDocuments(caseId, filters);
	res.send(documents);
};

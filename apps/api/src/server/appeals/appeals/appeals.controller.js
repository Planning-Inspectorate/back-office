import appealRepository from '../../repositories/appeal.repository.js';
import { getPageCount } from '../../utils/database-pagination.js';
import {
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_NOT_FOUND
} from '../constants.js';
import appealFormatter from './appeals.formatter.js';

/** @typedef {import('./appeals.routes.js').AppealParams} AppealParams */

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const getAppeals = async (req, res) => {
	const pageNumber = Number(req.query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(req.query.pageSize) || DEFAULT_PAGE_SIZE;

	const [itemCount, appeals = []] = await appealRepository.getAll(pageNumber, pageSize);
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppeals(appeal));

	return res.send({
		itemCount,
		items: formattedAppeals,
		page: pageNumber,
		pageCount: getPageCount(itemCount, pageSize),
		pageSize
	});
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const getAppealById = async (req, res) => {
	const {
		params: { appealId }
	} = req;
	const appeal = await appealRepository.getById(Number(appealId));

	if (!appeal) {
		return res.status(404).send({ errors: { appealId: ERROR_NOT_FOUND } });
	}

	const formattedAppeal = appealFormatter.formatAppeal(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const updateAppealById = async (req, res) => {
	const {
		body,
		params: { appealId }
	} = req;

	try {
		await appealRepository.updateById(Number(appealId), body);
	} catch (error) {
		if (error) {
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppealById, getAppeals, updateAppealById };

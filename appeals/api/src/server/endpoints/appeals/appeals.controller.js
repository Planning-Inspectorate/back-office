import appealRepository from '#repositories/appeal.repository.js';
import { getPageCount } from '#utils/database-pagination.js';
import logger from '#utils/logger.js';

import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatAppeal, formatAppeals } from './appeals.formatter.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const getAppeals = async (req, res) => {
	const { query } = req;
	const pageNumber = Number(query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;
	const searchTerm = String(query.searchTerm);

	const [itemCount, appeals = []] = await appealRepository.getAll(pageNumber, pageSize, searchTerm);
	const formattedAppeals = appeals.map((appeal) => formatAppeals(appeal));

	return res.send({
		itemCount,
		items: formattedAppeals,
		page: pageNumber,
		pageCount: getPageCount(itemCount, pageSize),
		pageSize
	});
};

/**
 * @type {RequestHandler}
 * @returns {object}
 */
const getAppealById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatAppeal(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const updateAppealById = async (req, res) => {
	const { body, params } = req;
	const appealId = Number(params.appealId);

	try {
		await appealRepository.updateAppealById(appealId, body);
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppealById, getAppeals, updateAppealById };

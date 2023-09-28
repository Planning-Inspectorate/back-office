import appealRepository from '#repositories/appeal.repository.js';
import { getPageCount } from '#utils/database-pagination.js';
import logger from '#utils/logger.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import { formatAppeal, formatAppeals } from './appeals.formatter.js';
import { assignUser, assignedUserType } from './appeals.service.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getAppeals = async (req, res) => {
	const { query } = req;
	const pageNumber = Number(query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;
	const searchTerm = String(query.searchTerm);

	const [itemCount, appeals = []] = await appealRepository.getAllAppeals(
		pageNumber,
		pageSize,
		searchTerm
	);
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
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const getAppealById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatAppeal(appeal);

	return res.send(formattedAppeal);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateAppealById = async (req, res) => {
	const {
		body,
		body: { caseOfficer, inspector, startedAt },
		params
	} = req;
	const appealId = Number(params.appealId);
	const azureAdUserId = String(req.get('azureAdUserId'));

	try {
		assignedUserType({ caseOfficer, inspector })
			? await assignUser(appealId, { azureAdUserId, caseOfficer, inspector })
			: await appealRepository.updateAppealById(appealId, {
					startedAt
			  });
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppealById, getAppeals, updateAppealById };

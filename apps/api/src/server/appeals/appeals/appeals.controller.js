import appealRepository from '../../repositories/appeal.repository.js';
import { getPageCount } from '../../utils/database-pagination.js';
import logger from '../../utils/logger.js';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, ERROR_FAILED_TO_SAVE_DATA } from '../constants.js';
import appealFormatter from './appeals.formatter.js';
import { calculateTimetable } from './appeals.service.js';

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
	const { appeal } = req;
	const formattedAppeal = appealFormatter.formatAppeal(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const updateAppealById = async (req, res) => {
	const {
		appeal: { appealType },
		body,
		body: { startedAt },
		params
	} = req;
	const appealId = Number(params.appealId);

	try {
		if (appealType) {
			const timetable = await calculateTimetable(appealType.shorthand, startedAt);

			if (timetable) {
				await appealRepository.upsertAppealTimetableById(appealId, timetable);
			}
		}

		await appealRepository.updateById(appealId, body);
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const getLpaQuestionnaireById = async (req, res) => {
	const { appeal } = req;
	const formattedAppeal = appealFormatter.formatLpaQuestionnaire(appeal);

	return res.send(formattedAppeal);
};

export { getAppealById, getAppeals, getLpaQuestionnaireById, updateAppealById };

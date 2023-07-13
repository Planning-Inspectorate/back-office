import { format } from 'date-fns';
import appealRepository from '../../repositories/appeal.repository.js';
import { getPageCount } from '../../utils/database-pagination.js';
import logger from '../../utils/logger.js';
import {
	DEFAULT_DATE_FORMAT_DATABASE,
	DEFAULT_DATE_FORMAT_DISPLAY,
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
	ERROR_FAILED_TO_SAVE_DATA
} from '../constants.js';
import appealFormatter from './appeals.formatter.js';
import {
	calculateTimetable,
	isOutcomeIncomplete,
	isOutcomeInvalid,
	isOutcomeValid,
	joinDateAndTime,
	recalculateDateIfNotBusinessDay
} from './appeals.service.js';
import transitionState from '../../state/transition-state.js';
import config from '../../config/config.js';

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
 * @type {RequestHandler}
 * @returns {object}
 */
const getAppealById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = appealFormatter.formatAppeal(appeal);

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

/**
 * @type {RequestHandler}
 * @returns {object}
 */
const getLpaQuestionnaireById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = appealFormatter.formatLpaQuestionnaire(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {object}
 */
const getAppellantCaseById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = appealFormatter.formatAppellantCase(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const updateAppellantCaseById = async (req, res) => {
	const {
		appeal: { id: appealId, appealStatus, appealType, reference, appellant },
		body,
		body: { incompleteReasons, invalidReasons, otherNotValidReasons },
		params: { appellantCaseId },
		validationOutcome
	} = req;

	try {
		let startedAt = undefined;
		let timetable = undefined;

		if (isOutcomeValid(validationOutcome.name) && appealType) {
			startedAt = await recalculateDateIfNotBusinessDay(
				joinDateAndTime(format(new Date(), DEFAULT_DATE_FORMAT_DATABASE))
			);
			timetable = await calculateTimetable(appealType.shorthand, startedAt);

			await req.notifyClient.sendEmail(
				config.govNotify.template.validAppellantCase,
				appellant?.email,
				{
					appeal_reference: reference,
					appeal_type: appealType.shorthand,
					date_started: format(startedAt, DEFAULT_DATE_FORMAT_DISPLAY)
				}
			);
		}

		await appealRepository.updateAppellantCaseValidationOutcome({
			appellantCaseId: Number(appellantCaseId),
			validationOutcomeId: validationOutcome.id,
			otherNotValidReasons,
			...(isOutcomeIncomplete(validationOutcome.name) && { incompleteReasons }),
			...(isOutcomeInvalid(validationOutcome.name) && { invalidReasons }),
			...(isOutcomeValid(validationOutcome.name) && { appealId, startedAt, timetable })
		});

		await transitionState(appealId, appealType, appealStatus, validationOutcome.name);
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
 */
const updateLPAQuestionnaireById = async (req, res) => {
	const {
		appeal: { id: appealId, appealStatus, appealType },
		body,
		body: { incompleteReasons, otherNotValidReasons },
		params: { lpaQuestionnaireId },
		validationOutcome
	} = req;

	try {
		let timetable = undefined;

		if (body.lpaQuestionnaireDueDate) {
			timetable = {
				lpaQuestionnaireDueDate: await recalculateDateIfNotBusinessDay(body.lpaQuestionnaireDueDate)
			};
		}

		await appealRepository.updateLPAQuestionnaireValidationOutcome({
			lpaQuestionnaireId: Number(lpaQuestionnaireId),
			validationOutcomeId: validationOutcome.id,
			otherNotValidReasons,
			...(isOutcomeIncomplete(validationOutcome.name) && {
				appealId,
				incompleteReasons,
				timetable
			})
		});

		await transitionState(appealId, appealType, appealStatus, validationOutcome.name);

		body.lpaQuestionnaireDueDate = timetable?.lpaQuestionnaireDueDate;
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export {
	getAppealById,
	getAppeals,
	getAppellantCaseById,
	getLpaQuestionnaireById,
	updateAppealById,
	updateAppellantCaseById,
	updateLPAQuestionnaireById
};

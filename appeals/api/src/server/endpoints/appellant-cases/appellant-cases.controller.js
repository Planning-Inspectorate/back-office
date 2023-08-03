import { format } from 'date-fns';
import appealRepository from '#repositories/appeal.repository.js';
import appellantCaseRepository from '#repositories/appellant-case.repository.js';
import { getFoldersForAppeal } from '#endpoints/documents/documents.service.js';
import logger from '#utils/logger.js';
import {
	DEFAULT_DATE_FORMAT_DATABASE,
	DEFAULT_DATE_FORMAT_DISPLAY,
	ERROR_FAILED_TO_SAVE_DATA
} from '../constants.js';
import { formatAppellantCase } from './appellant-cases.formatter.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import {
	isOutcomeIncomplete,
	isOutcomeInvalid,
	isOutcomeValid
} from '#utils/check-validation-outcome.js';
import { calculateTimetable, recalculateDateIfNotBusinessDay } from '../../utils/business-days.js';
import transitionState from '../../state/transition-state.js';
import config from '../../config/config.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const getAppellantCaseById = async (req, res) => {
	const { appeal } = req;
	const folders = await getFoldersForAppeal(appeal, 'appellantCase');
	const formattedAppeal = formatAppellantCase(appeal, folders);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const updateAppellantCaseById = async (req, res) => {
	const {
		appeal: { id: appealId, appealStatus, appealType, reference, appellant },
		body,
		body: { appealDueDate, incompleteReasons, invalidReasons, otherNotValidReasons },
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

		await appellantCaseRepository.updateAppellantCaseValidationOutcome({
			appellantCaseId: Number(appellantCaseId),
			validationOutcomeId: validationOutcome.id,
			otherNotValidReasons,
			...(isOutcomeIncomplete(validationOutcome.name) && { incompleteReasons }),
			...(isOutcomeInvalid(validationOutcome.name) && { invalidReasons }),
			...(isOutcomeValid(validationOutcome.name) && { appealId, startedAt, timetable })
		});

		await transitionState(appealId, appealType, appealStatus, validationOutcome.name);

		if (appealDueDate) {
			await appealRepository.updateAppealById(appealId, { dueDate: appealDueDate });
		}
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppellantCaseById, updateAppellantCaseById };

import { calculateTimetable, recalculateDateIfNotBusinessDay } from '#utils/business-days.js';
import {
	isOutcomeIncomplete,
	isOutcomeInvalid,
	isOutcomeValid
} from '#utils/check-validation-outcome.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';
import joinDateAndTime from '#utils/join-date-and-time.js';
import { format } from 'date-fns';
import {
	AUDIT_TRAIL_CASE_TIMELINE_CREATED,
	DEFAULT_DATE_FORMAT_DATABASE,
	DEFAULT_DATE_FORMAT_DISPLAY,
	ERROR_NOT_FOUND
} from '#endpoints/constants.js';
import config from '#config/config.js';
import appellantCaseRepository from '#repositories/appellant-case.repository.js';
import transitionState from '../../state/transition-state.js';
import appealRepository from '#repositories/appeal.repository.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateAppellantCaseValidationOutcomeParams} UpdateAppellantCaseValidationOutcomeParams */

/**
 * @type {RequestHandler}
 * @returns {object | void}
 */
const checkAppellantCaseExists = (req, res, next) => {
	const {
		appeal,
		params: { appellantCaseId }
	} = req;
	const hasAppellantCase = appeal.appellantCase?.id === Number(appellantCaseId);

	if (!hasAppellantCase) {
		return res.status(404).send({ errors: { appellantCaseId: ERROR_NOT_FOUND } });
	}

	next();
};

/**
 * @param {UpdateAppellantCaseValidationOutcomeParams} param0
 */
const updateAppellantCaseValidationOutcome = async ({
	appeal,
	appellantCaseId,
	azureAdUserId,
	data,
	notifyClient,
	validationOutcome
}) => {
	const { appealStatus, appealType, appellant, id: appealId, reference } = appeal;
	const { appealDueDate, incompleteReasons, invalidReasons } = data;

	let startedAt = undefined;
	let timetable = undefined;

	if (isOutcomeValid(validationOutcome.name) && appealType) {
		startedAt = await recalculateDateIfNotBusinessDay(
			joinDateAndTime(format(new Date(), DEFAULT_DATE_FORMAT_DATABASE))
		);
		timetable = await calculateTimetable(appealType.shorthand, startedAt);

		await notifyClient.sendEmail(
			config.govNotify.template.validAppellantCase,
			appellant?.customer?.email,
			{
				appeal_reference: reference,
				appeal_type: appealType.shorthand,
				date_started: format(startedAt, DEFAULT_DATE_FORMAT_DISPLAY)
			}
		);

		await createAuditTrail({
			appealId,
			azureAdUserId,
			details: AUDIT_TRAIL_CASE_TIMELINE_CREATED
		});
	}

	await appellantCaseRepository.updateAppellantCaseValidationOutcome({
		appellantCaseId,
		validationOutcomeId: validationOutcome.id,
		...(isOutcomeIncomplete(validationOutcome.name) && { incompleteReasons }),
		...(isOutcomeInvalid(validationOutcome.name) && { invalidReasons }),
		...(isOutcomeValid(validationOutcome.name) && { appealId, startedAt, timetable })
	});

	await transitionState(appealId, appealType, azureAdUserId, appealStatus, validationOutcome.name);

	if (appealDueDate) {
		await appealRepository.updateAppealById(appealId, { dueDate: appealDueDate });
	}

	await broadcastAppealState(appealId);
};

export { checkAppellantCaseExists, updateAppellantCaseValidationOutcome };

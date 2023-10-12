import logger from '#lib/logger.js';
import * as lpaQuestionnaireService from '../lpa-questionnaire.service.js';
import { mapIncompleteReasonOptionsToCheckboxItemParameters } from '../lpa-questionnaire.mapper.js';
import { getLPAQuestionnaireIncompleteReasonOptions } from '../lpa-questionnaire.service.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { webDateToDisplayDate, dateToDisplayDate } from '#lib/dates.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { getNotValidReasonsTextFromRequestBody } from '#lib/mappers/validation-outcome-reasons.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderIncompleteReason = async (request, response) => {
	const { errors, body, session } = request;

	if (!objectContainsAllKeys(session, ['appealId', 'appealReference', 'lpaQuestionnaireId'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference, lpaQuestionnaireId } = session;

	const lpaQuestionnaireResponse = await lpaQuestionnaireService.getLpaQuestionnaireFromId(
		request.apiClient,
		appealId,
		lpaQuestionnaireId
	);

	if (!lpaQuestionnaireResponse) {
		return response.render('app/404.njk');
	}

	if (
		session.webLPAQuestionnaireReviewOutcome &&
		(session.webLPAQuestionnaireReviewOutcome.appealId !== appealId ||
			session.webLPAQuestionnaireReviewOutcome.lpaQuestionnaireId !== lpaQuestionnaireId ||
			session.webLPAQuestionnaireReviewOutcome.validationOutcome !== 'incomplete')
	) {
		delete session.webLPAQuestionnaireReviewOutcome;
	}

	const incompleteReasonOptions = await getLPAQuestionnaireIncompleteReasonOptions(
		request.apiClient
	);

	if (incompleteReasonOptions) {
		const mappedIncompleteReasonOptions = mapIncompleteReasonOptionsToCheckboxItemParameters(
			incompleteReasonOptions,
			body,
			session.webLPAQuestionnaireReviewOutcome,
			lpaQuestionnaireResponse.validation
		);

		return response.render('appeals/appeal/lpa-questionnaire-incomplete.njk', {
			appeal: {
				id: appealId,
				shortReference: appealShortReference(appealReference)
			},
			lpaQuestionnaireId,
			reasonOptions: mappedIncompleteReasonOptions,
			errors
		});
	}

	return response.render('app/500.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderUpdateDueDate = async (request, response) => {
	const { errors } = request;
	const lpaQCurrentDueDateIso =
		request.currentAppeal?.documentationSummary?.lpaQuestionnaire?.dueDate;
	const lpaQCurrentDueDate = lpaQCurrentDueDateIso && dateToDisplayDate(lpaQCurrentDueDateIso);
	const sideNote =
		lpaQCurrentDueDate && `The current due date for the LPA questionnaire is ${lpaQCurrentDueDate}`;

	if (
		!objectContainsAllKeys(request.session, ['appealId', 'appealReference', 'lpaQuestionnaireId'])
	) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference, lpaQuestionnaireId } = request.session;

	return response.render('appeals/appeal/update-due-date.njk', {
		appeal: {
			id: appealId,
			shortReference: appealShortReference(appealReference)
		},
		sideNote,
		page: {
			title: 'LPA questionnaire due date',
			text: 'Update LPA questionnaire due date'
		},
		continueButtonText: 'Save and continue',
		backButtonUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/`,
		skipButtonUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/check-your-answers`,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderDecisionIncompleteConfirmationPage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	const rows = [
		{
			text: 'We’ve sent an email to the appellant and LPA to confirm their questionnaire is incomplete, and let them know what to do to complete it.'
		}
	];

	if (request.session.lpaQuestionnaireUpdatedDueDate) {
		rows.push({
			text: `We also let them know the due date has changed to the ${webDateToDisplayDate(
				request.session.lpaQuestionnaireUpdatedDueDate
			)}.`
		});
	}

	rows.push({
		text: 'Go to case details',
		// @ts-ignore
		href: `/appeals-service/appeal-details/${appealId}`
	});

	response.render('app/confirmation.njk', {
		panel: {
			title: 'LPA questionnaire incomplete',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preTitle: 'The review of LPA questionnaire is finished.',
			title: {
				text: 'What happens next'
			},
			rows
		}
	});
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getIncompleteReason = async (request, response) => {
	renderIncompleteReason(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postIncompleteReason = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderIncompleteReason(request, response);
	}

	try {
		if (
			!objectContainsAllKeys(request.session, ['appealId', 'appealReference', 'lpaQuestionnaireId'])
		) {
			return response.render('app/500.njk');
		}

		const { appealId, appealReference, lpaQuestionnaireId } = request.session;

		/** @type {import('../lpa-questionnaire.types.js').LPAQuestionnaireSessionValidationOutcome} */
		request.session.webLPAQuestionnaireReviewOutcome = {
			appealId,
			appealReference,
			lpaQuestionnaireId,
			validationOutcome: 'incomplete',
			reasons: request.body.incompleteReason,
			reasonsText: getNotValidReasonsTextFromRequestBody(request.body, 'incompleteReason')
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/incomplete/date`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getUpdateDueDate = async (request, response) => {
	renderUpdateDueDate(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postUpdateDueDate = async (request, response) => {
	if (request.errors) {
		return renderUpdateDueDate(request, response);
	}

	if (
		!objectContainsAllKeys(request.session, [
			'webLPAQuestionnaireReviewOutcome',
			'appealId',
			'lpaQuestionnaireId'
		])
	) {
		return response.render('app/500.njk');
	}

	const { appealId, lpaQuestionnaireId } = request.session;

	const { body } = request;

	if (!objectContainsAllKeys(body, ['due-date-day', 'due-date-month', 'due-date-year'])) {
		return response.render('app/500.njk');
	}

	try {
		const updatedDueDateDay = parseInt(body['due-date-day'], 10);
		const updatedDueDateMonth = parseInt(body['due-date-month'], 10);
		const updatedDueDateYear = parseInt(body['due-date-year'], 10);

		if (
			Number.isNaN(updatedDueDateDay) ||
			Number.isNaN(updatedDueDateMonth) ||
			Number.isNaN(updatedDueDateYear)
		) {
			return response.render('app/500.njk');
		}

		request.session.webLPAQuestionnaireReviewOutcome.updatedDueDate = {
			day: updatedDueDateDay,
			month: updatedDueDateMonth,
			year: updatedDueDateYear
		};

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}/check-your-answers`
		);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getConfirmation = async (request, response) => {
	renderDecisionIncompleteConfirmationPage(request, response);
};

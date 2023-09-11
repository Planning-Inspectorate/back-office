import logger from '../../../../lib/logger.js';
import { mapIncompleteReasonsToCheckboxItemParameters } from '../lpa-questionnaire.mapper.js';
import { getLPAQuestionnaireIncompleteReasons } from '../lpa-questionnaire.service.js';
import { objectContainsAllKeys } from '../../../../lib/object-utilities.js';
import { getIdByNameFromIdNamePairs } from '../../../../lib/id-name-pairs.js';
import { webDateToDisplayDate, dateToDisplayDate } from '../../../../lib/dates.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderIncompleteReason = async (request, response) => {
	const { errors, body } = request;

	if (
		!objectContainsAllKeys(request.session, ['appealId', 'appealReference', 'lpaQuestionnaireId'])
	) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference, lpaQuestionnaireId } = request.session;

	const existingWebLPAQuestionnaireReviewOutcome = request.session.webLPAQuestionnaireReviewOutcome;

	if (
		existingWebLPAQuestionnaireReviewOutcome &&
		(existingWebLPAQuestionnaireReviewOutcome.appealId !== appealId ||
			existingWebLPAQuestionnaireReviewOutcome.lpaQuestionnaireId !== lpaQuestionnaireId ||
			existingWebLPAQuestionnaireReviewOutcome.validationOutcome !== 'incomplete')
	) {
		delete request.session.webLPAQuestionnaireReviewOutcome;
	}

	const { webLPAQuestionnaireReviewOutcome } = request.session;
	const incompleteReasonOptions = await getLPAQuestionnaireIncompleteReasons(request.apiClient);

	if (incompleteReasonOptions) {
		const incompleteReasons =
			body.incompleteReason || webLPAQuestionnaireReviewOutcome?.incompleteReasons;
		const otherReason = body.otherReason || webLPAQuestionnaireReviewOutcome?.otherReason;
		const mappedIncompleteReasonOptions = mapIncompleteReasonsToCheckboxItemParameters(
			incompleteReasonOptions,
			incompleteReasons
		);

		const appealReferenceFragments = appealReference.split('/');

		return response.render('appeals/appeal/lpa-questionnaire-incomplete.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			lpaQuestionnaireId,
			reasonOptions: mappedIncompleteReasonOptions,
			otherReasonId: getIdByNameFromIdNamePairs(incompleteReasonOptions, 'other'),
			otherReason,
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

	const appealReferenceFragments = appealReference.split('/');

	return response.render('appeals/appeal/update-due-date.njk', {
		appeal: {
			id: appealId,
			shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
		},
		sideNote,
		page: {
			title: 'LPA questionnaire due date',
			text: 'Update LPA questionnaire due date'
		},
		backButtonUrl: `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaQuestionnaireId}`,
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

		request.session.webLPAQuestionnaireReviewOutcome = {
			appealId,
			appealReference,
			lpaQuestionnaireId,
			validationOutcome: 'incomplete',
			incompleteReasons: request.body.incompleteReason,
			otherReason: request.body.otherReason
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

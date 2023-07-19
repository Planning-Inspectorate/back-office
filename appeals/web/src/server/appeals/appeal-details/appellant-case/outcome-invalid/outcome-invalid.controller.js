import logger from '../../../../lib/logger.js';
import * as appellantCaseService from '../appellant-case.service.js';
import { mapInvalidOrIncompleteReasonsToCheckboxItemParameters } from '../appellant-case.mapper.js';
import { objectContainsAllKeys } from '../../../../lib/object-utilities.js';
import { getIdByNameFromIdNamePairs } from '../../../../lib/id-name-pairs.js';
import { appellantCaseReviewOutcomes } from '../../../appeal.constants.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderInvalidReason = async (request, response) => {
	const { errors, body } = request;

	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const {
		// @ts-ignore
		appealId,
		// @ts-ignore
		appealReference,
		// @ts-ignore
		appellantCaseReviewOutcome
	} = request.session;
	const invalidReasonOptions = await appellantCaseService.getAppellantCaseInvalidReasons();

	if (invalidReasonOptions) {
		const invalidReasons = body.invalidReason || appellantCaseReviewOutcome?.invalidReasons;
		const otherReason = body.otherReason || appellantCaseReviewOutcome?.otherNotValidReasons;
		const mappedInvalidReasonOptions = mapInvalidOrIncompleteReasonsToCheckboxItemParameters(
			invalidReasonOptions,
			invalidReasons
		);

		const appealReferenceFragments = appealReference.split('/');

		return response.render('appeals/appeal/appellant-case-invalid-incomplete.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			notValidStatus: appellantCaseReviewOutcomes.invalid,
			reasonOptions: mappedInvalidReasonOptions,
			otherReasonId: getIdByNameFromIdNamePairs(invalidReasonOptions, 'other'),
			otherReason,
			errors
		});
	}

	return response.render('app/500.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} appealShortReference
 * @param {number} appealId
 */
export const renderDecisionInvalidConfirmationPage = async (
	response,
	appealShortReference,
	appealId
) => {
	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal invalid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealShortReference
			}
		},
		body: {
			preTitle: 'The appeal has been closed.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent an email to the appellant and LPA to inform them the case is invalid."
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	});
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getInvalidReason = async (request, response) => {
	renderInvalidReason(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postInvalidReason = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderInvalidReason(request, response);
	}

	try {
		// @ts-ignore
		request.session.webAppellantCaseReviewOutcome = {
			validationOutcome: appellantCaseReviewOutcomes.invalid,
			invalidOrIncompleteReasons: request.body.invalidReason,
			otherNotValidReasons: request.body.otherReason
		};

		return response.redirect(
			// @ts-ignore
			`/appeals-service/appeal-details/${request.session.appealId}/appellant-case/check-your-answers`
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

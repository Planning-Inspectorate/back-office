import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import {
	mapResponseToSummaryListBuilderParameters,
	mapInvalidReasonsToCheckboxItemParameters,
	mapPostedReviewOutcomeToApiReviewOutcome,
	mapReviewOutcomeToSummaryListBuilderParameters
} from './appellant-case.mapper.js';
import { generateSummaryList } from '../../lib/nunjucks-template-builders/summary-list-builder.js';
import { objectContainsAllKeys } from '../../lib/object-utilities.js';

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').Request} request
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAppellantCase = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const appealReferenceFragments = appealDetails?.appealReference.split('/');
		const formattedSiteAddress = appealDetails?.appealSite
			? Object.values(appealDetails?.appealSite)?.join(', ')
			: 'Address not known';

		const appellantCaseResponse = await appellantCaseService
			.getAppellantCaseFromAppealId(appealDetails?.appealId, appealDetails?.appellantCaseId)
			.catch((error) => logger.error(error));

		const mappedAppellantCaseSections =
			mapResponseToSummaryListBuilderParameters(appellantCaseResponse);
		const formattedSections = [];
		for (const section of mappedAppellantCaseSections) {
			formattedSections.push(generateSummaryList(section.rows, section.header));
		}

		return response.render('appeals/appeal/appellant-case.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
				siteAddress: formattedSiteAddress ?? 'No site address for this appeal',
				localPlanningAuthority: appealDetails?.localPlanningDepartment
			},
			summaryList: { formattedSections },
			errors
		});
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} appealShortReference
 * @param {number} appealId
 */
const renderDecisionValidConfirmationPage = async (response, appealShortReference, appealId) => {
	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal valid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealShortReference
			}
		},
		body: {
			preTitle: 'The appeal has been marked as valid.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent the start letter email to the appellant and LPA."
				},
				{
					text: 'The case has been published on the Appeals Casework Portal.'
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	});
};

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} appealShortReference
 * @param {number} appealId
 */
const renderDecisionInvalidConfirmationPage = async (response, appealShortReference, appealId) => {
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

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').Request} request
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
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
		const mappedInvalidReasonOptions = mapInvalidReasonsToCheckboxItemParameters(
			invalidReasonOptions,
			invalidReasons
		);

		const appealReferenceFragments = appealReference.split('/');

		return response.render('appeals/appeal/appellant-case-invalid.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			invalidReasonOptions: mappedInvalidReasonOptions,
			otherReasonId: invalidReasonOptions.find((reason) => reason.name.toLowerCase() === 'other')
				?.id,
			otherReason,
			errors
		});
	}

	return response.render('app/500.njk');
};

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').Request} request
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderCheckAndConfirm = async (request, response) => {
	try {
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'appealReference',
				'appellantCaseId',
				'appellantCaseReviewOutcome'
			])
		) {
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
		if (!invalidReasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const appealReferenceFragments = appealReference.split('/');
		const mappedCheckAndConfirmSection = mapReviewOutcomeToSummaryListBuilderParameters(
			appellantCaseReviewOutcome,
			invalidReasonOptions
		);
		const formattedSections = [generateSummaryList(mappedCheckAndConfirmSection.rows)];

		return response.render('app/check-and-confirm.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			title: {
				text: 'Check your answers before confirming your review'
			},
			insetText: 'Confirming this review will inform the appellant of the outcome',
			summaryList: { formattedSections },
			backLinkUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/${appellantCaseReviewOutcome.validationOutcome}`
		});
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
export const getAppellantCase = async (request, response) => {
	renderAppellantCase(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAppellantCase = async (request, response) => {
	const {
		body: { reviewOutcome },
		errors
	} = request;

	if (errors) {
		return renderAppellantCase(request, response);
	}

	try {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const { appealId, appellantCaseId, appealReference } = appealDetails;

			// @ts-ignore
			request.session.appealId = appealId;
			// @ts-ignore
			request.session.appellantCaseId = appellantCaseId;
			// @ts-ignore
			request.session.appealReference = appealReference;

			if (reviewOutcome === 'valid') {
				await appellantCaseService.setReviewOutcomeForAppellantCase(
					appealId,
					appellantCaseId,
					mapPostedReviewOutcomeToApiReviewOutcome('valid')
				);

				return renderDecisionValidConfirmationPage(response, appealReference, appealId);
			} else {
				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/appellant-case/${reviewOutcome}`
				);
			}
		}

		return response.render('app/404.njk');
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
		request.session.appellantCaseReviewOutcome = mapPostedReviewOutcomeToApiReviewOutcome(
			'invalid',
			request.body.invalidReason,
			request.body.otherReason
		);

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

/** @type {import('@pins/express').RequestHandler<Response>} */
export const getCheckAndConfirm = async (request, response) => {
	renderCheckAndConfirm(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postCheckAndConfirm = async (request, response) => {
	try {
		const {
			// @ts-ignore
			appealId,
			// @ts-ignore
			appealReference,
			// @ts-ignore
			appellantCaseId,
			// @ts-ignore
			appellantCaseReviewOutcome
		} = request.session;

		await appellantCaseService.setReviewOutcomeForAppellantCase(
			appealId,
			appellantCaseId,
			appellantCaseReviewOutcome
		);

		// TODO: BOAT-235 - render appropriate confirmation page based on review outcome/decision
		return renderDecisionInvalidConfirmationPage(response, appealReference, appealId);
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

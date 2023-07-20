import logger from '../../../lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import {
	mapResponseToSummaryListBuilderParameters,
	mapWebReviewOutcomeToApiReviewOutcome,
	mapReviewOutcomeToSummaryListBuilderParameters,
	mapReviewOutcomeToNotificationBannerComponentParameters
} from './appellant-case.mapper.js';
import { generateSummaryList } from '../../../lib/nunjucks-template-builders/summary-list-builder.js';
import { objectContainsAllKeys } from '../../../lib/object-utilities.js';
import { renderDecisionValidConfirmationPage } from './outcome-valid/outcome-valid.controller.js';
import { renderDecisionInvalidConfirmationPage } from './outcome-invalid/outcome-invalid.controller.js';
import { renderDecisionIncompleteConfirmationPage } from './outcome-incomplete/outcome-incomplete.controller.js';
import { appellantCaseReviewOutcomes } from '../../appeal.constants.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
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

		let notificationBannerParameters;
		const existingValidationOutcome = appellantCaseResponse.validation?.outcome?.toLowerCase();

		if (
			existingValidationOutcome === appellantCaseReviewOutcomes.invalid ||
			existingValidationOutcome === appellantCaseReviewOutcomes.incomplete
		) {
			notificationBannerParameters = mapReviewOutcomeToNotificationBannerComponentParameters(
				existingValidationOutcome,
				existingValidationOutcome === appellantCaseReviewOutcomes.invalid
					? appellantCaseResponse.validation?.invalidReasons
					: appellantCaseResponse.validation?.incompleteReasons,
				appellantCaseResponse.validation?.otherNotValidReasons
			);
		}

		return response.render('appeals/appeal/appellant-case.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
				siteAddress: formattedSiteAddress ?? 'No site address for this appeal',
				localPlanningAuthority: appealDetails?.localPlanningDepartment
			},
			notificationBannerParameters,
			summaryList: { formattedSections },
			errors
		});
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderCheckAndConfirm = async (request, response) => {
	try {
		if (
			!objectContainsAllKeys(request.session, [
				'appealId',
				'appealReference',
				'appellantCaseId',
				'webAppellantCaseReviewOutcome'
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
			webAppellantCaseReviewOutcome
		} = request.session;

		const reasonOptions = await appellantCaseService.getAppellantCaseNotValidReasonsForOutcome(
			webAppellantCaseReviewOutcome.validationOutcome
		);
		if (!reasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const appealReferenceFragments = appealReference.split('/');
		const mappedCheckAndConfirmSection = mapReviewOutcomeToSummaryListBuilderParameters(
			reasonOptions,
			webAppellantCaseReviewOutcome.validationOutcome,
			webAppellantCaseReviewOutcome.invalidOrIncompleteReasons,
			webAppellantCaseReviewOutcome.otherNotValidReasons,
			webAppellantCaseReviewOutcome.updatedDueDate
		);
		const formattedSections = [generateSummaryList(mappedCheckAndConfirmSection.rows)];

		return response.render('app/check-and-confirm.njk', {
			appeal: {
				id: appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1]
			},
			page: {
				title: 'Check answers'
			},
			title: {
				text: 'Check your answers before confirming your review'
			},
			insetText: 'Confirming this review will inform the appellant of the outcome',
			summaryList: { formattedSections },
			backLinkUrl: `/appeals-service/appeal-details/${appealId}/appellant-case/${webAppellantCaseReviewOutcome.validationOutcome}`
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

			if (reviewOutcome === appellantCaseReviewOutcomes.valid) {
				await appellantCaseService.setReviewOutcomeForAppellantCase(
					appealId,
					appellantCaseId,
					mapWebReviewOutcomeToApiReviewOutcome(appellantCaseReviewOutcomes.valid)
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
			webAppellantCaseReviewOutcome
		} = request.session;

		await appellantCaseService.setReviewOutcomeForAppellantCase(
			appealId,
			appellantCaseId,
			mapWebReviewOutcomeToApiReviewOutcome(
				webAppellantCaseReviewOutcome.validationOutcome,
				webAppellantCaseReviewOutcome.invalidOrIncompleteReasons,
				webAppellantCaseReviewOutcome.otherNotValidReasons,
				webAppellantCaseReviewOutcome.updatedDueDate
			)
		);

		const validationOutcome = webAppellantCaseReviewOutcome.validationOutcome;

		// @ts-ignore
		delete request.session.webAppellantCaseReviewOutcome;

		if (validationOutcome === appellantCaseReviewOutcomes.invalid) {
			return renderDecisionInvalidConfirmationPage(response, appealReference, appealId);
		} else if (validationOutcome === appellantCaseReviewOutcomes.incomplete) {
			return renderDecisionIncompleteConfirmationPage(response, appealReference, appealId);
		} else {
			return response.render('app/500.njk');
		}
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

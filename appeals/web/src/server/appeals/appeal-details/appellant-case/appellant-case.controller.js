import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import {
	mapResponseToSummaryListBuilderParameters,
	mapWebReviewOutcomeToApiReviewOutcome,
	mapReviewOutcomeToSummaryListBuilderParameters,
	mapReviewOutcomeToNotificationBannerComponentParameters
} from './appellant-case.mapper.js';
import { generateSummaryList } from '#lib/nunjucks-template-builders/summary-list-builder.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';
import { appealShortReference } from '#lib/appeals-formatter.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAppellantCase = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const formattedSiteAddress = appealDetails?.appealSite
			? Object.values(appealDetails?.appealSite)?.join(', ')
			: 'Address not known';

		const appellantCaseResponse = await appellantCaseService
			.getAppellantCaseFromAppealId(
				request.apiClient,
				appealDetails?.appealId,
				appealDetails?.appellantCaseId
			)
			.catch((error) => logger.error(error));

		const mappedAppellantCaseSections = mapResponseToSummaryListBuilderParameters(
			appellantCaseResponse,
			response.locals.permissions
		);
		const formattedSections = [];
		for (const section of mappedAppellantCaseSections) {
			formattedSections.push(generateSummaryList(section));
		}

		let notificationBannerParameters;
		const existingValidationOutcome = appellantCaseResponse.validation?.outcome?.toLowerCase();

		if (existingValidationOutcome === 'invalid' || existingValidationOutcome === 'incomplete') {
			notificationBannerParameters = mapReviewOutcomeToNotificationBannerComponentParameters(
				existingValidationOutcome,
				existingValidationOutcome === 'invalid'
					? appellantCaseResponse.validation?.invalidReasons
					: appellantCaseResponse.validation?.incompleteReasons
			);
		}

		return response.render('appeals/appeal/appellant-case.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealShortReference(appealDetails?.appealReference),
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

		const { appealId, appealReference, webAppellantCaseReviewOutcome } = request.session;

		const reasonOptions =
			await appellantCaseService.getAppellantCaseNotValidReasonOptionsForOutcome(
				request.apiClient,
				webAppellantCaseReviewOutcome.validationOutcome
			);
		if (!reasonOptions) {
			throw new Error('error retrieving invalid reason options');
		}

		const mappedCheckAndConfirmSection = mapReviewOutcomeToSummaryListBuilderParameters(
			appealId,
			reasonOptions,
			webAppellantCaseReviewOutcome.validationOutcome,
			webAppellantCaseReviewOutcome.reasons,
			webAppellantCaseReviewOutcome.reasonsText,
			webAppellantCaseReviewOutcome.updatedDueDate
		);
		const formattedSections = [generateSummaryList(mappedCheckAndConfirmSection)];

		return response.render('app/check-and-confirm.njk', {
			appeal: {
				id: appealId,
				shortReference: appealShortReference(appealReference)
			},
			page: {
				title: 'Check answers'
			},
			title: {
				text: 'Check your answers before confirming your review'
			},
			insetText: 'Confirming this review will inform the appellant and LPA of the outcome',
			summaryList: { formattedSections },
			backLinkUrl:
				webAppellantCaseReviewOutcome.validationOutcome === 'incomplete'
					? `/appeals-service/appeal-details/${appealId}/appellant-case/${webAppellantCaseReviewOutcome.validationOutcome}/date`
					: `/appeals-service/appeal-details/${appealId}/appellant-case/${webAppellantCaseReviewOutcome.validationOutcome}`
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
			.getAppealDetailsFromId(request.apiClient, request.params.appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const { appealId, appellantCaseId, appealReference } = appealDetails;

			request.session.appealId = appealId;
			request.session.appellantCaseId = appellantCaseId;
			request.session.appealReference = appealReference;

			if (reviewOutcome === 'valid') {
				await appellantCaseService.setReviewOutcomeForAppellantCase(
					request.apiClient,
					appealId,
					appellantCaseId,
					mapWebReviewOutcomeToApiReviewOutcome('valid')
				);

				return response.redirect(
					`/appeals-service/appeal-details/${appealId}/appellant-case/${reviewOutcome}/confirmation`
				);
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
		const { appealId, appellantCaseId, webAppellantCaseReviewOutcome } = request.session;

		await appellantCaseService.setReviewOutcomeForAppellantCase(
			request.apiClient,
			appealId,
			appellantCaseId,
			mapWebReviewOutcomeToApiReviewOutcome(
				webAppellantCaseReviewOutcome.validationOutcome,
				webAppellantCaseReviewOutcome.reasons,
				webAppellantCaseReviewOutcome.reasonsText,
				webAppellantCaseReviewOutcome.updatedDueDate
			)
		);

		const validationOutcome = webAppellantCaseReviewOutcome.validationOutcome;

		delete request.session.webAppellantCaseReviewOutcome;

		if (validationOutcome === 'invalid' || validationOutcome === 'incomplete') {
			response.redirect(
				`/appeals-service/appeal-details/${appealId}/appellant-case/${validationOutcome}/confirmation`
			);
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

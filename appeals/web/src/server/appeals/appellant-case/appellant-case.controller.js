import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import { mapAppellantCase } from './appellant-case.mapper.js';
import { generateSummaryList } from '../../lib/nunjucks-template-builders/summary-list-builder.js';

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

		const mappedAppellantCaseSections = mapAppellantCase(appellantCaseResponse);
		const formattedSections = [];
		for (const section of mappedAppellantCaseSections) {
			formattedSections.push(generateSummaryList(section.header, section.rows));
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

	return response.render(`app/404.njk`);
};

/**
 *
 * @param {import('../../../../../../packages/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} appealReference
 * @param {number} appealId
 */
const renderDecisionValidConfirmationPage = async (response, appealReference, appealId) => {
	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal valid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preTitle: 'The appeal has been marked as valid.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent the start letter email to the Appellant and LPA."
				},
				{
					text: 'The case has been published on the Appeals Casework Portal.'
				},
				{
					text: 'Read the email',
					href: '#'
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
			switch (reviewOutcome) {
				case 'valid':
					await appellantCaseService.setReviewOutcomeForAppellantCase(
						appealDetails?.appealId,
						appealDetails?.appellantCaseId,
						reviewOutcome
					);

					return renderDecisionValidConfirmationPage(
						response,
						appealDetails?.appealReference,
						appealDetails?.appealId
					);
				case 'invalid':
					// TODO: BOAT-234 - add handling for invalid decision
					return response.render(`app/500.njk`);
				case 'incomplete':
					// TODO: BOAT-235 - add handling for incomplete decision
					return response.render(`app/500.njk`);
				default:
					break;
			}
		}

		return response.render(`app/404.njk`);
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when completing appellant case review'
		);

		return response.render(`app/500.njk`);
	}
};

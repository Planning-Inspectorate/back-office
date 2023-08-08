import logger from '../../lib/logger.js';
import * as appealDetailsService from './appeal-details.service.js';
import {
	mapAppealDetailsToAppealDetailsSummaryParameters,
	mapAppealDetailsToSummaryListBuilderParameters,
	mapAppealDetailsToTableBuilderParameters
} from './appeal-details.mapper.js';
import { generateSummaryList } from '../../lib/nunjucks-template-builders/summary-list-builder.js';
import { generateTable } from '../../lib/nunjucks-template-builders/table-builder.js';

/**
 * @typedef {Object} ViewAppealDetailsRenderOptions
 * @property {Object} appeal
 * @property {import('./appeal-details.mapper.js').AppealDetailsSummaryParameters} appealDetailsSummaryParameters
 * @property {Object<string, import('../../lib/nunjucks-template-builders/summary-list-builder.js').SummaryListComponentParameters>} summaryLists
 * @property {Object<string, import('../../lib/nunjucks-template-builders/table-builder.js').TableComponentParameters>} tables
 */

/** @type {import('@pins/express').RenderHandler<ViewAppealDetailsRenderOptions>}  */
export const viewAppealDetails = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const mappedAppealDetailsSummary =
			mapAppealDetailsToAppealDetailsSummaryParameters(appealDetails);
		const mappedAppealDetailsSummaryListBuilderParameters =
			mapAppealDetailsToSummaryListBuilderParameters(appealDetails);
		const mappedAppealDetailsTableBuilderParameters =
			mapAppealDetailsToTableBuilderParameters(appealDetails);
		const appealReferenceFragments = appealDetails?.appealReference.split('/');

		response.render('appeals/appeal/appeal-details.njk', {
			appeal: {
				id: appealDetails?.appealId,
				shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
				status: appealDetails?.appealStatus
			},
			appealDetailsSummaryParameters: mappedAppealDetailsSummary,
			summaryLists: {
				caseOverview: generateSummaryList(
					mappedAppealDetailsSummaryListBuilderParameters.caseOverview
				),
				siteDetails: generateSummaryList(
					mappedAppealDetailsSummaryListBuilderParameters.siteDetails
				),
				caseTeam: generateSummaryList(mappedAppealDetailsSummaryListBuilderParameters.caseTeam),
				...(mappedAppealDetailsSummaryListBuilderParameters.caseTimetable && {
					caseTimetable: generateSummaryList(
						mappedAppealDetailsSummaryListBuilderParameters.caseTimetable
					)
				})
			},
			tables: {
				caseDocumentation: generateTable(
					mappedAppealDetailsTableBuilderParameters.caseDocumentation
				)
			}
		});
	} else {
		response.render('app/404.njk');
	}
};

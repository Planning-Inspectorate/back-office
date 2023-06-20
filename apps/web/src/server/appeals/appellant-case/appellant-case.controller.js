import logger from '../../lib/logger.js';
import * as appealDetailsService from '../appeal-details/appeal-details.service.js';
import * as appellantCaseService from './appellant-case.service.js';
import { mapAppellantCase } from './appellant-case.mapper.js';
import { generateSummaryList } from '../../lib/nunjucks-template-builders/summary-list-builder.js';

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getAppellantCase = async (request, response) => {
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
			summaryList: { formattedSections }
		});
	}

	return response.render(`app/404.njk`);
};

import logger from '../../lib/logger.js';
import * as appealDetailsService from './appeal-details.service.js';

/**
 * @typedef {object} ViewAppealDetailsRenderOptions
 * @property {object} appeal
 */

/** @type {import('@pins/express').RenderHandler<ViewAppealDetailsRenderOptions>}  */
export const viewAppealDetails = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const appealReferenceFragments = appealDetails?.appealReference.split('/');

		const formattedSiteAddress = appealDetails?.appealSite
			? Object.values(appealDetails?.appealSite)?.join(', ')
			: 'Address not known';

		const formattedAppeal = {
			reference: appealDetails?.appealReference,
			shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
			status: appealDetails?.appealStatus,
			siteAddress: formattedSiteAddress,
			localPlanningAuthority: appealDetails?.localPlanningDepartment,
			type: appealDetails?.appealType,
			caseProcedure: appealDetails?.caseProcedure,
			linkedAppeal: appealDetails?.linkedAppeal?.appealReference,
			otherAppeals: appealDetails?.otherAppeals,
			allocationDetails: appealDetails?.allocationDetails,
			lpaReference: appealDetails?.planningApplicationReference,
			developmentType: appealDetails?.developmentType,
			eventType: appealDetails?.eventType,
			decision: appealDetails?.decision ?? 'Not issued yet',
			// TODO: BOAT-80: add documentation status data
			documentationStatus: {
				appellantCase: 'Complete',
				lpaQuestionnaire: 'Overdue',
				statementAndProofs: 'Incomplete',
				interestedParties: 'Complete',
				finalComments: 'Overdue',
				costs: 'Not started',
				planningObligation: 'None',
				statementOfCommonGround: 'None'
			},
			appellant: {
				name: appealDetails?.appellantName
			},
			agent: {
				name: appealDetails?.agentName
			},
			// TODO: BOAT-81: add case officer and inspector data
			caseOfficer: {
				name: 'Robert Williams',
				email: 'robert.williams@planninginspectorate.gov.uk',
				phone: '0300 027 1289'
			},
			inspector: null
		};

		response.render('appeals/all-appeals/appeal-details.njk', { appeal: { ...formattedAppeal } });
	} else {
		response.render('app/404.njk');
	}
};

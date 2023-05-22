import { dateFormatter } from '../../lib/date-formatter.js';
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

		const startedAt = appealDetails?.startedAt && dateFormatter(appealDetails.startedAt);

		const formattedAppeal = {
			id: appealDetails?.appealId,
			reference: appealDetails?.appealReference,
			shortReference: appealReferenceFragments?.[appealReferenceFragments.length - 1],
			status: appealDetails?.appealStatus,
			siteAddress: formattedSiteAddress ?? 'No site address for this appeal',
			localPlanningAuthority: appealDetails?.localPlanningDepartment,
			type: appealDetails?.appealType,
			caseProcedure: appealDetails?.caseProcedure,
			linkedAppeal: {
				appealId: appealDetails?.linkedAppeal?.appealId,
				appealReference: appealDetails?.linkedAppeal?.appealReference
			} ?? { appealId: 'None', appealReference: 'No linked appeal' },
			otherAppeals: appealDetails?.otherAppeals ?? [
				{ appealId: 'None', appealReference: 'No linked appeal' }
			],
			allocationDetails:
				appealDetails?.allocationDetails ?? 'No allocation details for this appeal',
			lpaReference:
				appealDetails?.planningApplicationReference ?? 'No LPA reference for this appeal',
			developmentType: appealDetails?.developmentType ?? ' No development type for this appeal',
			eventType: appealDetails?.eventType ?? ' No event type for this appeal',
			decision: appealDetails?.decision ?? 'Not issued yet',
			startedAt,
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
				name: appealDetails?.appellantName ?? 'No appellant for this appeal'
			},
			agent: {
				name: appealDetails?.agentName ?? 'No agent for this appeal'
			},
			// TODO: BOAT-81: add case officer and inspector data
			caseOfficer: {
				name: 'Robert Williams',
				email: 'robert.williams@planninginspectorate.gov.uk',
				phone: '0300 027 1289'
			},
			inspector: null
		};

		response.render('appeals/appeal/appeal-details.njk', { appeal: { ...formattedAppeal } });
	} else {
		response.render('app/404.njk');
	}
};

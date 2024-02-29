import * as appealDetailsService from '../appeal-details.service.js';
import { getAppealAudit, mapUser, mapMessageContent } from './audit.service.js';
import { dateToDisplayDate, dateToDisplayTime } from '#lib/dates.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderAudit = async (request, response) => {
	const { appealId } = request.params;
	if (appealId) {
		const data = await Promise.all([
			appealDetailsService.getAppealDetailsFromId(request.apiClient, appealId),
			getAppealAudit(request.apiClient, appealId)
		]);

		if (data && data.length === 2) {
			const appeal = data[0];
			const auditInfo = data[1];

			const auditTrails = await Promise.all(
				auditInfo.map(async (audit) => {
					const details = await mapMessageContent(
						appeal,
						audit.details,
						audit.doc,
						request.session
					);
					const loggedDate = new Date(audit.loggedDate);
					return {
						date: dateToDisplayDate(loggedDate),
						time: dateToDisplayTime(loggedDate),
						details,
						user: await mapUser(audit.azureAdUserId, request.session)
					};
				})
			);

			const shortAppealReference = appealShortReference(appeal.appealReference);

			return response.render('appeals/appeal/audit.njk', {
				pageContent: {
					auditTrails,
					caseReference: shortAppealReference,
					backLinkUrl: `/appeals-service/appeal-details/${appeal.appealId}`,
					title: `Case history - ${shortAppealReference}`,
					preHeading: `Appeal ${shortAppealReference}`,
					heading: 'Case history'
				}
			});
		}
	}

	return response.render('app/404.njk');
};

import { surnameFirstToFullName } from '#lib/person-name-formatter.js';
import usersService from '../../appeal-users/users-service.js';
import config from '#environment/config.js';

/**
 * @typedef {import("#lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 */

/** @typedef {import('../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 *
 * @param {string|undefined} assignedUserId
 * @param {number} appealId
 * @param {boolean} isInspector
 * @param {SessionWithAuth} session
 * @returns {Promise<SummaryListBuilderParameters|undefined>}
 */
export async function mapAssignedUserToSummaryListBuilderParameters(
	assignedUserId,
	appealId,
	isInspector,
	session
) {
	if (!assignedUserId) {
		return;
	}

	const user = await usersService.getUserByRoleAndId(
		isInspector
			? config.referenceData.appeals.inspectorGroupId
			: config.referenceData.appeals.caseOfficerGroupId,
		session,
		assignedUserId
	);

	if (!user) {
		return;
	}

	return {
		rows: [
			{
				title: surnameFirstToFullName(user.name),
				value: user.email,
				valueType: 'text',
				actionText: 'Remove',
				actionLink: `/appeals-service/appeal-details/${appealId}/unassign-user/${
					isInspector ? 'inspector' : 'case-officer'
				}/${assignedUserId}/confirm`
			}
		]
	};
}

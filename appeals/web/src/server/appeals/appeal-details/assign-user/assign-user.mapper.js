import { surnameFirstToFullName } from '#lib/person-name-formatter.js';
import { getUserByRoleAndId } from '../../appeal-users/users-service.js';

/**
 * @typedef {import("#lib/nunjucks-template-builders/summary-list-builder.js").BuilderParameters} SummaryListBuilderParameters
 */

/** @typedef {import('../../../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 *
 * @param {string|undefined} assignedUserId
 * @param {number} appealId
 * @param {string} roleName The group name or ID in Active Directory
 * @param {SessionWithAuth} session
 * @returns {Promise<SummaryListBuilderParameters|undefined>}
 */
export async function mapAssignedUserToSummaryListBuilderParameters(
	assignedUserId,
	appealId,
	roleName,
	session
) {
	if (!assignedUserId) {
		return;
	}

	const user = await getUserByRoleAndId(roleName, assignedUserId, session);

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
				actionLink: `/appeals-service/appeal-details/${appealId}/unassign-user/case-officer/${assignedUserId}`
			}
		]
	};
}

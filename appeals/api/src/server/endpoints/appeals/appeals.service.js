import userRepository from '#repositories/user.repository.js';
import appealRepository from '#repositories/appeal.repository.js';
import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import {
	AUDIT_TRAIL_ASSIGNED_CASE_OFFICER,
	AUDIT_TRAIL_ASSIGNED_INSPECTOR,
	USER_TYPE_CASE_OFFICER,
	USER_TYPE_INSPECTOR
} from '#endpoints/constants.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';

/** @typedef {import('@pins/appeals.api').Appeals.AssignedUser} AssignedUser */
/** @typedef {import('@pins/appeals.api').Appeals.UsersToAssign} UsersToAssign */

/**
 * @param {string | number | null} [value]
 * @returns {boolean}
 */
const hasValueOrIsNull = (value) => Boolean(value) || value === null;

/**
 * @param {Pick<UsersToAssign, 'caseOfficer' | 'inspector'>} param0
 * @returns {AssignedUser | null}
 */
const assignedUserType = ({ caseOfficer, inspector }) => {
	if (hasValueOrIsNull(caseOfficer)) {
		return USER_TYPE_CASE_OFFICER;
	} else if (hasValueOrIsNull(inspector)) {
		return USER_TYPE_INSPECTOR;
	}
	return null;
};

/**
 * @param {number} id
 * @param {UsersToAssign} param0
 * @returns {Promise<object | null>}
 */
const assignUser = async (id, { azureAdUserId, caseOfficer, inspector }) => {
	const assignedUserId = caseOfficer || inspector;
	const typeOfAssignedUser = assignedUserType({ caseOfficer, inspector });

	if (typeOfAssignedUser) {
		let details = '';
		let userId = null;

		if (assignedUserId) {
			({ id: userId } = await userRepository.findOrCreateUser(assignedUserId));
		}

		await appealRepository.updateAppealById(id, { [typeOfAssignedUser]: userId });

		if (assignedUserId) {
			if (caseOfficer) {
				details = stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_CASE_OFFICER, [caseOfficer]);
			} else if (inspector) {
				details = stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_INSPECTOR, [inspector]);
			}

			await createAuditTrail({ appealId: id, details, azureAdUserId });
		}
	}

	return null;
};

export { assignUser, hasValueOrIsNull, assignedUserType };

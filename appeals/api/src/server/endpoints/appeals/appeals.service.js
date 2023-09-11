import userRepository from '#repositories/user.repository.js';
import appealRepository from '#repositories/appeal.repository.js';

/** @typedef {import('@pins/appeals.api').Appeals.AssignedUser} AssignedUser */
/** @typedef {import('@pins/appeals.api').Appeals.UsersToAssign} UsersToAssign */

/**
 * @param {string | null} [value]
 * @returns {boolean}
 */
const isStringOrNull = (value) => Boolean(value) || value === null;

/**
 * @param {UsersToAssign} param0
 * @returns {AssignedUser | null}
 */
const assignedUserType = ({ caseOfficer, inspector }) => {
	if (isStringOrNull(caseOfficer)) {
		return 'caseOfficer';
	} else if (isStringOrNull(inspector)) {
		return 'inspector';
	}
	return null;
};

/**
 * @param {number} id
 * @param {UsersToAssign} param0
 * @returns {Promise<object | null>}
 */
const assignUser = async (id, { caseOfficer, inspector }) => {
	const azureUserId = caseOfficer || inspector;
	const typeOfAssignedUser = assignedUserType({ caseOfficer, inspector });

	if (typeOfAssignedUser) {
		let userId = null;

		if (azureUserId) {
			({ id: userId } = await userRepository.findOrCreateUser(azureUserId));
		}

		return appealRepository.updateAppealById(id, { [typeOfAssignedUser]: userId });
	}

	return null;
};

export { assignUser, isStringOrNull, assignedUserType };

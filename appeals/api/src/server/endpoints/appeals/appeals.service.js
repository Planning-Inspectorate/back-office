import userRepository from '#repositories/user.repository.js';
import appealRepository from '#repositories/appeal.repository.js';

/**
 * @param {number} id
 * @param {{
 *  caseOfficer?: string;
 *  inspector?: string;
 * }} data
 * @returns {Promise<object | null>}
 */
const assignUser = async (id, { caseOfficer, inspector }) => {
	const azureUserId = caseOfficer || inspector;

	if (azureUserId) {
		const user = await userRepository.findOrCreateUser(azureUserId);
		return appealRepository.updateAppealById(id, { caseOfficer, inspector, user });
	}

	return null;
};

export { assignUser };

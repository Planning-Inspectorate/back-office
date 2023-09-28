import auditTrailRepository from '#repositories/audit-trail.repository.js';
import userRepository from '#repositories/user.repository.js';

/**
 * @param {*} param0
 */
const createAuditTrail = async ({ appealId, details, azureAdUserId }) => {
	if (azureAdUserId) {
		const { id: userId } = await userRepository.findOrCreateUser(azureAdUserId);

		if (userId) {
			await auditTrailRepository.createAuditTrail({
				appealId,
				details,
				loggedAt: new Date(),
				userId
			});
		}
	}
};

export { createAuditTrail };

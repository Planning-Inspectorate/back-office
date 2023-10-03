import auditTrailRepository from '#repositories/audit-trail.repository.js';
import userRepository from '#repositories/user.repository.js';

/** @typedef {import('@pins/appeals.api').Appeals.CreateAuditTrail} CreateAuditTrail */

/**
 * @param {CreateAuditTrail} param0
 */
const createAuditTrail = async ({ appealId, azureAdUserId, details }) => {
	if (azureAdUserId && details) {
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

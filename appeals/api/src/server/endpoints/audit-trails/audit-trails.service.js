import auditTrailRepository from '#repositories/audit-trail.repository.js';
import userRepository from '#repositories/user.repository.js';
import logger from '#utils/logger.js';

/** @typedef {import('@pins/appeals.api').Appeals.CreateAuditTrail} CreateAuditTrail */
/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */

/**
 * @param {CreateAuditTrail} param0
 * @returns {Promise<AuditTrail | undefined>}
 */
const createAuditTrail = async ({ appealId, azureAdUserId, details }) => {
	try {
		if (azureAdUserId && details) {
			const { id: userId } = await userRepository.findOrCreateUser(azureAdUserId);

			if (userId) {
				const auditTrail = await auditTrailRepository.createAuditTrail({
					appealId,
					details,
					loggedAt: new Date(),
					userId
				});

				return auditTrail;
			}
		}
	} catch (error) {
		logger.error(error);
		throw new Error('Failed to create audit trail');
	}
};

export { createAuditTrail };

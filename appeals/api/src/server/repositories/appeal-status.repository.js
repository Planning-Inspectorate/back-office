import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {number} appealId
 * @param {string} status
 * @returns {Promise<object>}
 */
const updateAppealStatusByAppealId = (appealId, status) =>
	databaseConnector.$transaction([
		databaseConnector.appealStatus.updateMany({
			where: { appealId },
			data: { valid: false }
		}),
		databaseConnector.appealStatus.create({
			data: {
				appealId,
				createdAt: new Date(),
				status,
				valid: true
			}
		})
	]);

export default { updateAppealStatusByAppealId };

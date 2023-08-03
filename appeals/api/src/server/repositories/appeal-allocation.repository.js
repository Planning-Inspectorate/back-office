import { databaseConnector } from '#utils/database-connector.js';

/**
 * @param {number} appealId
 * @param {{level: string; band: number; }} allocation
 * @param {number[]} specialisms
 * @returns {Promise<object>}
 */
const updateAppealAllocationByAppealId = (appealId, allocation, specialisms) =>
	databaseConnector.$transaction([
		databaseConnector.appealAllocation.upsert({
			where: { appealId },
			create: { appealId, ...allocation },
			update: allocation
		}),
		databaseConnector.appealSpecialism.deleteMany({
			where: { appealId }
		}),
		databaseConnector.appealSpecialism.createMany({
			data: specialisms.map((specialismId) => ({
				appealId,
				specialismId
			}))
		})
	]);

export default { updateAppealAllocationByAppealId };

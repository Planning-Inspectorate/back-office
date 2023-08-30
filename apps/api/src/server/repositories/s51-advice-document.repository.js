import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.CreateS51AdviceDocument[]} s51AdviceDocument
 * @returns {Promise<import('@pins/applications.api').Schema.BatchPayload>}
 */
export const create = (s51AdviceDocument) => {
	return databaseConnector.s51AdviceDocument.createMany({ data: s51AdviceDocument });
};

/**
 *
 * @param {number} adviceId
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.S51AdviceDocument[]>}
 * */
export const getForAdvice = (adviceId) =>
	databaseConnector.s51AdviceDocument.findMany({
		where: { adviceId },
		include: {
			Document: {
				include: {
					latestDocumentVersion: true
				}
			}
		}
	});

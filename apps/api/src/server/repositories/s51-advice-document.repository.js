import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.CreateS51AdviceDocument[]} s51AdviceDocument
 * @returns {Promise<import('@pins/applications.api').Schema.BatchPayload>}
 */
export const create = (s51AdviceDocument) => {
	return databaseConnector.s51AdviceDocument.createMany({ data: s51AdviceDocument });
};

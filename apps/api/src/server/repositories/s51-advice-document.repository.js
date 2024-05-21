import { databaseConnector } from '../utils/database-connector.js';

/**
 * @typedef {import('@prisma/client').Prisma.S51AdviceDocumentGetPayload<{include: {Document: {include: {latestDocumentVersion: true }} }}>} S51AdviceDocumentWithLatestVersion
 */

/**
 *
 * @param {import('@pins/applications.api').Schema.CreateS51AdviceDocument[]} s51AdviceDocument
 * @returns {Promise<import('@pins/applications.api').Schema.BatchPayload>}
 */
export const create = (s51AdviceDocument) => {
	return databaseConnector.s51AdviceDocument.createMany({ data: s51AdviceDocument });
};

/**
 * get the advice documents attached to an S51 Advice
 *
 * @param {number} adviceId
 * @returns {import('@prisma/client').PrismaPromise<S51AdviceDocumentWithLatestVersion [] >}
 * */
export const getForAdvice = (adviceId) =>
	databaseConnector.s51AdviceDocument.findMany({
		where: {
			adviceId,
			Document: {
				isDeleted: false
			}
		},
		include: {
			Document: {
				include: {
					latestDocumentVersion: true
				}
			}
		}
	});

/**
 *
 * @param {number} adviceId
 * @param {string} documentName
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.S51AdviceDocument | null>}
 * */
export const getDocumentInAdviceByName = (adviceId, documentName) =>
	databaseConnector.s51AdviceDocument.findFirst({
		where: {
			adviceId,
			Document: {
				latestDocumentVersion: {
					originalFilename: documentName
				}
			}
		}
	});

/**
 *
 * @param {number[]} s51AdviceIds
 */
export const getPublishedDocumentsByAdviceIds = (s51AdviceIds) => {
	return databaseConnector.s51AdviceDocument.findMany({
		where: {
			adviceId: {
				in: s51AdviceIds
			},
			Document: {
				latestDocumentVersion: {
					publishedStatus: {
						equals: 'published'
					}
				}
			}
		}
	});
};

/**
 *
 * @param {number} adviceId
 * @param {string} documentGuid
 * @returns {Promise<*>}
 */
export const upsertS51AdviceDocument = async (adviceId, documentGuid) => {
	return databaseConnector.s51AdviceDocument.upsert({
		where: { documentGuid },
		update: { adviceId },
		create: {
			documentGuid,
			adviceId
		}
	});
};

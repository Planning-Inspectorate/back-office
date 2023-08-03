import { databaseConnector } from '../utils/database-connector.js';

/**
 *
 * @param {import('@pins/applications.api').Schema.S51Advice} s51advice
 * @returns {Promise<import('@pins/applications.api').Schema.S51Advice>}
 */
export const create = (s51advice) => {
	return databaseConnector.s51Advice.create({ data: s51advice });
};

/**
 *
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.S51Advice | null>}
 */
export const get = (id) => {
	return databaseConnector.s51Advice.findUnique({
		where: { id }
	});
}

/**
 * Returns total number of S51 Advice on a case
 *
 * @param {number} caseId
 * @param {boolean} getAllS51Advice
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getS51AdviceCountOnCase = (caseId, getAllS51Advice = false) => {
	/** @type {{caseId: number, isDeleted?:boolean}} */
	const where = { caseId };

	if (getAllS51Advice) {
		where.isDeleted = true;
	}

	return databaseConnector.s51Advice.count({
		where
	});
};

/**
 * returns and array of all the S51 Advice on a case
 *
 * @param {{caseId: number, skipValue: number, pageSize: number }} caseId
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.S51Advice[]>}
 */
export const getManyS51AdviceOnCase = ({ caseId, skipValue, pageSize }) => {
	return databaseConnector.s51Advice.findMany({
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc' // TODO: make this the ref id
			}
		],
		where: {
			caseId
		}
	});
};

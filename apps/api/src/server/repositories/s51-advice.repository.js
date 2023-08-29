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
};

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
		// where.isDeleted = true; // TODO: no isDeleted field yet
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
				referenceNumber: 'desc'
			}
		],
		where: {
			caseId
		}
	});
};

/**
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/applications.api').Schema.S51Advice | null>}
 */
export const getLatestRecordByCaseId = (caseId) => {
	return databaseConnector.s51Advice.findFirst({
		where: { caseId },
		orderBy: {
			id: 'desc'
		}
	});
};

/**
 * Updates an S51 Advice record
 *
 * @param {number} id
 * @param {*} s51AdviceDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.S51Advice>}
 */

export const update = (id, s51AdviceDetails) => {
	return databaseConnector.s51Advice.update({
		where: { id },
		data: s51AdviceDetails
	});
};

/**
 * From a given list of S51 advice ids, retrieve the ones which are publishable
 *
 * @param {number[]} s51AdviceIds
 * @returns {Promise<{id: number}[]>}
 */
export const getPublishableS51Advice = (s51AdviceIds) => {
	// most of the fields have a not null constraint in DB already, so dont need to check them
	// need to check has title, and either (enquirer || (firsName + lastName) or all
	return databaseConnector.s51Advice.findMany({
		where: {
			id: {
				in: s51AdviceIds
			},
			NOT: {
				OR: [
					{
						title: ''
					},
					{
						AND: [
							{
								enquirer: ''
							},
							{
								OR: [
									{
										firstName: ''
									},
									{
										lastName: ''
									}
								]
							}
						]
					}
				]
			}
		},
		select: {
			id: true
		}
	});
};

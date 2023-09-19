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
 * Returns total number of S51 Advice on a case, including deleted advice if includeDeleted = true
 *
 * @param {number} caseId
 * @param {boolean} includeDeleted
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getS51AdviceCountOnCase = (caseId, includeDeleted = true) => {
	/** @type {{caseId: number, isDeleted?:boolean}} */
	const where = { caseId };

	if (!includeDeleted) {
		where.isDeleted = false;
	}

	return databaseConnector.s51Advice.count({
		where
	});
};

/**
 * returns and array of all undeleted S51 Advice on a case
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
			caseId,
			isDeleted: false
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
 * Update all S51 Advice records in a case
 *
 * @param {number} caseId
 * @param {*} s51AdviceDetails
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.BatchPayload<S51Advice>>}
 * */
export const updateForCase = (caseId, s51AdviceDetails) => {
	return databaseConnector.s51Advice.updateMany({
		where: { caseId },
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
	// need to check has title, and (either (enquirer || (firstName + lastName) or all))
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

/**
 *
 * @param {number[]} s51AdviceIds
 */
export const getPublishedAdvicesByIds = (s51AdviceIds) => {
	return databaseConnector.s51Advice.findMany({
		where: {
			id: {
				in: s51AdviceIds
			},
			publishedStatus: {
				equals: 'published'
			}
		}
	});
};

/**
 * Filter S51 advice table to retrieve documents by 'ready-to-publish' status
 *
 * @param {{skipValue: number, pageSize: number, caseId: number, documentVersion?: number}} params
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/applications.api').Schema.S51Advice[]>}
 */
export const getReadyToPublishAdvices = ({ skipValue, pageSize, caseId }) => {
	return databaseConnector.s51Advice.findMany({
		skip: skipValue,
		take: pageSize,
		orderBy: [
			{
				createdAt: 'desc'
			}
		],
		where: {
			caseId,
			publishedStatus: 'ready_to_publish'
		},
		include: {
			S51AdviceDocument: true
		}
	});
};

/**
 * Returns total number of S51 advice by published status (ready-to-publish)
 *
 * @param {number} caseId
 * @returns {import('@prisma/client').PrismaPromise<number>}
 */
export const getS51AdviceCountInByPublishStatus = (caseId) => {
	return databaseConnector.s51Advice.count({
		where: {
			caseId,
			publishedStatus: 'ready_to_publish'
		}
	});
};

/**
 * Finds all matching S51 advice records by title on a case.
 * Can be used to check if a given S51 Title is unique to this case
 *
 * @param {number} caseId
 * @param {string} title
 * @returns {Promise<import('@pins/applications.api').Schema.S51Advice[] | null>}
 */
export const getS51AdviceManyByTitle = (caseId, title) => {
	const s51advice = databaseConnector.s51Advice.findMany({
		where: {
			caseId,
			title
		}
	});
	return s51advice;
};

/**
 * Soft Delete of an S51 Advice
 *
 * @param {number} id
 * @returns {Promise<import('@pins/applications.api').Schema.S51Advice | null>}
 */
export const deleteSoftlyById = (id) => {
	return databaseConnector.s51Advice.update({
		where: { id },
		data: { isDeleted: true }
	});
};

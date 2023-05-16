import { Prisma } from '@prisma/client';
import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

/**
 * @typedef {object} AppealInclusionOptions
 * @property {boolean=} address
 * @property {boolean=} appealDetailsFromAppellant
 * @property {boolean=} appellant
 * @property {boolean=} inspectorDecision
 * @property {boolean=} lpaQuestionnaire
 * @property {boolean=} latestLPAReviewQuestionnaire
 * @property {boolean=} siteVisit
 * @property {boolean=} validationDecision
 */

const includeLatestReviewQuestionnaireFilter = {
	reviewQuestionnaire: {
		take: 1,
		orderBy: {
			createdAt: 'desc'
		}
	}
};

const appealRepository = (function () {
	return {
		/**
		 * @param {number} pageNumber
		 * @param {number} pageSize
		 * @returns {Prisma.PrismaPromise<[number, import('@pins/api').Schema.Appeal[]]>}
		 */
		getAll(pageNumber, pageSize) {
			const where = {
				appealStatus: {
					some: {
						valid: true
					}
				}
			};

			return databaseConnector.$transaction([
				databaseConnector.appeal.count({
					where
				}),
				databaseConnector.appeal.findMany({
					where,
					include: {
						address: true,
						appealType: true,
						appealStatus: {
							where: {
								valid: true
							}
						}
					},
					skip: getSkipValue(pageNumber, pageSize),
					take: pageSize
				})
			]);
		},
		/**
		 * Query an appeal by its id, including any optional relations.
		 *
		 * @param {number} id
		 * @param {AppealInclusionOptions} [inclusions={}]
		 * @returns {Prisma.PrismaPromise<import('@pins/api').Schema.Appeal | null>}
		 */
		getById(id, { latestLPAReviewQuestionnaire, ...inclusions } = {}) {
			return databaseConnector.appeal.findUnique({
				where: {
					id
				},
				include: {
					...inclusions,
					...(latestLPAReviewQuestionnaire && includeLatestReviewQuestionnaireFilter),
					appealDetailsFromAppellant: true,
					siteVisit: true,
					appellant: true,
					address: true,
					inspectorDecision: true,
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealType: true
				}
			});
		},
		/**
		 * @param {number} id
		 * @param {{
		 *	startedAt?: string;
		 * }} data
		 * @returns {Prisma.PrismaPromise<{
		 * 	id: number,
		 *	reference: string,
		 *	createdAt: Date,
		 *	updatedAt: Date,
		 *	addressId: number | null,
		 *	localPlanningDepartment: string,
		 *	planningApplicationReference: string,
		 *	startedAt: Date | null,
		 *	userId: number | null,
		 *	appellantId: number | null,
		 *	appealTypeId: number | null,
		 * }>}
		 */
		updateById(id, data) {
			const updatedAt = new Date();

			return databaseConnector.appeal.update({
				where: { id },
				data: { updatedAt, ...data }
			});
		}
	};
}());

export default appealRepository;

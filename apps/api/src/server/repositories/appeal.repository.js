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
 * @property {boolean=} siteVisit
 * @property {boolean=} validationDecision
 */

const appealRepository = (function () {
	return {
		/**
		 * @param {number} pageNumber
		 * @param {number} pageSize
		 * @returns {Promise<[number, import('@pins/api').Appeals.RepositoryGetAllResultItem[]]>}
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
		 * @param {number} id
		 * @returns {Prisma.PrismaPromise<import('@pins/api').Appeals.RepositoryGetByIdResultItem | null>}
		 */
		getById(id) {
			return databaseConnector.appeal.findUnique({
				where: {
					id
				},
				include: {
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
					appealType: true,
					appealTimetable: true
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
		},
		/**
		 * @param {number} id
		 * @param {import('@pins/api').Appeals.TimetableDeadlineDate} data
		 * @returns {Prisma.PrismaPromise<import('@pins/api').Schema.AppealTimetable>}
		 */
		upsertAppealTimetableById(id, data) {
			return databaseConnector.appealTimetable.upsert({
				where: { appealId: id },
				update: data,
				create: {
					appealId: id,
					finalEventsDueDate: data.finalEventsDueDate,
					interestedPartyRepsDueDate: data.interestedPartyRepsDueDate,
					questionnaireDueDate: data.questionnaireDueDate,
					statementDueDate: data.statementDueDate
				},
				include: {
					appeal: true
				}
			});
		}
	};
}());

export default appealRepository;

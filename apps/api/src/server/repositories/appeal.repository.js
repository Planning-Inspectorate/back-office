import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';

/** @typedef {import('@pins/applications.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/applications.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/applications.api').Appeals.LinkedAppeal} LinkedAppeal */
/** @typedef {import('@pins/applications.api').Appeals.LookupTables} LookupTables */
/** @typedef {import('@pins/applications.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate */
/** @typedef {import('@pins/applications.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/applications.api').Schema.AppealTimetable} AppealTimetable */
/** @typedef {import('@pins/applications.api').Schema.AppellantCase} AppellantCase */
/** @typedef {import('@pins/applications.api').Schema.ValidationOutcome} ValidationOutcome */
/** @typedef {import('@pins/applications.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason */
/** @typedef {import('@pins/applications.api').Schema.AppellantCaseInvalidReason} AppellantCaseInvalidReason */
/** @typedef {import('@pins/applications.api').Schema.AppellantCaseIncompleteReasonOnAppellantCase} AppellantCaseIncompleteReasonOnAppellantCase */
/** @typedef {import('@pins/applications.api').Schema.AppellantCaseInvalidReasonOnAppellantCase} AppellantCaseInvalidReasonOnAppellantCase */
/**
 * @typedef {import('@prisma/client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @typedef {object} AppealInclusionOptions
 * @property {boolean=} address
 * @property {boolean=} appellantCase
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
		 * @returns {Promise<[number, RepositoryGetAllResultItem[]]>}
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
						appealStatus: {
							where: {
								valid: true
							}
						},
						appealType: true
					},
					skip: getSkipValue(pageNumber, pageSize),
					take: pageSize
				})
			]);
		},
		/**
		 * @param {number} id
		 * @returns {Promise<RepositoryGetByIdResultItem | void>}
		 */
		async getById(id) {
			let appeal = await databaseConnector.appeal.findUnique({
				where: {
					id
				},
				include: {
					address: true,
					appellantCase: {
						include: {
							knowledgeOfOtherLandowners: true,
							planningObligationStatus: true
						}
					},
					appellant: true,
					appealStatus: {
						where: {
							valid: true
						}
					},
					appealTimetable: true,
					appealType: true,
					inspectorDecision: true,
					lpaQuestionnaire: {
						include: {
							designatedSites: {
								include: {
									designatedSite: true
								}
							},
							listedBuildingDetails: true,
							lpaNotificationMethods: {
								include: {
									lpaNotificationMethod: true
								}
							},
							procedureType: true,
							scheduleType: true
						}
					},
					siteVisit: true
				}
			});

			if (appeal) {
				const linkedAppeals = appeal.linkedAppealId
					? await databaseConnector.appeal.findMany({
							where: {
								linkedAppealId: {
									equals: appeal.linkedAppealId
								}
							}
					  })
					: [];

				const otherAppeals = appeal.otherAppealId
					? await databaseConnector.appeal.findMany({
							where: {
								otherAppealId: {
									equals: appeal.otherAppealId
								}
							}
					  })
					: [];

				return {
					...appeal,
					linkedAppeals,
					otherAppeals
				};
			}
		},
		/**
		 * @param {number} id
		 * @param {{
		 *	startedAt?: string;
		 * }} data
		 * @returns {PrismaPromise<{
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
		 * @param {TimetableDeadlineDate} data
		 * @returns {PrismaPromise<AppealTimetable>}
		 */
		upsertAppealTimetableById(id, data) {
			return databaseConnector.appealTimetable.upsert({
				where: { appealId: id },
				update: data,
				create: {
					...data,
					appealId: id
				},
				include: {
					appeal: true
				}
			});
		},
		/**
		 * @param {number} id
		 * @param {{otherNotValidReasons?: string, validationOutcomeId?: number}} data
		 * @returns {PrismaPromise<AppellantCase>}
		 */
		updateAppellantCaseById(id, data) {
			return databaseConnector.appellantCase.update({
				where: { id },
				data
			});
		},
		/**
		 * @param {string} databaseTable
		 * @returns {Promise<LookupTables[]>}
		 */
		getLookupList(databaseTable) {
			// @ts-ignore
			return databaseConnector[databaseTable].findMany({
				orderBy: {
					id: 'asc'
				}
			});
		},
		/**
		 * @param {string} validationOutcome
		 * @returns {Promise<ValidationOutcome | null>}
		 */
		getValidationOutcomeByName(validationOutcome) {
			return databaseConnector.validationOutcome.findUnique({
				where: {
					name: validationOutcome
				}
			});
		},
		/**
		 * @param {number} appellantCaseId
		 * @param {string[]} data
		 * @returns {Promise<object>}
		 */
		updateAppellantCaseIncompleteReasonAppellantCaseById(appellantCaseId, data) {
			return databaseConnector.$transaction([
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.deleteMany({
					where: { appellantCaseId }
				}),
				databaseConnector.appellantCaseIncompleteReasonOnAppellantCase.createMany({
					data: data.map((item) => ({
						appellantCaseId,
						appellantCaseIncompleteReasonId: Number(item)
					}))
				})
			]);
		},
		/**
		 * @param {number} appellantCaseId
		 * @param {string[]} data
		 * @returns {Promise<object>}
		 */
		updateAppellantCaseInvalidReasonAppellantCaseById(appellantCaseId, data) {
			return databaseConnector.$transaction([
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.deleteMany({
					where: { appellantCaseId }
				}),
				databaseConnector.appellantCaseInvalidReasonOnAppellantCase.createMany({
					data: data.map((item) => ({
						appellantCaseId,
						appellantCaseInvalidReasonId: Number(item)
					}))
				})
			]);
		}
	};
})();

export default appealRepository;

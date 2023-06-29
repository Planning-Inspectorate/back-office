import { databaseConnector } from '../utils/database-connector.js';
import { getSkipValue } from '../utils/database-pagination.js';
import { createManyToManyRelationData } from '../appeals/appeals/appeals.service.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.LinkedAppeal} LinkedAppeal */
/** @typedef {import('@pins/appeals.api').Appeals.LookupTables} LookupTables */
/** @typedef {import('@pins/appeals.api').Appeals.TimetableDeadlineDate} TimetableDeadlineDate */
/** @typedef {import('@pins/appeals.api').Appeals.NotValidReasons} NotValidReasons */
/** @typedef {import('@pins/appeals.api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/appeals.api').Schema.AppealTimetable} AppealTimetable */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCase} AppellantCase */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseValidationOutcome} AppellantCaseValidationOutcome */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReason} AppellantCaseInvalidReason */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReasonOnAppellantCase} AppellantCaseIncompleteReasonOnAppellantCase */
/** @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReasonOnAppellantCase} AppellantCaseInvalidReasonOnAppellantCase */
/** @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaire} LPAQuestionnaire */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
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
		 * @param {string} searchTerm
		 * @returns {Promise<[number, RepositoryGetAllResultItem[]]>}
		 */
		getAll(pageNumber, pageSize, searchTerm) {
			const where = {
				appealStatus: {
					some: {
						valid: true
					}
				},
				...(searchTerm !== 'undefined' && {
					OR: [
						{
							reference: {
								contains: searchTerm
							}
						},
						{
							address: {
								postcode: {
									contains: searchTerm
								}
							}
						}
					]
				})
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
							lpaQuestionnaireIncompleteReasonOnLPAQuestionnaire: {
								include: {
									lpaQuestionnaireIncompleteReason: true
								}
							},
							lpaQuestionnaireValidationOutcome: true,
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
		 *  otherNotValidReasons?: string;
		 *  appellantCaseValidationOutcomeId?: number;
		 *  lpaQuestionnaireValidationOutcomeId?: number;
		 * }} data
		 * @param {string} databaseTable
		 * @returns {PrismaPromise<object>}
		 */
		updateById(id, data, databaseTable) {
			// @ts-ignore
			return databaseConnector[databaseTable].update({
				where: { id },
				data
			});
		},
		/**
		 * @param {number} id
		 * @param {{
		 *	startedAt?: string;
		 * }} data
		 * @returns {PrismaPromise<object>}
		 */
		updateAppealById(id, data) {
			return databaseConnector.appeal.update({
				where: { id },
				data: {
					...data,
					updatedAt: new Date()
				}
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
		 * @param {string} databaseTable
		 * @param {string} value
		 * @returns {Promise<LookupTables | null>}
		 */
		getLookupListValueByName(databaseTable, value) {
			// @ts-ignore
			return databaseConnector[databaseTable].findUnique({
				where: {
					name: value
				}
			});
		},
		/**
		 * @param {{
		 *  id: number,
		 *  data: NotValidReasons,
		 *  databaseTable: string,
		 *  relationOne: string,
		 *  relationTwo: string,
		 * }} param0
		 * @returns {object[]}
		 */
		updateManyToManyRelationTable({ id, data, databaseTable, relationOne, relationTwo }) {
			return [
				// @ts-ignore
				databaseConnector[databaseTable].deleteMany({
					where: { [relationOne]: id }
				}),
				// @ts-ignore
				databaseConnector[databaseTable].createMany({
					data: createManyToManyRelationData({ data, relationOne, relationTwo, relationOneId: id })
				})
			];
		},
		/**
		 * @param {{
		 * 	appellantCaseId: number,
		 *	validationOutcomeId: number,
		 *	otherNotValidReasons: string,
		 *	incompleteReasons?: NotValidReasons,
		 *	invalidReasons?: NotValidReasons,
		 *	appealId?: number,
		 *	timetable?: TimetableDeadlineDate,
		 *	startedAt?: Date
		 * }} param0
		 * @returns {Promise<object>}
		 */
		updateAppellantCaseValidationOutcome({
			appellantCaseId,
			validationOutcomeId,
			otherNotValidReasons,
			incompleteReasons,
			invalidReasons,
			appealId,
			timetable,
			startedAt
		}) {
			const transaction = [
				this.updateById(
					appellantCaseId,
					{
						otherNotValidReasons,
						appellantCaseValidationOutcomeId: validationOutcomeId
					},
					'appellantCase'
				)
			];

			if (incompleteReasons) {
				transaction.push(
					...this.updateManyToManyRelationTable({
						id: appellantCaseId,
						data: incompleteReasons,
						databaseTable: 'appellantCaseIncompleteReasonOnAppellantCase',
						relationOne: 'appellantCaseId',
						relationTwo: 'appellantCaseIncompleteReasonId'
					})
				);
			}

			if (invalidReasons) {
				transaction.push(
					...this.updateManyToManyRelationTable({
						id: appellantCaseId,
						data: invalidReasons,
						databaseTable: 'appellantCaseInvalidReasonOnAppellantCase',
						relationOne: 'appellantCaseId',
						relationTwo: 'appellantCaseInvalidReasonId'
					})
				);
			}

			if (appealId && startedAt && timetable) {
				transaction.push(
					this.updateAppealById(appealId, { startedAt: startedAt.toISOString() }),
					this.upsertAppealTimetableById(appealId, timetable)
				);
			}

			return databaseConnector.$transaction(transaction);
		},
		/**
		 * @param {{
		 * 	lpaQuestionnaireId: number,
		 *  validationOutcomeId: number,
		 *	otherNotValidReasons: string,
		 *	incompleteReasons?: NotValidReasons,
		 *	appealId?: number,
		 *	timetable?: TimetableDeadlineDate,
		 * }} param0
		 * @returns {Promise<object>}
		 */
		updateLPAQuestionnaireValidationOutcome({
			lpaQuestionnaireId,
			validationOutcomeId,
			otherNotValidReasons,
			incompleteReasons,
			appealId,
			timetable
		}) {
			const transaction = [
				this.updateById(
					lpaQuestionnaireId,
					{
						otherNotValidReasons,
						lpaQuestionnaireValidationOutcomeId: validationOutcomeId
					},
					'lPAQuestionnaire'
				)
			];

			if (incompleteReasons) {
				transaction.push(
					...this.updateManyToManyRelationTable({
						id: lpaQuestionnaireId,
						data: incompleteReasons,
						databaseTable: 'lPAQuestionnaireIncompleteReasonOnLPAQuestionnaire',
						relationOne: 'lpaQuestionnaireId',
						relationTwo: 'lpaQuestionnaireIncompleteReasonId'
					})
				);
			}

			if (appealId && timetable) {
				transaction.push(this.upsertAppealTimetableById(appealId, timetable));
			}

			return databaseConnector.$transaction(transaction);
		}
	};
})();

export default appealRepository;

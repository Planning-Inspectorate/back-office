import { getSkipValue } from '#utils/database-pagination.js';
import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} searchTerm
 * @returns {Promise<[number, RepositoryGetAllResultItem[]]>}
 */
const getAllAppeals = (pageNumber, pageSize, searchTerm) => {
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
};

/**
 * @param {number} id
 * @returns {Promise<RepositoryGetByIdResultItem | void>}
 */
const getAppealById = async (id) => {
	let appeal = await databaseConnector.appeal.findUnique({
		where: {
			id
		},
		include: {
			address: true,
			allocation: true,
			specialisms: {
				include: {
					specialism: true
				}
			},
			appellantCase: {
				include: {
					appellantCaseIncompleteReasonsOnAppellantCases: {
						include: {
							appellantCaseIncompleteReason: true
						}
					},
					appellantCaseInvalidReasonsOnAppellantCases: {
						include: {
							appellantCaseInvalidReason: true
						}
					},
					appellantCaseValidationOutcome: true,
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
					neighbouringSiteContact: {
						include: {
							address: true
						}
					},
					procedureType: true,
					scheduleType: true
				}
			},
			siteVisit: {
				include: {
					siteVisitType: true
				}
			}
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
};

/**
 * @param {number} id
 * @param {{
 *	startedAt?: string;
 *	dueDate?: string;
 * }} data
 * @returns {PrismaPromise<object>}
 */
const updateAppealById = (id, data) =>
	databaseConnector.appeal.update({
		where: { id },
		data: {
			...data,
			updatedAt: new Date()
		}
	});

export default { getAppealById, getAllAppeals, updateAppealById };

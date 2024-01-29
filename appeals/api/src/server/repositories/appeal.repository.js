import { getSkipValue } from '#utils/database-pagination.js';
import { databaseConnector } from '#utils/database-connector.js';
import { hasValueOrIsNull } from '#endpoints/appeals/appeals.service.js';
import {
	DATABASE_ORDER_BY_DESC,
	STATE_TARGET_CLOSED,
	STATE_TARGET_COMPLETE
} from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetAllResultItem} RepositoryGetAllResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.UpdateAppealRequest} UpdateAppealRequest */
/** @typedef {import('@pins/appeals.api').Appeals.SetAppealDecisionRequest} SetAppealDecisionRequest */
/** @typedef {import('@pins/appeals.api').Appeals.SetInvalidAppealDecisionRequest} SetInvalidAppealDecisionRequest */
/** @typedef {import('@pins/appeals.api').Schema.InspectorDecision} InspectorDecision */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/** @typedef {import('@pins/appeals.api').Schema.User} User */
/** @typedef {import('@pins/appeals.api').Schema.AppealRelationship} AppealRelationship */
/**
 * @typedef {import('#db-client').Prisma.PrismaPromise<T>} PrismaPromise
 * @template T
 */

/**
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} searchTerm
 * @param {string} status
 * @param {string} hasInspector
 * @returns {Promise<[number, RepositoryGetAllResultItem[], any[]]>}
 */
const getAllAppeals = (pageNumber, pageSize, searchTerm, status, hasInspector) => {
	const where = {
		appealStatus: {
			some: {
				valid: true,
				...(status !== 'undefined' && { status })
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
		}),
		...(hasInspector === 'true' && {
			inspectorUserId: {
				not: null
			}
		}),
		...(hasInspector === 'false' && {
			inspectorUserId: null
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
				appealType: true,
				lpa: true
			},
			skip: getSkipValue(pageNumber, pageSize),
			take: pageSize
		}),
		getAppealsStatusesInNationalList(where)
	]);
};

/**
 * @param {string} userId
 * @param {number} pageNumber
 * @param {number} pageSize
 * @param {string} status
 * @returns {Promise<[number, RepositoryGetAllResultItem[], any[]]>}
 */
const getUserAppeals = (userId, pageNumber, pageSize, status) => {
	const where = {
		...(status !== 'undefined' && {
			appealStatus: {
				some: { valid: true, status }
			}
		}),
		OR: [
			{ inspector: { azureAdUserId: { equals: userId } } },
			{ caseOfficer: { azureAdUserId: { equals: userId } } }
		],
		AND: {
			appealStatus: {
				some: { valid: true, status: { notIn: [STATE_TARGET_COMPLETE, STATE_TARGET_CLOSED] } }
			}
		}
	};

	// @ts-ignore
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
				appealTimetable: true,
				appealType: true,
				appellantCase: {
					include: {
						appellantCaseIncompleteReasonsOnAppellantCases: {
							include: {
								appellantCaseIncompleteReason: true,
								appellantCaseIncompleteReasonText: true
							}
						},
						appellantCaseInvalidReasonsOnAppellantCases: {
							include: {
								appellantCaseInvalidReason: true,
								appellantCaseInvalidReasonText: true
							}
						},
						appellantCaseValidationOutcome: true,
						knowledgeOfOtherLandowners: true,
						planningObligationStatus: true
					}
				},
				lpa: true,
				lpaQuestionnaire: {
					include: {
						lpaQuestionnaireValidationOutcome: true
					}
				}
			},
			skip: getSkipValue(pageNumber, pageSize),
			take: pageSize
		}),
		getAppealsStatusesInPersonalList(userId)
	]);
};

/**
 * @param {string|undefined} userId
 */
const getAppealsStatusesInPersonalList = (userId) => {
	const where = {
		AND: {
			appealStatus: {
				some: { valid: true, status: { not: STATE_TARGET_COMPLETE } }
			}
		},
		...(userId !== 'undefined' && {
			OR: [
				{ inspector: { azureAdUserId: { equals: userId } } },
				{ caseOfficer: { azureAdUserId: { equals: userId } } }
			]
		})
	};

	return databaseConnector.appeal.findMany({
		where,
		select: {
			appealStatus: {
				select: {
					status: true
				},
				where: {
					valid: true
				}
			}
		}
	});
};

/**
 * @param {object} where
 */
const getAppealsStatusesInNationalList = (where) => {
	return databaseConnector.appeal.findMany({
		where,
		select: {
			appealStatus: {
				select: {
					status: true
				},
				where: {
					valid: true
				}
			}
		}
	});
};

/**
 * @param {number} id
 * @returns {Promise<RepositoryGetByIdResultItem|undefined>}
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
							appellantCaseIncompleteReason: true,
							appellantCaseIncompleteReasonText: true
						}
					},
					appellantCaseInvalidReasonsOnAppellantCases: {
						include: {
							appellantCaseInvalidReason: true,
							appellantCaseInvalidReasonText: true
						}
					},
					appellantCaseValidationOutcome: true,
					knowledgeOfOtherLandowners: true,
					planningObligationStatus: true
				}
			},
			appellant: true,
			agent: true,
			lpa: true,
			appealStatus: {
				where: {
					valid: true
				}
			},
			appealTimetable: true,
			appealType: true,
			auditTrail: {
				include: {
					user: true
				},
				orderBy: {
					loggedAt: DATABASE_ORDER_BY_DESC
				}
			},
			caseOfficer: true,
			inspector: true,
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
							lpaQuestionnaireIncompleteReason: true,
							lpaQuestionnaireIncompleteReasonText: true
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
		const linkedAppeals = await databaseConnector.appealRelationship.findMany({
			where: {
				OR: [
					{
						parentRef: {
							equals: appeal.reference
						}
					},
					{
						childRef: {
							equals: appeal.reference
						}
					}
				]
			}
		});

		// @ts-ignore
		return {
			...appeal,
			linkedAppeals
		};
	}
};

/**
 * @param {number} id
 * @param {UpdateAppealRequest} data
 * @returns {PrismaPromise<object>}
 */
const updateAppealById = (id, { dueDate, startedAt, caseOfficer, inspector }) =>
	databaseConnector.appeal.update({
		where: { id },
		data: {
			...(dueDate && { dueDate }),
			...(startedAt && { startedAt }),
			...(hasValueOrIsNull(caseOfficer) && { caseOfficerUserId: caseOfficer }),
			...(hasValueOrIsNull(inspector) && { inspectorUserId: inspector }),
			updatedAt: new Date()
		}
	});

/**
 * @param {number} id
 * @param {SetAppealDecisionRequest} data
 * @returns {PrismaPromise<[InspectorDecision, DocumentVersion]>}
 */
const setAppealDecision = (id, { documentDate, documentGuid, version = 1, outcome }) => {
	const decisionDate = new Date(documentDate).toISOString();
	// @ts-ignore
	return databaseConnector.$transaction([
		databaseConnector.inspectorDecision.create({
			data: {
				appeal: {
					connect: {
						id
					}
				},
				outcome,
				decisionLetterGuid: documentGuid
			}
		}),
		databaseConnector.documentVersion.update({
			where: {
				documentGuid_version: {
					documentGuid,
					version
				}
			},
			data: {
				dateReceived: decisionDate,
				published: true,
				draft: false
			}
		})
	]);
};

/**
 * @param {number} id
 * @param {SetInvalidAppealDecisionRequest} data
 * @returns {PrismaPromise<[InspectorDecision, DocumentVersion]>}
 */
const setInvalidAppealDecision = (id, { invalidDecisionReason, outcome }) => {
	// @ts-ignore
	return databaseConnector.$transaction([
		databaseConnector.inspectorDecision.create({
			data: {
				appeal: {
					connect: {
						id
					}
				},
				outcome,
				invalidDecisionReason
			}
		})
	]);
};

/**
 *
 * @param {string} appealReference
 * @returns {Promise<AppealRelationship[]>}
 */
const getLinkedAppeals = async (appealReference) => {
	return await databaseConnector.appealRelationship.findMany({
		where: {
			OR: [
				{
					parentRef: {
						equals: appealReference
					}
				},
				{
					childRef: {
						equals: appealReference
					}
				}
			]
		}
	});
};

export default {
	getLinkedAppeals,
	getAppealById,
	getAllAppeals,
	getUserAppeals,
	updateAppealById,
	setAppealDecision,
	setInvalidAppealDecision
};

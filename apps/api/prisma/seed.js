import { createFolders } from '../src/server/repositories/folder.repository.js';
import { databaseConnector } from '../src/server/utils/database-connector.js';
import logger from '../src/server/utils/logger.js';
import {
	addressesList,
	appealDetailsFromAppellantList,
	appellantsList,
	caseStatusNames,
	completeValidationDecisionSample,
	incompleteReviewQuestionnaireSample,
	incompleteValidationDecisionSample,
	invalidValidationDecisionSample,
	localPlanningDepartmentList,
	lpaQuestionnaireList,
	regions,
	represenations,
	sectors,
	subSectors,
	zoomLevels
} from './seed-samples.js';

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();

	date.setDate(date.getDate() - 14);
	date.setHours(23);
	return date;
}

/**
 * @returns {string}
 */
function generateAppealReference() {
	const number = Math.floor(Math.random() * 999_999 + 1);

	return `APP/Q9999/D/21/${number}`;
}

// Application reference should be in the format (subSector)(5 digit sequential_number with leading 1) eg EN0110001
/**
 * @param {{abbreviation: string}} subSector
 * @param {number} referenceNumber
 * @returns {string}
 */
function generateApplicationReference(subSector, referenceNumber) {
	const formattedReferenceNumber = `1000${referenceNumber}`.slice(-5);

	return `${subSector.abbreviation}${formattedReferenceNumber}`;
}

/**
 *
 * @param {object[] | string[]} list
 * @returns {object | string}
 */
function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

const appealTypes = {
	HAS: 'household',
	FPA: 'full planning'
};

/**
 *
 * @param {string} lpaQuestionnaireAndInspectorPickupState
 * @param {string} statementsAndFinalCommentsState
 * @param {Date} createdAt
 * @returns {{status: string, createdAt: Date, subStateMachineName: string, compoundStateName: string}[]}
 */
const buildCompoundState = (
	lpaQuestionnaireAndInspectorPickupState,
	statementsAndFinalCommentsState,
	createdAt = new Date()
) => {
	return [
		{
			status: lpaQuestionnaireAndInspectorPickupState,
			createdAt,
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		},
		{
			status: statementsAndFinalCommentsState,
			createdAt,
			subStateMachineName: 'statementsAndFinalComments',
			compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
		}
	];
};

/**
 *
 * @param {{
 * 	typeShorthand: string,
 * 	statuses?: object,
 * 	incompleteValidationDecision?: boolean,
 *  invalidValidationDecision?: boolean,
 *  completeValidationDecision?: boolean,
 *  lpaQuestionnaire?: boolean,
 *  startedAt?: Date | null,
 *  incompleteReviewQuestionnaire?: boolean,
 *  completeReviewQuestionnaire?: boolean,
 *  connectToUser?: boolean,
 *  siteVisitBooked?: boolean}} param0
 * @returns {object}
 */
const appealFactory = ({
	typeShorthand,
	statuses = {},
	incompleteValidationDecision = false,
	invalidValidationDecision = false,
	completeValidationDecision = false,
	lpaQuestionnaire = false,
	startedAt = null,
	incompleteReviewQuestionnaire = false,
	completeReviewQuestionnaire = false,
	connectToUser = false,
	siteVisitBooked = false
}) => {
	return {
		appealType: { connect: { shorthand: typeShorthand } },
		reference: generateAppealReference(),
		startedAt,
		appealStatus: { create: statuses },
		appellant: { create: pickRandom(appellantsList) },
		localPlanningDepartment: pickRandom(localPlanningDepartmentList),
		planningApplicationReference: '48269/APP/2021/1482',
		address: { create: pickRandom(addressesList) },
		...(incompleteValidationDecision && {
			validationDecision: { create: incompleteValidationDecisionSample }
		}),
		...(invalidValidationDecision && {
			validationDecision: { create: invalidValidationDecisionSample }
		}),
		...(completeValidationDecision && {
			validationDecision: { create: completeValidationDecisionSample }
		}),
		...(lpaQuestionnaire && { lpaQuestionnaire: { create: pickRandom(lpaQuestionnaireList) } }),
		...(incompleteReviewQuestionnaire && {
			reviewQuestionnaire: { create: incompleteReviewQuestionnaireSample }
		}),
		...(completeReviewQuestionnaire && { reviewQuestionnaire: { create: { complete: true } } }),
		appealDetailsFromAppellant: { create: pickRandom(appealDetailsFromAppellantList) },
		...(connectToUser && {
			user: {
				connectOrCreate: {
					create: {
						azureReference: 1
					},
					where: {
						azureReference: 1
					}
				}
			}
		}),
		...(siteVisitBooked && {
			siteVisit: {
				create: {
					visitDate: new Date(2022, 3, 1),
					visitSlot: '1pm - 2pm',
					visitType: 'unaccompanied'
				}
			}
		})
	};
};

const newAppeals = [
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'HAS' }),
	appealFactory({ typeShorthand: 'FPA' }),
	appealFactory({ typeShorthand: 'FPA' }),
	appealFactory({ typeShorthand: 'FPA' }),
	appealFactory({ typeShorthand: 'FPA' }),
	appealFactory({ typeShorthand: 'FPA' }),
	appealFactory({ typeShorthand: 'FPA' })
];

const appealsAwaitingValidationInfo = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'awaiting_validation_info' },
		incompleteValidationDecision: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'awaiting_validation_info' },
		incompleteValidationDecision: true
	})
];

const invalidAppeals = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'invalid_appeal' },
		invalidValidationDecision: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'invalid_appeal' },
		invalidValidationDecision: true
	})
];

const appealsAwaitingLPAQuestionnaire = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'awaiting_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'awaiting_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	})
];

const appealsAwaitingLPAQuestionnaireOverdue = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'overdue_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2021, 10, 10)
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'overdue_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2021, 10, 10)
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'overdue_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2021, 10, 10)
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'overdue_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2021, 10, 10)
	})
];

const appealsReadyForConfirmationFromCaseOfficer = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'received_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'received_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'received_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10)
	})
];

const appealsReviewIncomplete = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'incomplete_lpa_questionnaire', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'incomplete_lpa_questionnaire',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		incompleteReviewQuestionnaire: true
	})
];

const appealsAvailableForInspectorPickup = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'available_for_inspector_pickup', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'available_for_inspector_pickup',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'available_for_inspector_pickup',
			'available_for_final_comments',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'available_for_inspector_pickup',
			'closed_for_statements_and_final_comments',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true
	})
];

const appealPickedUpButStillAcceptingFinalComments = [
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState('picked_up', 'available_for_final_comments', getDateTwoWeeksAgo()),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState('picked_up', 'available_for_statements', getDateTwoWeeksAgo()),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true,
		connectToUser: true
	})
];

const appealsSiteVisitNotYetBooked = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'site_visit_not_yet_booked' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'site_visit_not_yet_booked' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'site_visit_not_yet_booked' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	})
];

const appealsWithBookedSiteVisit = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'site_visit_booked' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true,
		siteVisitBooked: true
	})
];

const appealsWithDecisionDue = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'decision_due' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true,
		siteVisitBooked: true
	})
];

const appealsData = [
	...newAppeals,
	...appealsAwaitingValidationInfo,
	...invalidAppeals,
	...appealsAwaitingLPAQuestionnaire,
	...appealsAwaitingLPAQuestionnaireOverdue,
	...appealsReviewIncomplete,
	...appealsReadyForConfirmationFromCaseOfficer,
	...appealsAvailableForInspectorPickup,
	...appealPickedUpButStillAcceptingFinalComments,
	...appealsSiteVisitNotYetBooked,
	...appealsWithBookedSiteVisit,
	...appealsWithDecisionDue
];

const deleteLowestFolders = async () => {
	await databaseConnector.folder.deleteMany({
		where: {
			childFolders: {
				every: {
					parentFolder: null
				}
			}
		}
	});
};

const deleteAllRecords = async () => {
	const deleteCases = databaseConnector.case.deleteMany();
	const deleteCaseStatuses = databaseConnector.caseStatus.deleteMany();
	const deleteApplicationDetails = databaseConnector.applicationDetails.deleteMany();
	const deleteSubSectors = databaseConnector.subSector.deleteMany();
	const deleteSectors = databaseConnector.sector.deleteMany();
	const deleteRegions = databaseConnector.region.deleteMany();
	const deleteZoomLevels = databaseConnector.zoomLevel.deleteMany();
	const deleteRegionsOnApplicationDetails =
		databaseConnector.regionsOnApplicationDetails.deleteMany();
	const deleteAppeals = databaseConnector.appeal.deleteMany();
	const deleteUsers = databaseConnector.user.deleteMany();
	const deleteAppealTypes = databaseConnector.appealType.deleteMany();
	const deleteAddresses = databaseConnector.address.deleteMany();
	const deleteAppealDetailsFromAppellant =
		databaseConnector.appealDetailsFromAppellant.deleteMany();
	const deleteAppealStatus = databaseConnector.appealStatus.deleteMany();
	const deleteAppellant = databaseConnector.appellant.deleteMany();
	const deleteInspectorDecision = databaseConnector.inspectorDecision.deleteMany();
	const deleteLPAQuestionnaire = databaseConnector.lPAQuestionnaire.deleteMany();
	const deleteReviewQuestionnaire = databaseConnector.reviewQuestionnaire.deleteMany();
	const deleteSiteVisit = databaseConnector.siteVisit.deleteMany();
	const deleteValidationDecision = databaseConnector.validationDecision.deleteMany();
	const deleteServiceCustomers = databaseConnector.serviceCustomer.deleteMany();
	const deleteGridReference = databaseConnector.gridReference.deleteMany();
	const deleteDocuments = databaseConnector.document.deleteMany();
	const deleteDocumentsVersions = databaseConnector.documentVersion.deleteMany();
	const deleteFolders = databaseConnector.folder.deleteMany();
	const deleteRepresentationContact = databaseConnector.representationContact.deleteMany();
	const deleteRepresentation = databaseConnector.representation.deleteMany();

	await deleteRepresentationContact;
	await deleteRepresentation;

	await deleteLowestFolders();
	await deleteLowestFolders();
	await deleteLowestFolders();
	await deleteLowestFolders();
	await deleteLowestFolders();

	await databaseConnector.$transaction([
		deleteGridReference,
		deleteServiceCustomers,
		deleteRegionsOnApplicationDetails,
		deleteApplicationDetails,
		deleteCaseStatuses,
		deleteCases,
		deleteSubSectors,
		deleteSectors,
		deleteRegions,
		deleteZoomLevels,
		deleteAppealDetailsFromAppellant,
		deleteAppealStatus,
		deleteValidationDecision,
		deleteLPAQuestionnaire,
		deleteReviewQuestionnaire,
		deleteSiteVisit,
		deleteUsers,
		deleteAppealTypes,
		deleteAddresses,
		deleteInspectorDecision,
		deleteAppeals,
		deleteAppellant,
		deleteFolders,
		deleteDocuments,
		deleteDocumentsVersions
	]);
};

/**
 *
 * @param {string} caseReference
 * @param {number} index
 * @returns {any}
 */
function createRepresentation(caseReference, index) {
	const { contacts, ...rep } = pickRandom(represenations);

	return {
		reference: `${caseReference}-${index}`,
		...rep,
		contacts: {
			create: contacts.create.map((contact) => ({
				...contact,
				address: { create: pickRandom(addressesList) }
			}))
		}
	};
}

/**
 *
 * @param {{name: string, displayNameEn: string}} subSector
 * @param {number} index
 */
const createApplication = async (subSector, index) => {
	const title = `${subSector.displayNameEn} Test Application ${index}`;
	const caseStatus = pickRandom(caseStatusNames).name;
	// Draft cases do not have a reference assigned to them yet
	const reference = caseStatus === 'draft' ? null : generateApplicationReference(subSector, index);

	let representations = [];

	if (caseStatus !== 'draft') {
		representations = [
			createRepresentation(reference, 1),
			createRepresentation(reference, 2),
			createRepresentation(reference, 3)
		];
	}

	const newCase = await databaseConnector.case.create({
		data: {
			reference,
			modifiedAt: new Date(),
			description: `A description of test case ${index} which is a case of subsector type ${subSector.displayNameEn}`,
			title,
			ApplicationDetails: {
				create: {
					subSector: {
						connect: {
							name: subSector.name
						}
					},
					regions: {
						create: [
							{
								region: {
									connect: {
										name: pickRandom(regions).name
									}
								}
							}
						]
					},
					zoomLevel: {
						connect: {
							name: pickRandom(zoomLevels).name
						}
					}
				}
			},
			CaseStatus: {
				create: [
					{
						status: caseStatus
					}
				]
			},
			serviceCustomer: {
				create: [{}]
			},
			Representation: {
				create: representations
			}
		}
	});

	// create folders if case is not in draft state
	if (caseStatus !== 'draft') {
		Promise.all(createFolders(newCase.id));
	}

	return newCase;
};

/**
 *
 */
const developMain = async () => {
	try {
		await deleteAllRecords();
		await databaseConnector.appealType.createMany({
			data: [
				{ shorthand: 'FPA', type: appealTypes.FPA },
				{ shorthand: 'HAS', type: appealTypes.HAS }
			]
		});
		for (const appealData of appealsData) {
			await databaseConnector.appeal.create({ data: appealData });
		}
		for (const sector of sectors) {
			await databaseConnector.sector.create({ data: sector });
		}
		for (const { subSector, sectorName } of subSectors) {
			await databaseConnector.subSector.create({
				data: { ...subSector, sector: { connect: { name: sectorName } } }
			});
		}
		for (const region of regions) {
			await databaseConnector.region.create({
				data: region
			});
		}
		for (const zoomLevel of zoomLevels) {
			await databaseConnector.zoomLevel.create({
				data: zoomLevel
			});
		}
		for (const { subSector } of subSectors) {
			for (let index = 1; index < 4; index += 1) {
				await createApplication(subSector, index);
			}
		}
	} catch (error) {
		logger.error(error);
		throw error;
	} finally {
		await databaseConnector.$disconnect();
	}
};

await developMain();

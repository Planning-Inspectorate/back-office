/**
 * Test data used for development and testing
 */

import { createFolders } from '../../server/repositories/folder.repository.js';
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
	represenations
} from './data-samples.js';
import { regions, subSectors, zoomLevels } from './data-static.js';

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

const appealsLpaQuestionnaireDue = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'lpa_questionnaire_due', createdAt: getDateTwoWeeksAgo() },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: buildCompoundState(
			'lpa_questionnaire_due',
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
			'lpa_questionnaire_due',
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
			'lpa_questionnaire_due',
			'available_for_statements',
			getDateTwoWeeksAgo()
		),
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date()
	})
];

const appealsStatementReview = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'statement_review' },
		invalidValidationDecision: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'statement_review' },
		invalidValidationDecision: true
	})
];

const appealsFinalCommentReview = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'final_comment_review' },
		incompleteValidationDecision: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'final_comment_review' },
		incompleteValidationDecision: true
	})
];

const appealsArrangeSiteVisit = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 3, 1, 10),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	}),
	appealFactory({
		typeShorthand: 'FPA',
		statuses: { status: 'arrange_site_visit' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true
	})
];

const appealsIssueDetermination = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'issue_determination' },
		completeValidationDecision: true,
		lpaQuestionnaire: true,
		startedAt: new Date(2022, 4, 1, 11),
		completeReviewQuestionnaire: true,
		connectToUser: true,
		siteVisitBooked: true
	})
];

const appealsComplete = [
	appealFactory({
		typeShorthand: 'HAS',
		statuses: { status: 'complete' },
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
	...appealsLpaQuestionnaireDue,
	...appealsStatementReview,
	...appealsFinalCommentReview,
	...appealsArrangeSiteVisit,
	...appealsIssueDetermination,
	...appealsComplete
];

/**
 *
 * @param {string} caseReference
 * @param {number} index
 * @returns {any}
 */
function createRepresentation(caseReference, index) {
	const { contacts, ...rep } = pickRandom(represenations);

	const statuses = ['AWAITING_REVIEW', 'REFERRED', 'INVALID', 'PUBLISHED', 'WITHDRAWN', 'ARCHIVED'];

	return {
		reference: `${caseReference}-${index}`,
		...rep,
		status: statuses[Math.floor(Math.random() * statuses.length)],
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
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 * @param {{name: string, displayNameEn: string}} subSector
 * @param {number} index
 */
const createApplication = async (databaseConnector, subSector, index) => {
	const title = `${subSector.displayNameEn} Test Application ${index}`;
	const caseStatus = pickRandom(caseStatusNames).name;
	// Draft cases do not have a reference assigned to them yet
	const reference = caseStatus === 'draft' ? null : generateApplicationReference(subSector, index);

	let representations = [];

	if (caseStatus !== 'draft') {
		if (subSector.name === 'office_use' && index === 1) {
			for (let loopIndex = 0; loopIndex < 101; loopIndex += 1) {
				representations.push(createRepresentation(reference, loopIndex));
			}
		} else {
			representations = [
				createRepresentation(reference, 1),
				createRepresentation(reference, 2),
				createRepresentation(reference, 3)
			];
		}
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
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function seedTestData(databaseConnector) {
	await databaseConnector.appealType.createMany({
		data: [
			{ shorthand: 'FPA', type: appealTypes.FPA },
			{ shorthand: 'HAS', type: appealTypes.HAS }
		]
	});
	for (const appealData of appealsData) {
		await databaseConnector.appeal.create({ data: appealData });
	}
	// now create some sample applications
	for (const { subSector } of subSectors) {
		for (let index = 1; index < 4; index += 1) {
			await createApplication(databaseConnector, subSector, index);
		}
	}
}

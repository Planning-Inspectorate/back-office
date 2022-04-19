import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;

const prisma = new PrismaClient();

/**
 * @returns {Date} date two weeks ago
 */
function getDateTwoWeeksAgo() {
	const date = new Date();
	date.setDate(date.getDate() - 14);
	date.setHours(23);
	return date;
}

const newAppeals = [{
	reference: 'APP/Q9999/D/21/1345264',
	appellant: {
		create: {
			name: 'Lee Thornton',
			email: 'lee.thornton@gmail.com'
		}
	},
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	address: {
		create: {
			addressLine1: '96 The Avenue',
			addressLine2: 'Maidstone',
			county: 'Kent',
			postcode: 'MD21 5XY'
		}
	}
},
{
	reference: 'APP/Q9999/D/21/5463281',
	appellant: {
		create: {
			name: 'Haley Eland',
			email: 'haley.eland@gmail.com'
		}
	},
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	planningApplicationReference: '32569/APP/2021/2102',
	address: {
		create: {
			addressLine1: '55 Butcher Street',
			town: 'Thurnscoe',
			postcode: 'S63 0RB'
		}
	}
},
{
	reference: 'APP/Q9999/D/21/1203521',
	appellant: {
		create: {
			name: 'Roger Simmons',
			email: 'rg@gmail.com'
		}
	},
	localPlanningDepartment: 'Worthing Borough Council',
	planningApplicationReference: '25468/APP/2021/1185',
	address: {
		create: {
			addressLine1: '8 The Chase',
			town: 'Findon',
			postcode: 'BN14 0TT'
		}
	}
},
{
	reference: 'APP/Q9999/D/21/1154923',
	appellant: {
		create: {
			name: 'Sophie Skinner',
			email: 'skinner@gmail.com'
		}
	},
	localPlanningDepartment: 'Dorset Council',
	planningApplicationReference: '19457/APP/2021/5421',
	address: {
		create: {
			addressLine1: '96 The Avenue',
			addressLine2: 'Maidstone',
			county: 'Kent',
			postcode: 'MD21 5XY'
		}
	}
},
{
	reference: 'APP/Q9999/D/21/1087562',
	appellant: {
		create: {
			name: 'Ryan Marshall',
			email: 'marshall@gmail.com'
		}
	},
	localPlanningDepartment: 'Basingstoke and Deane Borough Council',
	planningApplicationReference: '10016/APP/2021/960',
	address: {
		create: {
			addressLine1: '44 Rivervale',
			town: 'Bridport',
			postcode: 'DT6 5RN'
		}
	}
},
{
	reference: 'APP/Q9999/D/21/1365524',
	appellant: {
		create: {
			name: 'Fiona Burgess',
			email: 'fi.bu@gmail.com'
		}
	},
	localPlanningDepartment: 'Wiltshire Council',
	planningApplicationReference: '9423/APP/2021/1223',
	address: {
		create: {
			addressLine1: '92 Huntsmoor Road',
			town: 'Tadley',
			postcode: 'RG26 4BX'
		}
	}
}];

const appealsAwaitingValidationInfo = [
	{
		reference: 'APP/Q9999/D/21/1224115',
		appellant: {
			create: {
				name: 'Kevin Fowler',
				email: 'kv@gmail.com'
			}
		},
		localPlanningDepartment: 'Waveney District Council',
		planningApplicationReference: '18543/APP/2021/6627',
		status: 'awaiting_validation_info',
		address: {
			create: {
				addressLine1: '1 Grove Cottage',
				addressLine2: 'Shotesham Road',
				town: 'Woodton',
				postcode: 'NR35 2ND'
			}
		},
		validationDecision: {
			create: {
				decision: 'incomplete',
				namesDoNotMatch: true,
				sensitiveInfo: true,
				missingApplicationForm: true,
				missingDecisionNotice: true,
				missingGroundsForAppeal: true,
				missingSupportingDocuments: true,
				inflammatoryComments: true,
				openedInError: true,
				wrongAppealTypeUsed: true,
				otherReasons: 'Some other weird reason'
			}
		}
	}
];

const invalidAppeals = [
	{
		reference: 'APP/Q9999/D/21/1345264',
		appellant: {
			create: {
				name: 'Lee Thornton',
				email: 'lee@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'invalid_appeal',
		address: {
			create: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: 'Kent',
				postcode: 'MD21 5XY'
			}
		}
	}
];

const appealsAwaitingLPAQuestionnaire = [
	{
		reference: 'APP/Q9999/D/21/1345264',
		appellant: {
			create: {
				name: 'Bob Ross',
				email: 'bob@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(),
		address: {
			create: {
				addressLine1: '96 The Avenue',
				addressLine2: 'Maidstone',
				town: 'Kent',
				postcode: 'MD21 5XY'
			}
		},
		lpaQuestionnaire: {
			create: {}
		}
	},
	{
		reference: 'APP/Q9999/D/21/5463281',
		appellant: {
			create: {
				name: 'Bob Ross',
				email: 'bob@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'awaiting_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(),
		address: {
			create: {
				addressLine1: '55 Butcher Street',
				town: 'Thurnscoe',
				postcode: 'MD21 5XY'
			}
		},
		lpaQuestionnaire: {
			create: {}
		}
	}
];

const appealsAwaitingLPAQuestionnaireOverdue = [
	{
		reference: 'APP/Q9999/D/21/5551277',
		appellant: {
			create: {
				name: 'Eva Sharma',
				email: 'eva.sharma@gmail.com'
			}
		},
		localPlanningDepartment: 'Bristol City Council',
		planningApplicationReference: '48269/APP/2021/1010',
		status: 'overdue_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(2021, 10, 10),
		address: {
			create: {
				addressLine1: '19 Beauchamp Road',
				town: 'Bristol',
				postcode: 'BS7 8LQ'
			}
		},
		lpaQuestionnaire: {
			create: {}
		}
	}
];

const appealsReviewIncomplete = [
	{
		reference: 'APP/Q8874/D/23/4293472',
		appellant: {
			create: {
				name: 'Maria Sharma',
				email: 'maria.sharma@gmail.com'
			}
		},
		localPlanningDepartment: 'Bristol City Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'incomplete_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(2021, 12, 12),
		address: {
			create: {
				addressLine1: '180 Bloomfield Road, Bristol, ',
				town: 'Bristol',
				postcode: 'BS4 3QX'
			}
		},
		lpaQuestionnaire: {
			create: {
				affectsListedBuilding: false,
				extraConditions: false,
				inGreenBelt: false,
				inOrNearConservationArea: false,
				siteVisibleFromPublicLand: false,
				siteVisibleFromPublicLandDescription: 'The extension is to the rear of the property, and the garden has high hedges.',
				doesInspectorNeedToEnterSite: true,
				doesInspectorNeedToEnterSiteDescription: 'The proposed development can only be viewed from the appellant\'s garden',
				doesInspectorNeedToAccessNeighboursLand: true,
				doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
				healthAndSafetyIssues: true,
				healthAndSafetyIssuesDescription: 'A defensive dog',
				appealsInImmediateAreaBeingConsidered: '893482, 372839',
				sentAt: new Date(2022, 3, 1),
				receivedAt: new Date(2022, 3, 20)
			}
		},
		reviewQuestionnaire: {
			create: {
				createdAt: new Date(2022, 3, 20),
				complete: false,
				applicationPlanningOfficersReportMissingOrIncorrect: false,
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Missing Documents XYZ',
				policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: false,
				policiesOtherRelevantPoliciesMissingOrIncorrect: false,
				policiesSupplementaryPlanningDocumentsMissingOrIncorrect: false,
				siteConservationAreaMapAndGuidanceMissingOrIncorrect: false,
				siteListedBuildingDescriptionMissingOrIncorrect: false,
				thirdPartyApplicationNotificationMissingOrIncorrect: false,
				thirdPartyApplicationPublicityMissingOrIncorrect: false,
				thirdPartyRepresentationsMissingOrIncorrect: false,
				thirdPartyAppealNotificationMissingOrIncorrect: false
			}
		}
	}
];

const appealsAvailableForInspectorPickup = [
	{
		reference: 'APP/Q9999/D/21/1087562',
		appellant: {
			create: {
				name: 'Bob Ross',
				email: 'bob@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'available_for_inspector_pickup',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		startedAt: new Date(),
		address: {
			create: {
				addressLine1: '92 Huntsmoor Road',
				county: 'Tadley',
				postcode: 'RG26 4BX'
			}
		},
		lpaQuestionnaire: {
			create: {
				affectsListedBuilding: false,
				extraConditions: false,
				inGreenBelt: false,
				inOrNearConservationArea: false,
				siteVisibleFromPublicLand: false,
				siteVisibleFromPublicLandDescription: 'The extension is to the read of the property, and the garden has high hedges',
				doesInspectorNeedToEnterSite: true,
				doesInspectorNeedToEnterSiteDescription: 'The proposed development can only be viewed from the appellant\'s garden',
				doesInspectorNeedToAccessNeighboursLand: true,
				doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
				healthAndSafetyIssues: true,
				healthAndSafetyIssuesDescription: 'A defensive dog',
				appealsInImmediateAreaBeingConsidered: '893482, 372839',
				sentAt: new Date(2022, 3, 1),
				receivedAt: new Date(2022, 3, 20)
			}
		}
	}
];

const appealsWithBookedSiteVisit = [
	{
		reference: 'APP/2021/56789/3556481',
		appellant: {
			create: {
				name: 'Bob Ross',
				email: 'bob@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		status: 'site_visit_booked',
		startedAt: new Date(2022, 1, 1, 9),
		address: {
			create: {
				addressLine1: '131 High Street',
				county: 'Bradford',
				postcode: 'BD6 1JK'
			}
		},
		siteVisit: {
			create: {
				visitDate: new Date(2022, 3, 1),
				visitSlot: '1pm - 2pm',
				visitType: 'unaccompanied'
			}
		},
		user: {
			connect: {
				id: 1
			}
		},
		appealDetailsFromAppellant: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			}
		},
		lpaQuestionnaire: {
			create: {
				affectsListedBuilding: false,
				extraConditions: false,
				inGreenBelt: false,
				inOrNearConservationArea: false,
				siteVisibleFromPublicLand: false,
				siteVisibleFromPublicLandDescription: 'The extension is to the read of the property, and the garden has high hedges',
				doesInspectorNeedToEnterSite: true,
				doesInspectorNeedToEnterSiteDescription: 'The proposed development can only be viewed from the appellant\'s garden',
				doesInspectorNeedToAccessNeighboursLand: true,
				doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
				healthAndSafetyIssues: true,
				healthAndSafetyIssuesDescription: 'A defensive dog',
				appealsInImmediateAreaBeingConsidered: '893482, 372839',
				sentAt: new Date(2022, 3, 1),
				receivedAt: new Date(2022, 3, 20)
			}
		},
		validationDecision: {
			create: {
				decision: 'complete',
				descriptionOfDevelopment: 'some description'
			}
		}
	}
];

const appealsReadyForConfirmationFromCaseOfficer = [
	{
		reference: 'APP/Q9999/D/21/1087562',
		appellant: {
			create: {
				name: 'Bob Ross',
				email: 'bob@gmail.com'
			}
		},
		localPlanningDepartment: 'Maidstone Borough Council',
		planningApplicationReference: '48269/APP/2021/1482',
		startedAt: new Date(2022, 3, 1, 10),
		status: 'received_lpa_questionnaire',
		statusUpdatedAt: getDateTwoWeeksAgo(),
		address: {
			create: {
				addressLine1: '92 Huntsmoor Road',
				county: 'Tadley',
				postcode: 'RG26 4BX'
			}
		},
		lpaQuestionnaire: {
			create: {
				affectsListedBuilding: false,
				extraConditions: false,
				inGreenBelt: false,
				inOrNearConservationArea: false,
				siteVisibleFromPublicLand: false,
				siteVisibleFromPublicLandDescription: 'The extension is to the read of the property, and the garden has high hedges',
				doesInspectorNeedToEnterSite: true,
				doesInspectorNeedToEnterSiteDescription: 'The proposed development can only be viewed from the appellant\'s garden',
				doesInspectorNeedToAccessNeighboursLand: true,
				doesInspectorNeedToAccessNeighboursLandDescription: '54 Butcher Street',
				healthAndSafetyIssues: true,
				healthAndSafetyIssuesDescription: 'A defensive dog',
				appealsInImmediateAreaBeingConsidered: '893482, 372839',
				sentAt: new Date(2022, 3, 1),
				receivedAt: new Date(2022, 3, 20)
			}
		}
	}
];

const appealsSiteVisitNotYetBooked = [
	{
		reference: 'APP/2021/56789/3755470',
		localPlanningDepartment: 'Some Department',
		planningApplicationReference: 'ABC',
		status: 'site_visit_not_yet_booked',
		appellant: {
			create: {
				name: 'Maria Sharma',
				email: 'maria.sharma@gmail.com'
			}
		},
		address: {
			create: {
				addressLine1: 'Copthalls',
				addressLine2: 'Clevedon Road',
				town: 'West Hill',
				postcode: 'BS48 1PN'
			}
		},
		startedAt: new Date(2022, 3, 1, 10),
		appealDetailsFromAppellant: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			}
		},
		user: {
			connect: {
				id: 1
			}
		},
		lpaQuestionnaire: {
			create: {
				siteVisibleFromPublicLand: false,
				siteVisibleFromPublicLandDescription: 'not visible from public land',
				doesInspectorNeedToEnterSite: true,
				doesInspectorNeedToEnterSiteDescription: 'inspector will want to enter site',
				doesInspectorNeedToAccessNeighboursLand: false,
				doesInspectorNeedToAccessNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateAreaBeingConsidered: '123/456/789, ABC/DEF/GHI'
			}
		},
		validationDecision: {
			create: {
				decision: 'complete',
				descriptionOfDevelopment: 'some description'
			}
		}
	},
	{
		reference: 'APP/2021/56789/4909983',
		localPlanningDepartment: 'some other department',
		planningApplicationReference: 'XYZ',
		status: 'site_visit_not_yet_booked',
		appellant: {
			create: {
				name: 'Maria Sharma',
				email: 'maria.sharma@gmail.com'
			}
		},
		address: {
			create: {
				addressLine1: '66 Grove Road',
				town: 'Fishponds',
				postcode: 'BS16 2BP'
			}
		},
		startedAt: new Date(2022, 4, 1, 11),
		appealDetailsFromAppellant: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			}
		},
		user: {
			connect: {
				id: 1
			}
		},
		lpaQuestionnaire: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'not visible from public land',
				doesInspectorNeedToEnterSite: false,
				doesInspectorNeedToEnterSiteDescription: 'inspector will want to enter site',
				doesInspectorNeedToAccessNeighboursLand: false,
				doesInspectorNeedToAccessNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateAreaBeingConsidered: 'abcd, ABC/DEF/GHI',
				emergingDevelopmentPlanOrNeighbourhoodPlan: false,
				emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
				inGreenBelt: false,
				extraConditions: false,
				affectsListedBuilding: false,
				inOrNearConservationArea: false,
			}
		},
		validationDecision: {
			create: {
				decision: 'complete',
				descriptionOfDevelopment: 'some description of development'
			}
		}
	}
];

const appealsWithDecisionDue = [
	{
		reference: 'APP/2021/56789/3266594',
		status: 'decision_due',
		localPlanningDepartment: 'some planning department',
		planningApplicationReference: 'ABCDEFG',
		startedAt: new Date(2022, 1, 5, 9),
		address: {
			create: {
				addressLine1: '8 The Chase',
				town: 'Findon',
				postcode: 'BN14 0TT'
			}
		},
		siteVisit: {
			create: {
				visitDate: new Date(2021, 11, 2),
				visitSlot: '1pm - 2pm',
				visitType: 'accompanied'
			}
		},
		user: {
			connect: {
				id: 1
			}
		},
		appellant: {
			create: {
				name: 'Maria Sharma',
				email: 'maria.sharma@gmail.com'
			}
		},
		lpaQuestionnaire: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'not visible from public land',
				doesInspectorNeedToEnterSite: false,
				doesInspectorNeedToEnterSiteDescription: 'inspector will want to enter site',
				doesInspectorNeedToAccessNeighboursLand: false,
				doesInspectorNeedToAccessNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateAreaBeingConsidered: 'abcd, ABC/DEF/GHI',
				emergingDevelopmentPlanOrNeighbourhoodPlan: false,
				emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
				inGreenBelt: false,
				extraConditions: false,
				affectsListedBuilding: false,
				inOrNearConservationArea: false,
			}
		},
		validationDecision: {
			create: {
				decision: 'complete',
				descriptionOfDevelopment: 'some description of development'
			}
		},
		appealDetailsFromAppellant: {
			create: {
				siteVisibleFromPublicLand: true,
				siteVisibleFromPublicLandDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			}
		}
	}
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
	...appealsSiteVisitNotYetBooked,
	...appealsWithBookedSiteVisit,
	...appealsWithDecisionDue
];

/**
 *
 */
async function main() {
	try {
		await prisma.user.create({ data: {} });
		const createdAppeals = [];
		for (const appealData of appealsData) {
			const appeal = prisma.appeal.create({ data: appealData });
			createdAppeals.push(appeal);
		}
		await Promise.all(createdAppeals);
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

main();

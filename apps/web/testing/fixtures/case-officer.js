import { createAddress } from '../factory/address.js';
import { createAppealStatus } from '../factory/appeal-status.js';
import { createAppeal } from '../factory/appeal.js';
import { createAppellant } from '../factory/appellant.js';
import { createDocument } from '../factory/document.js';
import { createLpaQuestionnaire } from '../factory/lpa-questionnaire.js';
import { createReviewQuestionnaire } from '../factory/review-questionnaire.js';
import { caseOfficer } from '../formatters/appeal.js';

const documents = [
	createDocument({ type: 'decision letter' }),
	createDocument({ type: 'supporting document' }),
	createDocument({ type: 'planning officers report' }),
	createDocument({ type: 'plans used to reach decision' }),
	createDocument({ type: 'statutory development plan policy' }),
	createDocument({ type: 'other relevant policy' }),
	createDocument({ type: 'conservation area guidance' }),
	createDocument({ type: 'appeal notification' }),
	createDocument({ type: 'application notification' }),
	createDocument({ type: 'application publicity' }),
	createDocument({ type: 'representation' })
];

const lpaQuestionnaire = createLpaQuestionnaire({
	affectsListedBuilding: true,
	listedBuildingDescription: 'Description of listed building',
	extraConditions: true,
	inGreenBelt: true,
	inOrNearConservationArea: true,
	siteVisibleFromPublicLand: false,
	siteVisibleFromPublicLandDescription: null,
	doesInspectorNeedToEnterSite: true,
	doesInspectorNeedToEnterSiteDescription: 'Inspector needs to enter site',
	doesInspectorNeedToAccessNeighboursLand: true,
	doesInspectorNeedToAccessNeighboursLandDescription: 'Inspector needs access to neighbour',
	healthAndSafetyIssues: true,
	healthAndSafetyIssuesDescription: 'List of health and safety issues',
	emergingDevelopmentPlanOrNeighbourhoodPlan: true,
	emergingDevelopmentPlanOrNeighbourhoodPlanDescription:
		'There is an emerging neighbourhood plan',
	appealsInImmediateAreaBeingConsidered: 'LPA/B0000/J/00/0000000',
	sentAt: new Date(2022, 0, 1),
	receivedAt: new Date(2022, 0, 14)
});

const appealWithReceivedQuestionnaire = createAppeal({
	id: 101,
	appealStatus: [createAppealStatus({ status: 'received_lpa_questionnaire' })],
	reference: 'LPA/B7676/J/07/8431690',
	planningApplicationReference: '00/01/1000',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2022, 0, 1),
	startedAt: new Date(2022, 0, 1),
	appellant: createAppellant({ name: 'Cliff Montgomery' }),
	address: createAddress({
		addressLine1: '36 Factory Street',
		addressLine2: 'Tyldesley',
		town: 'Manchester',
		postcode: 'M29 8GQ'
	}),
	lpaQuestionnaire,
	documents
});

const appealWithPendingQuestionnaire = createAppeal({
	id: 102,
	appealStatus: [createAppealStatus({ status: 'awaiting_lpa_questionnaire' })],
	reference: 'LPA/B0000/J/01/123456',
	planningApplicationReference: '00/01/1001',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2022, 0, 1),
	startedAt: new Date(2022, 0, 1),
	appellant: createAppellant({ name: 'Cliff Montgomery' }),
	address: createAddress({
		addressLine1: '19 Fairborough Way',
		addressLine2: 'Pembleton',
		town: 'Manchester',
		postcode: 'M16 0RA'
	})
});

const appealWithOverdueQuestionnaire = createAppeal({
	id: 103,
	appealStatus: [createAppealStatus({ status: 'overdue_lpa_questionnaire' })],
	reference: 'LPA/B0000/J/01/123456',
	planningApplicationReference: '00/01/1001',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2021, 10, 1),
	startedAt: new Date(2021, 11, 1),
	appellant: createAppellant({ name: 'Ingrid Camden' }),
	address: createAddress({
		addressLine1: 'Orion Gardens',
		addressLine2: 'Sloane South',
		town: 'London',
		postcode: 'SW1W 9HG'
	})
});

const appealWithIncompleteQuestionnaire = createAppeal({
	id: 104,
	appealStatus: [createAppealStatus({ status: 'incomplete_lpa_questionnaire' })],
	reference: 'LPA/B0000/J/01/123456',
	planningApplicationReference: '00/01/1001',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2022, 0, 1),
	startedAt: new Date(2022, 0, 1),
	appellant: createAppellant({ name: 'Ingrid Camden' }),
	address: createAddress({
		addressLine1: 'The Spitfire Building',
		addressLine2: '71 Collier Street',
		town: 'London',
		postcode: 'N1 9BE'
	}),
	lpaQuestionnaire,
	documents,
	reviewQuestionnaire: [
		createReviewQuestionnaire({
			applicationPlanningOfficersReportMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'A',
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrect: true,
			policiesStatutoryDevelopmentPlanPoliciesMissingOrIncorrectDescription: 'B',
			policiesOtherRelevantPoliciesMissingOrIncorrect: true,
			policiesOtherRelevantPoliciesMissingOrIncorrectDescription: 'C',
			policiesSupplementaryPlanningDocumentsMissingOrIncorrect: true,
			policiesSupplementaryPlanningDocumentsMissingOrIncorrectDescription: 'D',
			siteConservationAreaMapAndGuidanceMissingOrIncorrect: true,
			siteConservationAreaMapAndGuidanceMissingOrIncorrectDescription: 'E',
			siteListedBuildingDescriptionMissingOrIncorrect: true,
			siteListedBuildingDescriptionMissingOrIncorrectDescription: 'F',
			thirdPartyApplicationNotificationMissingOrIncorrectListOfAddresses: true,
			thirdPartyApplicationNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: true,
			thirdPartyApplicationNotificationMissingOrIncorrect: true,
			thirdPartyApplicationPublicityMissingOrIncorrect: true,
			thirdPartyRepresentationsMissingOrIncorrect: true,
			thirdPartyRepresentationsMissingOrIncorrectDescription: 'G',
			thirdPartyAppealNotificationMissingOrIncorrectListOfAddresses: true,
			thirdPartyAppealNotificationMissingOrIncorrectCopyOfLetterOrSiteNotice: true,
			thirdPartyAppealNotificationMissingOrIncorrect: true
		})
	]
});

const appealAvailableForFinalComments = createAppeal({
	appealTypeCode: 'FPA',
	id: 105,
	appealStatus: [createAppealStatus({ status: 'available_for_final_comments' })],
	reference: 'FPA/B0000/J/01/128399',
	planningApplicationReference: '99/01/1001',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2021, 10, 1),
	startedAt: new Date(2021, 11, 1),
	appellant: createAppellant({ name: 'Dirk Kirkby' }),
	address: createAddress({
		addressLine1: 'Orion Gardens',
		addressLine2: 'Sloane South',
		town: 'London',
		postcode: 'SW1W 9HG'
	})
});

const appealAvailableForStatements = createAppeal({
	appealTypeCode: 'FPA',
	id: 106,
	appealStatus: [createAppealStatus({ status: 'available_for_statements' })],
	reference: 'FPA/B0000/J/01/213455',
	planningApplicationReference: '99/01/1221',
	localPlanningDepartment: 'Barnsley Metropolitan Borough Council',
	createdAt: new Date(2021, 10, 1),
	startedAt: new Date(2021, 11, 1),
	appellant: createAppellant({ name: 'Ken Ibuki' }),
	address: createAddress({
		addressLine1: 'Orion Gardens',
		addressLine2: 'Sloane South',
		town: 'London',
		postcode: 'SW1W 9HG'
	})
});

export const appealSummaryForReceivedQuestionnaire = caseOfficer.formatAppealSummary(
	appealWithReceivedQuestionnaire
);
export const appealSummaryForPendingQuestionnaire = caseOfficer.formatAppealSummary(
	appealWithPendingQuestionnaire
);
export const appealSummaryForOverdueQuestionnaire = caseOfficer.formatAppealSummary(
	appealWithOverdueQuestionnaire
);
export const appealSummaryForIncompleteQuestionnaire = caseOfficer.formatAppealSummary(
	appealWithIncompleteQuestionnaire
);

export const appealSummaryForPendingFinalComments = caseOfficer.formatAppealSummary(
	appealAvailableForFinalComments
);

export const appealSummaryForPendingStatements = caseOfficer.formatAppealSummary(
	appealAvailableForStatements
);

export const appealDetailsForIncompleteQuestionnaire = caseOfficer.formatAppealDetails(
	appealWithIncompleteQuestionnaire
);

export const appealDetailsForReceivedQuestionnaire = caseOfficer.formatAppealDetails(
	appealWithReceivedQuestionnaire
);


export const appealDetailsForFinalComments = caseOfficer.formatAppealDetails(
	appealAvailableForFinalComments
);

export const appealDetailsForStatements = caseOfficer.formatAppealDetails(
	appealAvailableForStatements
);

import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
import formatAddressLowerCase from '../../../utils/address-formatter-lowercase.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = {
	...appealFactoryForTests({
		appealId: 1,
		statuses: [
			{
				status: 'site_visit_not_yet_booked',
				valid: true
			}
		],
		typeShorthand: 'HAS',
		inclusions: {
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		dates: { createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	}),
	lpaQuestionnaire: {
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
		inOrNearConservationArea: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	}
};
const appeal2 = {
	...appealFactoryForTests({
		appealId: 2,
		statuses: [
			{
				status: 'picked_up',
				subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
				valid: true
			},
			{
				status: 'available_for_statements',
				subStateMachineName: 'statementsAndFinalComments',
				createdAt: new Date(2022, 4, 1, 11),
				valid: true
			}
		],
		typeShorthand: 'FPA',
		inclusions: {
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		dates: { createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	}),
	lpaQuestionnaire: {
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
		inOrNearConservationArea: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	}
};

const appeal3 = {
	...appealFactoryForTests({
		appealId: 3,
		statuses: [
			{
				status: 'picked_up',
				subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
				valid: true
			},
			{
				status: 'available_for_final_comments',
				subStateMachineName: 'statementsAndFinalComments',
				createdAt: new Date(2022, 4, 1, 11),
				valid: true
			}
		],
		typeShorthand: 'FPA',
		inclusions: {
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		dates: { createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	}),
	lpaQuestionnaire: {
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
		inOrNearConservationArea: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	}
};

const documentsArray = [
	{
		Type: 'planning application form',
		Filename: 'planning-application.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'decision letter',
		Filename: 'decision-letter.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'appeal statement',
		Filename: 'appeal-statement.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'supporting document',
		Filename: 'other-document-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'planning officers report',
		Filename: 'planning-officers-report.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'plans used to reach decision',
		Filename: 'plans-used-to-reach-decision.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'statutory development plan policy',
		Filename: 'policy-and-supporting-text-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-1.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-2.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'other relevant policy',
		Filename: 'policy-and-supporting-text-3.pdf',
		URL: 'localhost:8080'
	},
	{
		Type: 'conservation area guidance',
		Filename: 'conservation-area-plan.pdf',
		URL: 'localhost:8080'
	}
];

jest.useFakeTimers({ now: 1_649_319_144_000 });

describe('Get appeal details', () => {
	test('returns appeal details for household appeal', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const response = await request.get('/appeals/inspector/1').set('userId', '1');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealId: 1,
			status: 'not yet booked',
			reference: appeal1.reference,
			provisionalSiteVisitType: 'unaccompanied',
			availableForSiteVisitBooking: true,
			appellantName: appeal1.appellant.name,
			email: appeal1.appellant.email,
			descriptionOfDevelopment: 'Some Description',
			appealReceivedDate: '12 December 2020',
			appealAge: 24,
			extraConditions: false,
			affectsListedBuilding: false,
			inGreenBelt: false,
			inOrNearConservationArea: false,
			emergingDevelopmentPlanOrNeighbourhoodPlan: false,
			emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
			localPlanningDepartment: appeal1.localPlanningDepartment,
			address: formatAddressLowerCase(appeal1.address),
			lpaAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'not visible from public land',
				inspectorNeedsToEnterSite: false,
				inspectorNeedsToEnterSiteDescription: 'inspector will want to enter site',
				inspectorNeedsAccessToNeighboursLand: false,
				inspectorNeedsAccessToNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateArea: 'abcd, ABC/DEF/GHI'
			},
			appellantAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			},
			Documents: documentsArray
		});
	});

	test('returns appeal details for full planning appeal which is still accepting statements', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal2);

		// WHEN
		const response = await request.get('/appeals/inspector/2').set('userId', '1');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealId: 2,
			status: 'not yet booked',
			reference: appeal2.reference,
			provisionalSiteVisitType: 'unaccompanied',
			availableForSiteVisitBooking: false,
			expectedSiteVisitBookingAvailableFrom: '19 June 2022',
			appellantName: appeal2.appellant.name,
			email: appeal2.appellant.email,
			descriptionOfDevelopment: 'Some Description',
			appealReceivedDate: '12 December 2020',
			appealAge: 24,
			extraConditions: false,
			affectsListedBuilding: false,
			inGreenBelt: false,
			inOrNearConservationArea: false,
			emergingDevelopmentPlanOrNeighbourhoodPlan: false,
			emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
			localPlanningDepartment: appeal2.localPlanningDepartment,
			address: formatAddressLowerCase(appeal2.address),
			lpaAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'not visible from public land',
				inspectorNeedsToEnterSite: false,
				inspectorNeedsToEnterSiteDescription: 'inspector will want to enter site',
				inspectorNeedsAccessToNeighboursLand: false,
				inspectorNeedsAccessToNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateArea: 'abcd, ABC/DEF/GHI'
			},
			appellantAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			},
			Documents: documentsArray
		});
	});

	test('returns appeal details for full planning appeal which is still accepting final comments', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal3);

		// WHEN
		const response = await request.get('/appeals/inspector/3').set('userId', '1');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealId: 3,
			status: 'not yet booked',
			reference: appeal3.reference,
			provisionalSiteVisitType: 'unaccompanied',
			availableForSiteVisitBooking: false,
			expectedSiteVisitBookingAvailableFrom: '15 May 2022',
			appellantName: appeal3.appellant.name,
			email: appeal3.appellant.email,
			descriptionOfDevelopment: 'Some Description',
			appealReceivedDate: '12 December 2020',
			appealAge: 24,
			extraConditions: false,
			affectsListedBuilding: false,
			inGreenBelt: false,
			inOrNearConservationArea: false,
			emergingDevelopmentPlanOrNeighbourhoodPlan: false,
			emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
			localPlanningDepartment: appeal3.localPlanningDepartment,
			address: formatAddressLowerCase(appeal3.address),
			lpaAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'not visible from public land',
				inspectorNeedsToEnterSite: false,
				inspectorNeedsToEnterSiteDescription: 'inspector will want to enter site',
				inspectorNeedsAccessToNeighboursLand: false,
				inspectorNeedsAccessToNeighboursLandDescription: 'should be able to see ok',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'not really',
				appealsInImmediateArea: 'abcd, ABC/DEF/GHI'
			},
			appellantAnswers: {
				canBeSeenFromPublic: true,
				canBeSeenFromPublicDescription: 'site visit description',
				appellantOwnsWholeSite: true,
				appellantOwnsWholeSiteDescription: 'i own the whole site',
				healthAndSafetyIssues: false,
				healthAndSafetyIssuesDescription: 'everything is super safe'
			},
			Documents: documentsArray
		});
	});
});

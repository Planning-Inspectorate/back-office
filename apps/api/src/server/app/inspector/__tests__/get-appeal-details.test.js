import appealRepository from '../../repositories/appeal.repository.js';
import sinon from 'sinon';
import supertest from 'supertest';
import test from 'ava';
import { app } from '../../../app.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';
import formatAddressLowerCase from '../../utils/address-formatter-lowercase.js';

const request = supertest(app);

const appeal_1 = {
	...appealFactoryForTests(
		1,
		[{
			status: 'site_visit_not_yet_booked',
			valid: true
		}],
		'HAS',
		{
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		{ createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	), lpaQuestionnaire: {
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	},
};
const appeal_2 = {
	...appealFactoryForTests(
		2,
		[{
			status: 'picked_up',
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			valid: true
		}, {
			status: 'available_for_statements',
			subStateMachineName: 'statementsAndFinalComments',
			createdAt: new Date(2022, 4, 1, 11),
			valid: true
		}],
		'FPA',
		{
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		{ createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	), lpaQuestionnaire: {
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	},
};

const appeal_3 = {
	...appealFactoryForTests(
		3,
		[{
			status: 'picked_up',
			subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
			valid: true
		}, {
			status: 'available_for_final_comments',
			subStateMachineName: 'statementsAndFinalComments',
			createdAt: new Date(2022, 4, 1, 11),
			valid: true
		}],
		'FPA',
		{
			connectToUser: true,
			completeValidationDecision: true,
			incompleteValidationDecision: true,
			lpaQuestionnaire: true
		},
		{ createdAt: new Date(2020, 11, 12, 9), startedAt: new Date(2022, 4, 1, 11) }
	), lpaQuestionnaire: {
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
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true,
		siteVisibleFromPublicLandDescription: 'site visit description',
		appellantOwnsWholeSite: true,
		appellantOwnsWholeSiteDescription: 'i own the whole site',
		healthAndSafetyIssues: false,
		healthAndSafetyIssuesDescription: 'everything is super safe'
	},
};

const inclusions = {
	appellant: true,
	validationDecision: true,
	address: true,
	latestLPAReviewQuestionnaire: true,
	appealDetailsFromAppellant: true,
	lpaQuestionnaire: true
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

const getAppealByIdStub = sinon.stub();
sinon.stub(appealRepository, 'getById').callsFake(getAppealByIdStub);
getAppealByIdStub.withArgs(1, inclusions).returns(appeal_1);
getAppealByIdStub.withArgs(1).returns(appeal_1);
getAppealByIdStub.withArgs(2, inclusions).returns(appeal_2);
getAppealByIdStub.withArgs(2).returns(appeal_2);
getAppealByIdStub.withArgs(3, inclusions).returns(appeal_3);
getAppealByIdStub.withArgs(3).returns(appeal_3);

test.before('Sets up timer', () => {
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('returns appeal details for household appeal', async (t) => {
	const response = await request.get('/inspector/1').set('userId', '1');
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		appealId: 1,
		status: 'not yet booked',
		reference: appeal_1.reference,
		provisionalSiteVisitType: 'unaccompanied',
		availableForSiteVisitBooking: true,
		appellantName: appeal_1.appellant.name,
		email: appeal_1.appellant.email,
		descriptionOfDevelopment: 'Some Description',
		appealReceivedDate: '12 December 2020',
		appealAge: 24,
		extraConditions: false,
		affectsListedBuilding: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		emergingDevelopmentPlanOrNeighbourhoodPlan: false,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
		localPlanningDepartment: appeal_1.localPlanningDepartment,
		address: formatAddressLowerCase(appeal_1.address),
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

test('returns appeal details for full planning appeal which is still accepting statements', async (t) => {
	const response = await request.get('/inspector/2').set('userId', '1');
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		appealId: 2,
		status: 'not yet booked',
		reference: appeal_2.reference,
		provisionalSiteVisitType: 'unaccompanied',
		availableForSiteVisitBooking: false,
		expectedSiteVisitBookingAvailableFrom: '19 June 2022',
		appellantName: appeal_2.appellant.name,
		email: appeal_2.appellant.email,
		descriptionOfDevelopment: 'Some Description',
		appealReceivedDate: '12 December 2020',
		appealAge: 24,
		extraConditions: false,
		affectsListedBuilding: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		emergingDevelopmentPlanOrNeighbourhoodPlan: false,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
		localPlanningDepartment: appeal_2.localPlanningDepartment,
		address: formatAddressLowerCase(appeal_2.address),
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

test('returns appeal details for full planning appeal which is still accepting final comments', async (t) => {
	const response = await request.get('/inspector/3').set('userId', '1');
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		appealId: 3,
		status: 'not yet booked',
		reference: appeal_3.reference,
		provisionalSiteVisitType: 'unaccompanied',
		availableForSiteVisitBooking: false,
		expectedSiteVisitBookingAvailableFrom: '15 May 2022',
		appellantName: appeal_3.appellant.name,
		email: appeal_3.appellant.email,
		descriptionOfDevelopment: 'Some Description',
		appealReceivedDate: '12 December 2020',
		appealAge: 24,
		extraConditions: false,
		affectsListedBuilding: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		emergingDevelopmentPlanOrNeighbourhoodPlan: false,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
		localPlanningDepartment: appeal_3.localPlanningDepartment,
		address: formatAddressLowerCase(appeal_3.address),
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

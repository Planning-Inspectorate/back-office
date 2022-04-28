import appealRepository from '../../repositories/appeal.repository.js';
import sinon from 'sinon';
import supertest from 'supertest';
import test from 'ava';
import { app } from '../../../app.js';
import { appealFactoryForTests } from '../../utils/appeal-factory-for-tests.js';
import formatAddressLowerCase from '../../utils/address-formatter-lowercase.js';

const request = supertest(app);

const appeal = {
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

sinon.stub(appealRepository, 'getById').returns(appeal);

test('returns appeal details', async (t) => {
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
	const response = await request.get('/inspector/1').set('userId', '1');
	t.is(response.status, 200);
	t.deepEqual(response.body, {
		appealId: 1,
		status: 'not yet booked',
		reference: appeal.reference,
		provisionalSiteVisitType: 'unaccompanied',
		availableForSiteVisitBooking: true,
		appellantName: appeal.appellant.name,
		email: appeal.appellant.email,
		descriptionOfDevelopment: 'Some Description',
		appealReceivedDate: '12 December 2020',
		appealAge: 24,
		extraConditions: false,
		affectsListedBuilding: false,
		inGreenBelt: false,
		inOrNearConservationArea: false,
		emergingDevelopmentPlanOrNeighbourhoodPlan: false,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'plans',
		localPlanningDepartment: appeal.localPlanningDepartment,
		address: formatAddressLowerCase(appeal.address),
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
		Documents: [
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
		]
	});
});

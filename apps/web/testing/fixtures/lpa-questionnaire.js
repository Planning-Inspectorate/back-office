import { createLpaQuestionnaire } from '../factory/lpa-questionnaire.js';

export const lpaQuestionnaire = createLpaQuestionnaire({
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
	emergingDevelopmentPlanOrNeighbourhoodPlanDescription: 'There is an emerging neighbourhood plan',
	appealsInImmediateAreaBeingConsidered: 'LPA/B0000/J/00/0000000',
	sentAt: new Date(2022, 0, 1),
	receivedAt: new Date(2022, 0, 14)
});

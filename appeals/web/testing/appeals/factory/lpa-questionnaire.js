// import faker from '@faker-js/faker';
// import { fake } from '@pins/platform';
// import sub from 'date-fns/sub/index.js';
// import { random } from 'lodash-es';

// /** @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaire} LPAQuestionnaireData */

// /**
//  * @param {Partial<LPAQuestionnaireData>} [options={}]
//  * @returns {LPAQuestionnaireData}
//  */
// export function createLpaQuestionnaire({
// 	id = fake.createUniqueId(),
// 	appealId = fake.createUniqueId(),
// 	affectsListedBuilding = fake.randomBoolean(),
// 	listedBuildingDescription = affectsListedBuilding ? faker.lorem.paragraph() : null,
// 	extraConditions = fake.randomBoolean(),
// 	inGreenBelt = fake.randomBoolean(),
// 	inOrNearConservationArea = fake.randomBoolean(),
// 	siteVisibleFromPublicLand = fake.randomBoolean(),
// 	siteVisibleFromPublicLandDescription = siteVisibleFromPublicLand
// 		? faker.lorem.sentences(2)
// 		: null,
// 	doesInspectorNeedToEnterSite = fake.randomBoolean(),
// 	doesInspectorNeedToEnterSiteDescription = doesInspectorNeedToEnterSite
// 		? faker.lorem.sentences(2)
// 		: null,
// 	doesInspectorNeedToAccessNeighboursLand = fake.randomBoolean(),
// 	doesInspectorNeedToAccessNeighboursLandDescription = doesInspectorNeedToAccessNeighboursLand
// 		? faker.lorem.sentences(2)
// 		: null,
// 	healthAndSafetyIssues = fake.randomBoolean(),
// 	healthAndSafetyIssuesDescription = healthAndSafetyIssues ? faker.lorem.sentences(2) : null,
// 	emergingDevelopmentPlanOrNeighbourhoodPlan = fake.randomBoolean(),
// 	emergingDevelopmentPlanOrNeighbourhoodPlanDescription = emergingDevelopmentPlanOrNeighbourhoodPlan
// 		? faker.lorem.sentences(2)
// 		: null,
// 	appealsInImmediateAreaBeingConsidered = fake.randomBoolean() ? faker.lorem.sentences(2) : null,
// 	sentAt = sub(new Date(), { weeks: random(3, 6) }),
// 	receivedAt = sub(new Date(), { days: random(1, 20) })
// } = {}) {
// 	return {
// 		id,
// 		appealId,
// 		affectsListedBuilding,
// 		listedBuildingDescription,
// 		extraConditions,
// 		inGreenBelt,
// 		inOrNearConservationArea,
// 		siteVisibleFromPublicLand,
// 		siteVisibleFromPublicLandDescription,
// 		doesInspectorNeedToEnterSite,
// 		doesInspectorNeedToEnterSiteDescription,
// 		doesInspectorNeedToAccessNeighboursLand,
// 		doesInspectorNeedToAccessNeighboursLandDescription,
// 		healthAndSafetyIssues,
// 		healthAndSafetyIssuesDescription,
// 		emergingDevelopmentPlanOrNeighbourhoodPlan,
// 		emergingDevelopmentPlanOrNeighbourhoodPlanDescription,
// 		appealsInImmediateAreaBeingConsidered,
// 		sentAt,
// 		receivedAt
// 	};
// }

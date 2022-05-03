import { createUniqueId, randomBoolean } from '@pins/platform/testing';
import faker from '@faker-js/faker';
import sub from 'date-fns/sub/index.js';
import { random } from 'lodash-es';

/** @typedef {import('@pins/api').Schema.LPAQuestionnaire} LPAQuestionnaireData */

/**
 * @param {Partial<LPAQuestionnaireData>} [options={}]
 * @returns {LPAQuestionnaireData}
 */
export function createLpaQuestionnaire({
	id = createUniqueId(),
	appealId = createUniqueId(),
	affectsListedBuilding = randomBoolean(),
	listedBuildingDescription = affectsListedBuilding ? faker.lorem.paragraph() : null,
	extraConditions = randomBoolean(),
	inGreenBelt = randomBoolean(),
	inOrNearConservationArea = randomBoolean(),
	siteVisibleFromPublicLand = randomBoolean(),
	siteVisibleFromPublicLandDescription = siteVisibleFromPublicLand ? faker.lorem.sentences(2) : null,
	doesInspectorNeedToEnterSite = randomBoolean(),
	doesInspectorNeedToEnterSiteDescription = doesInspectorNeedToEnterSite ? faker.lorem.sentences(2) : null,
	doesInspectorNeedToAccessNeighboursLand = randomBoolean(),
	doesInspectorNeedToAccessNeighboursLandDescription = doesInspectorNeedToAccessNeighboursLand ? faker.lorem.sentences(2) : null,
	healthAndSafetyIssues = randomBoolean(),
	healthAndSafetyIssuesDescription = healthAndSafetyIssues ? faker.lorem.sentences(2) : null,
	emergingDevelopmentPlanOrNeighbourhoodPlan = randomBoolean(),
	emergingDevelopmentPlanOrNeighbourhoodPlanDescription = emergingDevelopmentPlanOrNeighbourhoodPlan ? faker.lorem.sentences(2) : null,
	appealsInImmediateAreaBeingConsidered = randomBoolean() ? faker.lorem.sentences(2) : null,
	sentAt = sub(new Date(), { weeks: random(3, 6) }),
	receivedAt = sub(new Date(), { days: random(1, 20) })
} = {}) {
	return {
		id,
		appealId,
		affectsListedBuilding,
		listedBuildingDescription,
		extraConditions,
		inGreenBelt,
		inOrNearConservationArea,
		siteVisibleFromPublicLand,
		siteVisibleFromPublicLandDescription,
		doesInspectorNeedToEnterSite,
		doesInspectorNeedToEnterSiteDescription,
		doesInspectorNeedToAccessNeighboursLand,
		doesInspectorNeedToAccessNeighboursLandDescription,
		healthAndSafetyIssues,
		healthAndSafetyIssuesDescription,
		emergingDevelopmentPlanOrNeighbourhoodPlan,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription,
		appealsInImmediateAreaBeingConsidered,
		sentAt,
		receivedAt
	};
}

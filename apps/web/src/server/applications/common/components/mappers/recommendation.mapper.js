import { RECOMMENDATIONS } from '../../constants.js';

export const RECOMMENDATIONS_VIEW = {
	[RECOMMENDATIONS.RECOMMEND_CONSENT]: {
		displayNameEn: 'Recommend consent'
	},
	[RECOMMENDATIONS.RECOMMEND_PARTIAL_CONSENT]: {
		displayNameEn: 'Recommend partial consent'
	},
	[RECOMMENDATIONS.RECOMMEND_REFUSAL]: {
		displayNameEn: 'Recommend refusal'
	}
};

/**
 * View model to map recommendation choices to radio button options.
 *
 * @returns {Array<{name: string, displayNameEn: string}>}
 */
export function getRecommendationsViewModel() {
	return Object.entries(RECOMMENDATIONS_VIEW).map(([key, value]) => ({
		name: key,
		displayNameEn: value.displayNameEn
	}));
}

/**
 *
 * @param {string} recommendation
 * @returns {string}
 */
export const getRecommendationDisplayName = (recommendation) => {
	if (!recommendation) {
		return '';
	}
	const recommendationEntry = RECOMMENDATIONS_VIEW[recommendation];
	return recommendationEntry.displayNameEn;
};

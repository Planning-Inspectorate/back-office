import { createUniqueId } from '@pins/platform/testing';

/** @typedef {import('@pins/api').Schema.AppealDetailsFromAppellant} AppealDetailsFromAppellant */

/**
 * @param {Partial<AppealDetailsFromAppellant>} [options={}]
 * @returns {AppealDetailsFromAppellant}
 */
export function createAppealDetailsFromAppellant({
	appealId = createUniqueId(),
	id = createUniqueId(),
	siteVisibleFromPublicLand = true,
  appellantOwnsWholeSite = true,
  appellantOwnsWholeSiteDescription = 'Purchased at auction',
  healthAndSafetyIssues = false,
  healthAndSafetyIssuesDescription = null,
  siteVisibleFromPublicLandDescription = 'Site is partially visible from road'
} = {}) {
	return {
		id,
		appealId,
    siteVisibleFromPublicLand,
    appellantOwnsWholeSite,
    appellantOwnsWholeSiteDescription,
    healthAndSafetyIssues,
    healthAndSafetyIssuesDescription,
    siteVisibleFromPublicLandDescription
	};
}

import { notificationBannerDefinitions } from './mappers/notification-banners.mapper.js';

/**
 *
 * @param {import('../app/auth/auth-session.service').SessionWithAuth & Object<string, any>} session
 * @param {keyof import('./mappers/notification-banners.mapper.js').notificationBannerDefinitions} bannerDefinitionKey
 * @param {number} appealId
 * @param {string?} html
 */
export const addNotificationBannerToSession = (
	session,
	bannerDefinitionKey,
	appealId,
	html = ''
) => {
	if (!(bannerDefinitionKey in notificationBannerDefinitions)) {
		return false;
	}

	if (!('notificationBanners' in session)) {
		session.notificationBanners = {};
	}

	session.notificationBanners[bannerDefinitionKey] = {
		appealId,
		html
	};

	return true;
};

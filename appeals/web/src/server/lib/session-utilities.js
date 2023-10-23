import { notificationBannerDefinitions } from './mappers/notification-banners.mapper.js';

/**
 *
 * @param {import('../app/auth/auth-session.service').SessionWithAuth & Object<string, any>} session
 * @param {keyof import('./mappers/notification-banners.mapper.js').notificationBannerDefinitions} bannerDefinitionKey
 * @param {number} appealId
 */
export const addNotificationBannerToSession = (session, bannerDefinitionKey, appealId) => {
	if (!(bannerDefinitionKey in notificationBannerDefinitions)) {
		return false;
	}

	if (!('notificationBanners' in session)) {
		session.notificationBanners = {};
	}

	session.notificationBanners[bannerDefinitionKey] = {
		appealId
	};

	return true;
};

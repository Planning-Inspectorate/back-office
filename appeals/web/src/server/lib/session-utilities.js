import { notificationBannerDefinitions } from './mappers/notification-banners.mapper.js';

/**
 *
 * @param {import('../app/auth/auth-session.service').SessionWithAuth & Object<string, any>} session
 * @param {keyof import('./mappers/notification-banners.mapper.js').notificationBannerDefinitions} bannerDefinitionKey
 * @param {number|string} appealId
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
		appealId: typeof appealId === 'string' ? parseInt(appealId) : appealId,
		html
	};

	return true;
};

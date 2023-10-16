/**
 * @typedef {import('#appeals/appeal.constants.js').ServicePageName} ServicePageName
 */

/**
 * @typedef {Object} NotificationBannerDefinition
 * @property {ServicePageName[]} pages
 * @property {'success'} [type] default is 'important'
 * @property {string} [text]
 * @property {string} [html]
 * @property {boolean} [persist] default is false
 */

/**
 * @type {Object<string, NotificationBannerDefinition>}
 */
export const notificationBannerDefinitions = {
	siteVisitTypeSelected: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Site visit type has been selected'
	},
	allocationDetailsUpdated: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Allocation details updated'
	},
	caseOfficerAdded: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Case officer has been assigned'
	},
	inspectorAdded: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Inspector has been assigned'
	},
	caseOfficerRemoved: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Case officer has been removed'
	},
	inspectorRemoved: {
		pages: ['appealDetails'],
		type: 'success',
		text: 'Inspector has been removed'
	},
	documentAdded: {
		pages: ['appellantCase', 'lpaQuestionnaire'],
		type: 'success',
		text: 'Document added'
	},
	appellantCaseNotValid: {
		pages: ['appellantCase'],
		persist: true
	},
	lpaQuestionnaireNotValid: {
		pages: ['lpaQuestionnaire'],
		persist: true
	}
};

/**
 * @typedef NotificationBannerPageComponent
 * @property {string} type
 * @property {NotificationBannerProperties} bannerProperties
 */

/**
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {ServicePageName} servicePage
 * @returns {NotificationBannerPageComponent[]}
 */
export function buildNotificationBanners(session, servicePage) {
	/**
	 * @type {NotificationBannerPageComponent[]}
	 */
	const notificationBanners = [];

	Object.keys(session).forEach((key) => {
		if (Object.keys(notificationBannerDefinitions).indexOf(key) !== -1) {
			const bannerDefinition = notificationBannerDefinitions[key];

			if (!bannerDefinition.pages.includes(servicePage)) {
				return;
			}

			let titleText = '';

			switch (bannerDefinition.type) {
				case 'success':
					titleText = 'Success';
					break;
				default:
					titleText = 'Important';
					break;
			}

			const bannerType = session[key]?.type || bannerDefinition.type;
			const bannerText = session[key]?.text || bannerDefinition.text;
			const bannerHtml = session[key]?.html || bannerDefinition.html;

			notificationBanners.push({
				type: 'notification-banner',
				bannerProperties: {
					titleText: session[key]?.titleText || titleText,
					titleHeadingLevel: 3,
					...(bannerType && {
						type: bannerType
					}),
					...(bannerText && {
						text: bannerText
					}),
					...(bannerHtml && {
						html: bannerHtml
					})
				}
			});

			if (!bannerDefinition.persist) {
				delete session[key];
			}
		}
	});

	return notificationBanners;
}

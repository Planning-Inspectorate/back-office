/**
 * @typedef {import('#appeals/appeal.constants.js').ServicePageName} ServicePageName
 */

/**
 * @typedef {Object} NotificationBannerDefinition
 * @property {ServicePageName[]} pages
 * @property {'success'} [type] default is 'important'
 * @property {string} [text]
 * @property {string} [html]
 * @property {PageComponent[]} [pageComponents]
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
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @param {ServicePageName} servicePage
 * @param {number} appealId
 * @returns {PageComponent[]}
 */
export function buildNotificationBanners(session, servicePage, appealId) {
	if (!('notificationBanners' in session)) {
		return [];
	}

	/**
	 * @type {PageComponent[]}
	 */
	const notificationBanners = [];

	Object.keys(session.notificationBanners).forEach((key) => {
		if (Object.keys(notificationBannerDefinitions).indexOf(key) !== -1) {
			const bannerDefinition = notificationBannerDefinitions[key];
			const bannerData = session.notificationBanners[key];

			if (!bannerDefinition.pages.includes(servicePage) || bannerData.appealId !== appealId) {
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

			const bannerType = bannerData?.type || bannerDefinition.type;
			const bannerText = bannerData?.text || bannerDefinition.text;
			const bannerHtml = bannerData?.html || bannerDefinition.html;
			const bannerPageComponents = bannerData?.pageComponents || bannerDefinition.pageComponents;

			notificationBanners.push({
				type: 'notification-banner',
				parameters: {
					titleText: bannerData?.titleText || titleText,
					titleHeadingLevel: 3,
					...(bannerType && {
						type: bannerType
					}),
					...(bannerText && {
						text: bannerText
					}),
					...(bannerHtml && {
						html: bannerHtml
					}),
					...(bannerPageComponents && {
						html: bannerHtml || '',
						pageComponents: bannerPageComponents
					})
				}
			});

			if (!bannerDefinition.persist) {
				delete session.notificationBanners[key];
			}
		}
	});

	return notificationBanners;
}

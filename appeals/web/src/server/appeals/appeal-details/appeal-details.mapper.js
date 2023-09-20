import config from '#environment/config.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { notificationBanners as notificationBannerConstants } from '#appeals/appeal.constants.js';

export const backLink = {
	text: 'Back to National list',
	link: '/appeals-service/appeals-list'
};
export const pageHeading = 'Case details';

/**
 * @param {{appeal: any}} data
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 */
export async function appealDetailsPage(data, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(data, currentRoute, session);
	const statusTag = { type: 'status-tag', ...mappedData.appeal.appealStatus.display.statusTag };

	const caseSummary = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		classes: 'govuk-summary-list--no-border',
		rows: [
			removeActions(mappedData.appeal.siteAddress.display.summaryListItem),
			removeActions(mappedData.appeal.localPlanningAuthority.display.summaryListItem)
		]
	};
	const caseOverview = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		rows: [
			mappedData.appeal.appealType.display.summaryListItem,
			mappedData.appeal?.caseProcedure?.display.summaryListItem,
			mappedData.appeal?.appellantName?.display.summaryListItem,
			mappedData.appeal?.agentName?.display.summaryListItem,
			mappedData.appeal?.linkedAppeals?.display.summaryListItem,
			mappedData.appeal?.otherAppeals?.display.summaryListItem,
			mappedData.appeal?.allocationDetails?.display.summaryListItem,
			removeActions(mappedData.appeal?.lpaReference?.display.summaryListItem),
			mappedData.appeal?.decision?.display.summaryListItem
		]
	};

	// Extracting display from each affected site address
	let neighbouringSitesSummaryLists = [];
	if (data.appeal.neighbouringSite.contacts && data.appeal.neighbouringSite.contacts.length > 0) {
		for (const site of mappedData.appeal.neighbouringSite) {
			neighbouringSitesSummaryLists.push(site.display.summaryListItem);
		}
	}

	const siteDetails = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		rows: [
			mappedData.appeal.lpaInspectorAccess.display.summaryListItem,
			mappedData.appeal.appellantInspectorAccess.display.summaryListItem,
			mappedData.appeal.neighbouringSiteIsAffected.display.summaryListItem,
			...neighbouringSitesSummaryLists,
			mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
			mappedData.appeal.appellantHealthAndSafety.display.summaryListItem,
			mappedData.appeal.visitType.display.summaryListItem
		]
	};

	let caseTimetable = {};

	if (data.appeal.startedAt) {
		caseTimetable.type = 'summary-list';
		caseTimetable.rows = [
			mappedData.appeal.startedAt.display.summaryListItem,
			mappedData.appeal.lpaQuestionnaireDueDate.display.summaryListItem,
			mappedData.appeal.siteVisitDate.display.summaryListItem,
			mappedData.appeal.issueDeterminationDate?.display.summaryListItem,
			mappedData.appeal.completeDate?.display.summaryListItem
		];
	} else {
		caseTimetable.type = 'inset-text';
		caseTimetable.html = `<p class="govuk-body">Case not started</p><a href="/appeals-service/appeal-details/${data.appeal.appealId}/appellant-case" class="govuk-link">Review appeal</a>`;
	}

	const caseDocumentation = {
		type: 'table',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		head: [{ text: 'Documentation' }, { text: 'Status' }, { text: 'Due date' }, { text: 'Action' }],
		rows: [
			mappedData.appeal.appellantCase.display.tableItem,
			mappedData.appeal.lpaQuestionnaire.display.tableItem
		],
		firstCellIsHeader: true
	};

	const caseTeam = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes(
			config.referenceData.appeals.caseOfficerGroupId
		),
		rows: [
			mappedData.appeal.caseOfficer.display.summaryListItem,
			mappedData.appeal.inspector.display.summaryListItem
		]
	};

	const appealDetailsAccordion = {
		id: 'accordion-default' + data.appeal.appealId,
		type: 'accordion',
		items: [
			{
				heading: { text: 'Case Overview' },
				type: caseOverview.type,
				content: { html: caseOverview }
			},
			{
				heading: { text: 'Site Details' },
				type: siteDetails.type,
				content: { html: siteDetails }
			},
			{
				heading: { text: 'Case Timetable' },
				type: caseTimetable.type,
				content: { html: caseTimetable }
			},
			{
				heading: { text: 'Case documentation' },
				type: caseDocumentation.type,
				content: { html: caseDocumentation }
			},
			{
				heading: { text: 'Case Team' },
				type: caseTeam.type,
				content: { html: caseTeam }
			}
		]
	};

	let components = [
		caseSummary,
		caseOverview,
		siteDetails,
		caseTimetable,
		caseDocumentation,
		caseTeam
	];

	components.forEach((item) => {
		if ('noActions' in item && item.noActions && 'rows' in item) {
			item.rows.forEach((row) => removeActions(row));
		}
	});

	const notificationBanners = buildNotificationBanners(session);

	return [...notificationBanners, statusTag, caseSummary, appealDetailsAccordion];
}

/**
 * @typedef NotificationBannerPageComponent
 * @property {string} type
 * @property {NotificationBannerProperties} bannerProperties
 */

/**
 *
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 * @returns {NotificationBannerPageComponent[]}
 */
function buildNotificationBanners(session) {
	/**
	 * @type {NotificationBannerPageComponent[]}
	 */
	const notificationBanners = [];

	Object.keys(session).forEach((key) => {
		if (Object.keys(notificationBannerConstants).indexOf(key) !== -1) {
			const bannerConstant = notificationBannerConstants[key];
			let titleText = '';

			switch (bannerConstant.type) {
				case 'success':
					titleText = 'Success';
					break;
				default:
					break;
			}

			notificationBanners.push({
				type: 'notification-banner',
				bannerProperties: {
					titleText,
					titleHeadingLevel: 3,
					type: bannerConstant.type,
					text: bannerConstant.text
				}
			});

			delete session[key];
		}
	});

	return notificationBanners;
}

/**
 * @param {object | undefined} row
 */
function removeActions(row) {
	if (row) {
		Reflect.deleteProperty(row, 'actions');
		return row;
	}
	return undefined;
}

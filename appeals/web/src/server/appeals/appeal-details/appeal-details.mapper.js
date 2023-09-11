import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';

export const backLink = {
	text: 'Back to National list',
	link: '/appeals-service/appeals-list'
};
export const pageHeading = 'Case details';

/**
 * @param {{appeal: any;}} data
 * @param {string} currentRoute
 * @param {import("express-session").Session & Partial<import("express-session").SessionData>} session
 */
export function appealsDetailPage(data, currentRoute, session) {
	const mappedData = initialiseAndMapAppealData(data, currentRoute);

	/** @type {{type: string, bannerProperties: any[]}} */
	let notificationBanners = {
		type: 'notification-banner',
		bannerProperties: []
	};

	if (session.siteVisitTypeSelected) {
		notificationBanners.bannerProperties.push({
			titleText: 'Success',
			titleHeadingLevel: 3,
			type: 'success',
			text: 'Site visit type has been selected'
		});

		delete session.siteVisitTypeSelected;
	}

	let statusTag = { type: 'status-tag', ...mappedData.appeal.appealStatus.display.statusTag };

	let caseSummary = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes('appeals_case_officer'),
		classes: 'govuk-summary-list--no-border',
		rows: [
			removeActions(mappedData.appeal.siteAddress.display.summaryListItem),
			removeActions(mappedData.appeal.localPlanningAuthority.display.summaryListItem)
		]
	};
	let caseOverview = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes('appeals_case_officer'),
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

	let siteDetails = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes('appeals_case_officer'),
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
			data.appeal.startedAt
				? mappedData.appeal.lpaQuestionnaireDueDate.display.summaryListItem
				: undefined,
			data.appeal.lpaQuestionnaireDueDate
				? mappedData.appeal.statementReviewDueDate.display.summaryListItem
				: undefined,
			data.appeal.statementReviewDate
				? mappedData.appeal.finalCommentReviewDueDate.display.summaryListItem
				: undefined,
			data.appeal.finalCommentReviewDate
				? mappedData.appeal.siteVisitDate.display.summaryListItem
				: undefined
		];
	} else {
		caseTimetable.type = 'inset-text';
		caseTimetable.html = `<p class="govuk-body">Case not started</p><a href="/appeals-service/appeal-details/${data.appeal.appealId}/appellant-case" class="govuk-link">Review appeal</a>`;
	}

	let caseDocumentation = {
		type: 'table',
		noActions: !session.account.idTokenClaims.groups.includes('appeals_case_officer'),
		head: [{ text: 'Documentation' }, { text: 'Status' }, { text: 'Due date' }, { text: 'Action' }],
		rows: [
			mappedData.appeal.appellantCase.display.tableItem,
			mappedData.appeal.lpaQuestionnaire.display.tableItem
		],
		firstCellIsHeader: true
	};

	let caseTeam = {
		type: 'summary-list',
		noActions: !session.account.idTokenClaims.groups.includes('appeals_case_officer'),
		rows: [
			mappedData.appeal.caseOfficer.display.summaryListItem,
			mappedData.appeal.inspector.display.summaryListItem
		]
	};

	let appealDetailsAccordion = {
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
			item.rows.forEach((row) => {
				if (row) {
					Reflect.deleteProperty(row, 'actions');
					return row;
				}
				return;
			});
		}
	});
	let pageItems = [notificationBanners, statusTag, caseSummary, appealDetailsAccordion];
	return pageItems;
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

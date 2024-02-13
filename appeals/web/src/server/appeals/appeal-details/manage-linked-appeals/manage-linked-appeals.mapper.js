import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import { appealShortReference, linkedAppealStatus } from '#lib/appeals-formatter.js';
/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../../appeals.types.js').SelectItemParameter} SelectItemParameter
 */

/**
 *
 * @param {Appeal} appealData
 * @param {string} childShortAppealReference
 * @param {string} appealId
 * @param {string} parentId
 * @returns {Promise<PageContent>}
 */
export async function linkedAppealsPage(appealData, childShortAppealReference, appealId, parentId) {
	const isChildAppeal = parentId !== '';
	const isHorizonLeadAppeal =
		appealData.appealType === 'Horizon' &&
		!parentId &&
		appealData.linkedAppeals.every((link) => link.isParentAppeal);

	const shortAppealReference =
		childShortAppealReference || appealShortReference(appealData.appealReference);

	/** @type {PageComponent[]} **/
	let pageComponents = [];

	/** @type {PageComponent} */
	const appealStatusTagComponent = {
		type: 'status-tag',
		wrapperHtml: {
			opening: '<div class="govuk-!-margin-bottom-2">',
			closing: '</div>'
		},
		parameters: {
			status: linkedAppealStatus(childShortAppealReference)
		}
	};
	pageComponents.push(appealStatusTagComponent);

	if (isChildAppeal && !isHorizonLeadAppeal) {
		const childAppealReference =
			appealData.linkedAppeals.find((la) => la.appealId === Number(appealId))?.appealReference ||
			'';

		/** @type {PageComponent} */
		let leadAppealTable = {
			wrapperHtml: {
				opening: `<h2 class="govuk-!-margin-top-6">Lead appeal of ${shortAppealReference}</h2>`,
				closing: ''
			},
			type: 'table',
			parameters: {
				head: [{ text: 'Appeal ID' }, { text: 'Appeal type' }, { text: 'Action' }],
				firstCellIsHeader: false,
				rows: [
					[
						{
							html: `<a class="govuk-link" href="/appeals-service/appeal-details/${
								appealData.appealId
							}" aria-label="Appeal ${numberToAccessibleDigitLabel(
								appealShortReference(appealData.appealReference) || ''
							)}">${appealShortReference(appealData.appealReference)}</a>`
						},
						{
							text: appealData.appealType
						},
						{
							html: `<a class="govuk-link" href="/appeals-service/appeal-details/${
								appealData.appealId
							}/manage-linked-appeals/unlink-appeal/${parentId}/${encodeURIComponent(
								appealData.appealReference
							)}/${encodeURIComponent(childAppealReference)}">Unlink</a>`
						}
					]
				]
			}
		};
		pageComponents.push(leadAppealTable);
	}

	const childAppealsRows = appealData.linkedAppeals
		.filter(
			(linkedAppeal) => !linkedAppeal.isParentAppeal && linkedAppeal.appealId !== Number(appealId)
		)
		.map((linkedAppeal) => {
			return [
				{
					html: `<a class="govuk-link" href="/appeals-service/appeal-details/${
						linkedAppeal.appealId
					}" aria-label="Appeal ${numberToAccessibleDigitLabel(
						appealShortReference(linkedAppeal.appealReference) || ''
					)}">${appealShortReference(linkedAppeal.appealReference)}</a>`
				},
				{
					text: linkedAppeal.appealType
				},
				{
					html: `<a class="govuk-link" href="/appeals-service/appeal-details/${
						appealData.appealId
					}/manage-linked-appeals/unlink-appeal/${
						parentId || appealData.appealId
					}/${encodeURIComponent(appealData.appealReference)}/${encodeURIComponent(
						linkedAppeal.appealReference
					)}">Unlink</a>`
				}
			];
		});

	const childAppealsHeading = isChildAppeal
		? `Other child appeals of ${appealShortReference(appealData.appealReference)}`
		: `Child appeals of ${shortAppealReference}`;

	/** @type {PageComponent} */
	const childAppealsTable = {
		wrapperHtml: {
			opening: `<h2 class="govuk-!-margin-top-6">${childAppealsHeading}</h2>`,
			closing: ''
		},
		type: 'table',
		parameters: {
			head: [{ text: 'Appeal ID' }, { text: 'Appeal type' }, { text: 'Action' }],
			firstCellIsHeader: false,
			rows: childAppealsRows
		}
	};

	if (childAppealsRows.length > 0) {
		pageComponents.push(childAppealsTable);
	}

	/** @type {PageContent} */
	const pageContent = {
		title: `Manage linked appeals - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'Manage linked appeals',
		pageComponents
	};

	return pageContent;
}

/**
 *
 * @param {Appeal} appealData
 * @param {string} parentRef
 * @param {string} childRef
 * @returns {PageContent}
 */
export function unlinkAppealPage(appealData, parentRef, childRef) {
	/** @type {PageComponent} */
	const selectAppealTypeRadiosComponent = {
		type: 'radios',
		parameters: {
			name: 'unlinkAppeal',
			fieldset: {
				legend: {
					classes: 'govuk-fieldset__legend--m'
				}
			},
			items: [
				{
					text: 'Yes',
					value: 'yes'
				},
				{
					text: 'No',
					value: 'no'
				}
			]
		}
	};

	const shortAppealReference = appealShortReference(appealData.appealReference);
	const titleAndHeading = `Do you want to unlink the appeal ${childRef} from appeal ${parentRef}?`;

	/** @type {PageContent} */
	const pageContent = {
		title: titleAndHeading,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/manage-linked-appeals/linked-appeals`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: titleAndHeading,
		pageComponents: [selectAppealTypeRadiosComponent]
	};

	return pageContent;
}

import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import { appealShortReference, linkedAppealStatus } from '#lib/appeals-formatter.js';
import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
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
 * @returns {PageContent}
 */
export function linkedAppealsPage(appealData, childShortAppealReference, appealId, parentId) {
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
			status: linkedAppealStatus(isChildAppeal)
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
 * @param {Appeal} appealData
 * @returns {PageContent}
 */
export function addLinkedAppealPage(appealData) {
	const shortAppealReference = appealShortReference(appealData.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Add linked appeal - ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: 'What is the appeal reference?',
		pageComponents: [
			{
				type: 'input',
				parameters: {
					id: 'appeal-reference',
					name: 'appeal-reference',
					type: 'text',
					classes: 'govuk-input govuk-input--width-10',
					label: {
						isPageHeading: false,
						text: 'Appeal reference',
						classes: 'govuk-visually-hidden'
					}
				}
			}
		]
	};

	return pageContent;
}

/**
 * @param {Appeal} appealData
 * @param {Appeal} linkCandidateAppealData
 * @param {string} currentRoute
 * @param {import('../../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<PageContent>}
 */
export async function addLinkedAppealCheckAndConfirmPage(appealData, linkCandidateAppealData, currentRoute, session) {
	const shortAppealReference = appealShortReference(appealData.appealReference);
	const mappedCandidateData = await initialiseAndMapAppealData(linkCandidateAppealData, currentRoute, session);

	/** @type {PageContent} */
	const pageContent = {
		title: `Details of the appeal you're linking to ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: `Details of the appeal you're linking to`,
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					rows: [
						// TODO: remove actions from all of these rows
						mappedCandidateData.appeal.appealReference,
						mappedCandidateData.appeal.appealStatus,
						mappedCandidateData.appeal.appealType,
						mappedCandidateData.appeal.siteAddress,
						mappedCandidateData.appeal.localPlanningAuthority,
						mappedCandidateData.appeal.appellant,
						mappedCandidateData.appeal.agent
					]
				}
			}
		]
	};

	const targetIsLead = appealData.linkedAppeals.filter(targetLinkedAppeal => targetLinkedAppeal.isParentAppeal === false).length > 0;
	const candidateIsLead = linkCandidateAppealData.linkedAppeals.filter(candidateLinkedAppeal => candidateLinkedAppeal.isParentAppeal === false).length > 0;

	/** @type {PageComponent} */
	const alreadyHasLeadWarningTextComponent = {
		type: 'warning-text',
		parameters: {
			parameters: {
				text: 'The appeal you are trying to link to already has a lead appeal.'
			}
		}
	};

	// if target has no linked appeals
	if (appealData.linkedAppeals.length === 0) {
		// if candidate has no linked appeals
		if (linkCandidateAppealData.linkedAppeals.length === 0) {
			// display check and confirm page (3a) with options:
			// - yes, make this the lead appeal for (target)
			// - yes, this is a child appeal of (target)
			// - no, return to search
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					parameters: {
						name: 'confirmation',
						id: 'confirmation',
						items: [
							{
								value: 'lead',
								text: `Yes, make this the lead appeal for ${shortAppealReference}`
							},
							{
								value: 'child',
								text: `Yes, this is a child appeal of ${shortAppealReference}`
							},
							{
								value: 'cancel',
								text: `No, return to search`
							}
						]
					}
				}
			});
		}
		// else if candidate is a lead
		else if (candidateIsLead) {
			// display check and confirm page (3d) with options:
			// - yes, make this the lead appeal for (target)
			// - no, return to search
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					parameters: {
						name: 'confirmation',
						id: 'confirmation',
						items: [
							{
								value: 'lead',
								text: `Yes, make this the lead appeal for ${shortAppealReference}`
							},
							{
								value: 'cancel',
								text: `No, return to search`
							}
						]
					}
				}
			});
		}
		// else (if candidate is a child)
		else {
			// display check and confirm page (3e) with message:
			// - the appeal you are trying to link to already has a lead appeal
			pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
		}
	}
	// else if target is a lead
	else if (targetIsLead) {
		// if candidate has no linked appeals
		if (linkCandidateAppealData.linkedAppeals.length === 0) {
			// display check and confirm page (3c) with options:
			// - yes, this is a child appeal of (target)
			// - no, return to search
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					parameters: {
						name: 'confirmation',
						id: 'confirmation',
						items: [
							{
								value: 'child',
								text: `Yes, this is a child appeal of ${shortAppealReference}`
							},
							{
								value: 'cancel',
								text: `No, return to search`
							}
						]
					}
				}
			});
		}
		// else if candidate is a lead
		else if (candidateIsLead) {
			// display check and confirm page (variant of 3e) with message:
			// - the appeal you are trying to link to is a lead appeal
			// this variant of the screen is not shown in the design but is needed because the messaging of screen 3e is incorrect in this case.
			pageContent.pageComponents?.unshift({
				type: 'warning-text',
				parameters: {
					parameters: {
						text: `Appeal ${shortAppealReference} and the appeal you are trying to link to it are both lead appeals, and cannot be linked.`
					}
				}
			});
		}
		// else (if candidate is a child)
		else {
			// display check and confirm page (3e) with message:
			// - the appeal you are trying to link to already has a lead appeal
			// this branch is also executed when the appeals are already linked (i.e. trying to link to a candidate which is already linked to the target)
			// ideally we would show different messaging if this is the case, but the messaging is technically correct, and the design doesn't account for this
			pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
		}
	}
	// else (if target is a child)
	else {
		// display check and confirm page (3e) with message:
		// - the appeal you are trying to link to already has a lead appeal
		// as above, ideally the scenario where the candidate is already linked to the target would be handled differently (show different messaging)
		// but this isn't accounted for in the design, and the flow is already complex enough - can always add this later as an improvement if we feel it's worth doing
		pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
	}

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

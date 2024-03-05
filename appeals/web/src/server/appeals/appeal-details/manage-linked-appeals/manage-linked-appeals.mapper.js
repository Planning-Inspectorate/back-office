import { numberToAccessibleDigitLabel } from '#lib/accessibility.js';
import { appealShortReference, linkedAppealStatus } from '#lib/appeals-formatter.js';
import { appealSiteToAddressString } from '#lib/address-formatter.js';
import { appealStatusToStatusTag } from '#lib/nunjucks-filters/status-tag.js';
import { dateToDisplayDate } from '#lib/dates.js';
import { generateLinkedAppealsManageLinkHref } from '#lib/mappers/appeal.mapper.js';

/**
 * @typedef {import('../appeal-details.types.js').WebAppeal} Appeal
 * @typedef {import('@pins/appeals.api').Appeals.NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../../appeals.types.js').SelectItemParameter} SelectItemParameter
 */

/**
 *
 * @param {Appeal} appealData
 * @param {string} relationshipId
 * @param {string} appealId
 * @param {string} parentId
 * @returns {PageContent}
 */
export function manageLinkedAppealsPage(appealData, relationshipId, appealId, parentId) {
	const isChildAppeal = parentId !== undefined;
	const isHorizonLeadAppeal =
		appealData.appealType === 'Horizon' &&
		!parentId &&
		appealData.linkedAppeals.every((link) => link.isParentAppeal);

	const matchingLinkedAppeal = appealData.linkedAppeals.find(
		(linkedAppeal) => linkedAppeal.relationshipId === Number(relationshipId)
	);
	const shortAppealReference = matchingLinkedAppeal
		? appealShortReference(matchingLinkedAppeal.appealReference)
		: appealShortReference(appealData.appealReference);

	/** @type {PageComponent[]} **/
	const pageComponents = [];

	/** @type {PageComponent} */
	const appealStatusTagComponent = {
		type: 'status-tag',
		wrapperHtml: {
			opening: '<div class="govuk-!-margin-bottom-2">',
			closing: '</div>'
		},
		parameters: {
			status: linkedAppealStatus(!isChildAppeal, isChildAppeal)
		}
	};
	pageComponents.push(appealStatusTagComponent);

	if (isChildAppeal && !isHorizonLeadAppeal) {
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
							html: `<a class="govuk-link" href="/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/unlink-appeal/${appealId}/${matchingLinkedAppeal?.relationshipId}">Unlink</a>`
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
					html: `<a class="govuk-link" href="/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/unlink-appeal/${linkedAppeal.appealId}/${linkedAppeal.relationshipId}">Unlink</a>`
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
 * @param {import('@pins/appeals.api').Appeals.LinkableAppealSummary} linkCandidateSummary
 * @param {Appeal|undefined} linkCandidateAppealData
 * @returns {PageContent}
 */
export function addLinkedAppealCheckAndConfirmPage(
	appealData,
	linkCandidateSummary,
	linkCandidateAppealData
) {
	const shortAppealReference = appealShortReference(appealData.appealReference);

	/** @type {PageContent} */
	const pageContent = {
		title: `Details of the appeal you're linking to ${shortAppealReference}`,
		backLinkUrl: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`,
		preHeading: `Appeal ${shortAppealReference}`,
		heading: `Details of the appeal you're linking to`,
		headingClasses: 'govuk-heading-l',
		pageComponents: [
			{
				type: 'summary-list',
				parameters: {
					classes: 'govuk-!-margin-bottom-9',
					rows: [
						{
							key: {
								text: 'Appeal reference'
							},
							value: {
								text: `${linkCandidateSummary.appealReference}${
									linkCandidateSummary.source === 'horizon' ? ' (Horizon)' : ''
								}`
							}
						},
						{
							key: {
								text: 'Appeal status'
							},
							value: {
								text: appealStatusToStatusTag(linkCandidateSummary.appealStatus)
							}
						},
						{
							key: {
								text: 'Appeal type'
							},
							value: {
								text: linkCandidateSummary.appealType
							}
						},
						{
							key: {
								text: 'Site address'
							},
							value: {
								text: appealSiteToAddressString(linkCandidateSummary.siteAddress)
							}
						},
						{
							key: {
								text: 'Local planning authority'
							},
							value: {
								text: linkCandidateSummary.localPlanningDepartment
							}
						},
						{
							key: {
								text: 'Appellant name'
							},
							value: {
								text: linkCandidateSummary.appellantName
							}
						},
						{
							key: {
								text: 'Agent name'
							},
							value: {
								text: linkCandidateSummary.agentName
							}
						},
						{
							key: {
								text: 'Submission date'
							},
							value: {
								text: dateToDisplayDate(linkCandidateSummary.submissionDate)
							}
						}
					]
				}
			}
		]
	};

	const candidateIsLead = linkCandidateAppealData && linkCandidateAppealData.isParentAppeal;
	const candidateIsChild = linkCandidateAppealData && linkCandidateAppealData.isChildAppeal;

	/** @type {PageComponent} */
	const alreadyHasLeadWarningTextComponent = {
		type: 'warning-text',
		parameters: {
			text: 'The appeal you are trying to link to already has a lead appeal.'
		}
	};

	// if candidate is already linked to target
	if (
		appealData.linkedAppeals.filter(
			(linkedAppeal) => linkedAppeal.appealReference === linkCandidateSummary.appealReference
		).length > 0
	) {
		pageContent.pageComponents?.unshift({
			type: 'warning-text',
			parameters: {
				text: `The appeals are already linked.`
			}
		});
		pageContent.submitButtonProperties = {
			text: 'Return to search',
			href: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`
		};
	}
	// target has no linked appeals
	else if (appealData.linkedAppeals.length === 0) {
		// candidate has no linked appeals
		if (!linkCandidateAppealData || linkCandidateAppealData?.linkedAppeals.length === 0) {
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					name: 'confirmation',
					id: 'confirmation',
					fieldset: {
						legend: {
							text: 'Is this the appeal you want to link?',
							classes: 'govuk-fieldset__legend--m'
						}
					},
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
							divider: 'or'
						},
						{
							value: 'cancel',
							text: `No, return to search`
						}
					]
				}
			});
			pageContent.submitButtonProperties = {
				text: 'Continue',
				type: 'submit'
			};
		}
		// candidate is a lead
		else if (candidateIsLead) {
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					name: 'confirmation',
					id: 'confirmation',
					items: [
						{
							value: 'lead',
							text: `Yes, make this the lead appeal for ${shortAppealReference}`
						},
						{
							divider: 'or'
						},
						{
							value: 'cancel',
							text: `No, return to search`
						}
					]
				}
			});
			pageContent.submitButtonProperties = {
				text: 'Continue',
				type: 'submit'
			};
		}
		// candidate is a child
		else if (candidateIsChild) {
			pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
			pageContent.submitButtonProperties = {
				text: 'Return to search',
				href: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`
			};
		}
	}
	// target is a lead
	else if (appealData.isParentAppeal) {
		// candidate has no linked appeals
		if (!linkCandidateAppealData || linkCandidateAppealData.linkedAppeals.length === 0) {
			pageContent.pageComponents?.push({
				type: 'radios',
				parameters: {
					name: 'confirmation',
					id: 'confirmation',
					items: [
						{
							value: 'child',
							text: `Yes, this is a child appeal of ${shortAppealReference}`
						},
						{
							divider: 'or'
						},
						{
							value: 'cancel',
							text: `No, return to search`
						}
					]
				}
			});
			pageContent.submitButtonProperties = {
				text: 'Continue',
				type: 'submit'
			};
		}
		// candidate is a lead
		else if (candidateIsLead) {
			pageContent.pageComponents?.unshift({
				type: 'warning-text',
				parameters: {
					text: `Appeal ${shortAppealReference} and the appeal you are trying to link to it are both lead appeals, and cannot be linked.`
				}
			});
			pageContent.submitButtonProperties = {
				text: 'Return to search',
				href: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`
			};
		}
		// candidate is a child
		else {
			pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
			pageContent.submitButtonProperties = {
				text: 'Return to search',
				href: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`
			};
		}
	}
	// target is a child
	else if (appealData.isChildAppeal) {
		pageContent.pageComponents?.unshift(alreadyHasLeadWarningTextComponent);
		pageContent.submitButtonProperties = {
			text: 'Return to search',
			href: `/appeals-service/appeal-details/${appealData.appealId}/linked-appeals/add`
		};
	}

	return pageContent;
}

/**
 *
 * @param {Appeal} appealData
 * @param {string} childRef
 * @returns {PageContent}
 */
export function unlinkAppealPage(appealData, childRef) {
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
	const shortChildAppealReference = appealShortReference(childRef);
	const titleAndHeading = `Do you want to unlink the appeal ${shortChildAppealReference} from appeal ${shortAppealReference}?`;

	/** @type {PageContent} */
	const pageContent = {
		title: titleAndHeading,
		backLinkUrl: generateLinkedAppealsManageLinkHref(appealData),
		preHeading: `Appeal ${shortAppealReference}`,
		heading: titleAndHeading,
		pageComponents: [selectAppealTypeRadiosComponent]
	};

	return pageContent;
}

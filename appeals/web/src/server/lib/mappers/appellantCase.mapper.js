import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { appealSiteToAddressString } from '#lib/address-formatter.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';
import { nameToString } from '#lib/person-name-formatter.js';
import { mapAddressInput } from './global-mapper-formatter.js';
import { isFolderInfo } from '#lib/ts-utilities.js';

/**
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 */

/**
 * @param {import('@pins/appeals.api').Appeals.SingleAppellantCaseResponse} appellantCaseData
 * @param {string} currentRoute
 * @returns {MappedInstructions}
 */
export function initialiseAndMapData(appellantCaseData, currentRoute) {
	if (appellantCaseData === undefined) {
		throw new Error('appellantCaseDetails is undefined');
	}

	currentRoute =
		currentRoute[currentRoute.length - 1] === '/' ? currentRoute.slice(0, -1) : currentRoute;

	/** @type {MappedInstructions} */
	let mappedData = {};

	/** @type {Instructions} */
	mappedData.appellantName = {
		id: 'appellant-name',
		display: {
			summaryListItem: {
				key: {
					text: 'Appellant name'
				},
				value: {
					text: nameToString({
						firstName: appellantCaseData.appellant.firstName || '',
						lastName: appellantCaseData.appellant.surname || ''
					})
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Appellant name',
							href: `${currentRoute}/change-appeal-details/appellant-name`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Appellant name',
			instructions: [
				{
					type: 'input',
					properties: {
						name: 'appellant-name',
						value: nameToString({
							firstName: appellantCaseData.appellant.firstName || '',
							lastName: appellantCaseData.appellant.surname || ''
						})
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.applicantName = {
		id: 'applicant-name',
		display: {
			summaryListItem: {
				key: {
					text: 'Applicant name'
				},
				value: {
					text: nameToString({
						firstName: appellantCaseData.applicant.firstName || '',
						lastName: appellantCaseData.applicant.surname || ''
					})
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Applicant name',
							href: `${currentRoute}/change-appeal-details/applicant-name`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Applicant name',
			instructions: [
				{
					type: 'input',
					properties: {
						name: 'applicant-name',
						value: nameToString({
							firstName: appellantCaseData.applicant.firstName || '',
							lastName: appellantCaseData.applicant.surname || ''
						})
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.applicationReference = {
		id: 'application-reference',
		display: {
			summaryListItem: {
				key: {
					text: 'Application reference'
				},
				value: {
					text: appellantCaseData.planningApplicationReference
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Application reference',
							href: `${currentRoute}/change-appeal-details/application-reference`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Application reference',
			instructions: [
				{
					type: 'input',
					properties: {
						name: 'application-reference',
						value: appellantCaseData.planningApplicationReference
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.siteAddress = {
		id: 'site-address',
		display: {
			summaryListItem: {
				key: {
					text: 'Site address'
				},
				value: {
					text: appealSiteToAddressString(appellantCaseData.appealSite)
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Site address',
							href: `${currentRoute}/change-appeal-details/site-address`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Site address',
			instructions: mapAddressInput(appellantCaseData.appealSite)
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.localPlanningAuthority = {
		id: 'local-planning-authority',
		display: {
			summaryListItem: {
				key: {
					text: 'Local planning authority'
				},
				value: {
					text: appellantCaseData.localPlanningDepartment
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Local planning authority',
							href: `${currentRoute}/change-appeal-details/local-planning-authority`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Local planning authority',
			instructions: [
				{
					type: 'input',
					properties: {
						name: 'local-planning-authority',
						value: appellantCaseData.localPlanningDepartment
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.siteFullyOwned = {
		id: 'site-fully-owned',
		display: {
			summaryListItem: {
				key: {
					text: 'Site fully owned'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isFullyOwned) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Site fully owned',
							href: `${currentRoute}/change-appeal-details/site-fully-owned`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Site fully owned',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'site-fully-owned',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.siteOwnership.isFullyOwned
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.siteOwnership.isFullyOwned
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.sitePartiallyOwned = {
		id: 'site-partially-owned',
		display: {
			summaryListItem: {
				key: {
					text: 'Site partially owned'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.isPartiallyOwned) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Site partially owned',
							href: `${currentRoute}/change-appeal-details/site-partially-owned`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Site partially owned',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'site-partially-owned',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.siteOwnership.isPartiallyOwned
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.siteOwnership.isPartiallyOwned
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.allOwnersKnown = {
		id: 'all-owners-known',
		display: {
			summaryListItem: {
				key: {
					text: 'All owners known'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.siteOwnership.areAllOwnersKnown) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'All owners known',
							href: `${currentRoute}/change-appeal-details/all-owners-known`
						}
					]
				}
			}
		},
		input: {
			displayName: 'All owners known',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'all-owners-known',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.siteOwnership.areAllOwnersKnown
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.siteOwnership.areAllOwnersKnown
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.attemptedToIdentifyOwners = {
		id: 'attempted-to-identify-owners',
		display: {
			summaryListItem: {
				key: {
					text: 'Attempted to identify owners'
				},
				value: {
					text:
						convertFromBooleanToYesNo(
							appellantCaseData.siteOwnership.hasAttemptedToIdentifyOwners
						) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Attempted to identify owners',
							href: `${currentRoute}/change-appeal-details/attempted-to-identify-owners`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Attempted to identify owners',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'attempted-to-identify-owners',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.siteOwnership.hasAttemptedToIdentifyOwners
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.siteOwnership.hasAttemptedToIdentifyOwners
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.advertisedAppeal = {
		id: 'advertised-appeal',
		display: {
			summaryListItem: {
				key: {
					text: 'Advertised appeal'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.hasAdvertisedAppeal) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Advertised appeal',
							href: `${currentRoute}/change-appeal-details/advertised-appeal`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Advertised appeal',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'advertised-appeal',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.hasAdvertisedAppeal
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.hasAdvertisedAppeal
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.visibility = {
		id: 'visibility',
		display: {
			summaryListItem: {
				key: {
					text: 'Visibility'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.visibility.isVisible) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Visibility',
							href: `${currentRoute}/change-appeal-details/visibility`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Visibility',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'visibility',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.visibility.isVisible
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.visibility.isVisible
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.healthAndSafetyIssues = {
		id: 'site-health-and-safety-issues',
		display: {
			summaryListItem: {
				key: {
					text: 'Potential safety risks'
				},
				value: {
					text: convertFromBooleanToYesNo(appellantCaseData.healthAndSafety.hasIssues) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Potential safety risks',
							href: `${currentRoute}/change-appeal-details/site-health-and-safety-issues`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Potential safety risks',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'site-health-and-safety-issues',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appellantCaseData.healthAndSafety.hasIssues
							},
							{
								text: 'No',
								value: 'no',
								checked: !appellantCaseData.healthAndSafety.hasIssues
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.applicationForm = {
		id: 'application-form',
		display: {
			summaryListItem: {
				key: {
					text: 'Application form'
				},
				value: displayPageFormatter.formatDocumentValues(
					appellantCaseData.appealId,
					isFolderInfo(appellantCaseData.documents.applicationForm)
						? appellantCaseData.documents.applicationForm.documents
						: []
				),
				actions: {
					items: [
						...((
							(isFolderInfo(appellantCaseData.documents.applicationForm) &&
								appellantCaseData.documents.applicationForm.documents) ||
							[]
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'Application form',
										href: mapDocumentManageUrl(
											appellantCaseData.appealId,
											isFolderInfo(appellantCaseData.documents.applicationForm)
												? appellantCaseData.documents.applicationForm.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'Application form',
							href: displayPageFormatter.formatDocumentActionLink(
								appellantCaseData.appealId,
								appellantCaseData.documents.applicationForm,
								documentUploadUrlTemplate
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.decisionLetter = {
		id: 'decision-letter',
		display: {
			summaryListItem: {
				key: {
					text: 'Decision letter'
				},
				value: displayPageFormatter.formatDocumentValues(
					appellantCaseData.appealId,
					isFolderInfo(appellantCaseData.documents.decisionLetter)
						? appellantCaseData.documents.decisionLetter.documents
						: []
				),
				actions: {
					items: [
						...((isFolderInfo(appellantCaseData.documents.decisionLetter)
							? appellantCaseData.documents.decisionLetter.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'Decision letter',
										href: mapDocumentManageUrl(
											appellantCaseData.appealId,
											isFolderInfo(appellantCaseData.documents.decisionLetter)
												? appellantCaseData.documents.decisionLetter.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'Decision letter',
							href: displayPageFormatter.formatDocumentActionLink(
								appellantCaseData.appealId,
								appellantCaseData.documents.decisionLetter,
								documentUploadUrlTemplate
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appealStatement = {
		id: 'appeal-statement',
		display: {
			summaryListItem: {
				key: {
					text: 'Appeal statement'
				},
				value: displayPageFormatter.formatDocumentValues(
					appellantCaseData.appealId,
					isFolderInfo(appellantCaseData.documents.appealStatement)
						? appellantCaseData.documents.appealStatement.documents
						: []
				),
				actions: {
					items: [
						...((isFolderInfo(appellantCaseData.documents.appealStatement)
							? appellantCaseData.documents.appealStatement.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'Appeal statement',
										href: mapDocumentManageUrl(
											appellantCaseData.appealId,
											isFolderInfo(appellantCaseData.documents.appealStatement)
												? appellantCaseData.documents.appealStatement.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'Appeal statement',
							href: displayPageFormatter.formatDocumentActionLink(
								appellantCaseData.appealId,
								appellantCaseData.documents.appealStatement,
								documentUploadUrlTemplate
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.addNewSupportingDocuments = {
		id: 'add-new-supporting-documents',
		display: {
			summaryListItem: {
				key: {
					text: 'Supporting documents'
				},
				value: {
					text:
						convertFromBooleanToYesNo(
							(isFolderInfo(appellantCaseData.documents.newSupportingDocuments)
								? appellantCaseData.documents.newSupportingDocuments.documents
								: []
							)?.length > 0
						) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Supporting documents',
							href: `${currentRoute}/change-appeal-details/add-new-supporting-documents`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Supporting documents',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'add-new-supporting-documents',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked:
									isFolderInfo(appellantCaseData.documents.newSupportingDocuments) &&
									appellantCaseData.documents.newSupportingDocuments.documents?.length > 0
							},
							{
								text: 'No',
								value: 'no',
								checked: !(
									isFolderInfo(appellantCaseData.documents.newSupportingDocuments) &&
									appellantCaseData.documents.newSupportingDocuments.documents?.length > 0
								)
							}
						]
					}
				}
			]
		},
		submitApi: '#',
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.newSupportingDocuments = {
		id: 'new-supporting-documents',
		display: {
			summaryListItem: {
				key: {
					text: 'New supporting documents'
				},
				value: displayPageFormatter.formatDocumentValues(
					appellantCaseData.appealId,
					isFolderInfo(appellantCaseData.documents.newSupportingDocuments)
						? appellantCaseData.documents.newSupportingDocuments.documents
						: []
				),
				actions: {
					items: [
						...((isFolderInfo(appellantCaseData.documents.newSupportingDocuments)
							? appellantCaseData.documents.newSupportingDocuments.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'New supporting documents',
										href: mapDocumentManageUrl(
											appellantCaseData.appealId,
											isFolderInfo(appellantCaseData.documents.newSupportingDocuments)
												? appellantCaseData.documents.newSupportingDocuments.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'New supporting documents',
							href: displayPageFormatter.formatDocumentActionLink(
								appellantCaseData.appealId,
								appellantCaseData.documents.newSupportingDocuments,
								documentUploadUrlTemplate
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.additionalDocuments = {
		id: 'additional-documents',
		display: {
			...((isFolderInfo(appellantCaseData.documents.additionalDocuments)
				? appellantCaseData.documents.additionalDocuments.documents
				: []
			).length > 0
				? {
						summaryListItems: (isFolderInfo(appellantCaseData.documents.additionalDocuments)
							? appellantCaseData.documents.additionalDocuments.documents
							: []
						).map((document) => ({
							key: {
								text: 'Additional documents',
								classes: 'govuk-visually-hidden'
							},
							value: displayPageFormatter.formatDocumentValues(
								appellantCaseData.appealId,
								[document],
								document.isLateEntry
							),
							actions: {
								items: []
							}
						}))
				  }
				: {
						summaryListItems: [
							{
								key: {
									text: 'Additional documents',
									classes: 'govuk-visually-hidden'
								},
								value: {
									text: 'None'
								}
							}
						]
				  })
		}
	};

	/** @type {Instructions} */
	mappedData.reviewOutcome = {
		id: 'review-outcome',
		display: {
			summaryListItem: {
				key: {
					text: 'Appellant case review outcome'
				},
				value: {
					text: appellantCaseData.validation?.outcome || 'Not yet reviewed'
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Appellant case review outcome',
							href: `/appeals-service/appeal-details/${appellantCaseData.appealId}/lpa-questionnaire`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Review outcome',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'reviewOutcome',
						value: appellantCaseData.validation?.outcome,
						fieldset: {
							legend: {
								text: 'What is the outcome of your review?',
								classes: 'govuk-fieldset__legend--m'
							}
						},
						items: [
							{
								value: 'valid',
								text: 'Valid'
							},
							{
								value: 'invalid',
								text: 'Invalid'
							},
							{
								value: 'incomplete',
								text: 'Incomplete'
							}
						]
					}
				}
			]
		}
	};

	return mappedData;
}

export const documentUploadUrlTemplate =
	'/appeals-service/appeal-details/{{appealId}}/appellant-case/add-documents/{{folderId}}/{{documentId}}';

/**
 *
 * @param {Number} caseId
 * @param {number|undefined} folderId
 * @returns {string}
 */
export const mapDocumentManageUrl = (caseId, folderId) => {
	if (folderId === undefined) {
		return '';
	}
	return `/appeals-service/appeal-details/${caseId}/appellant-case/manage-documents/${folderId}/`;
};

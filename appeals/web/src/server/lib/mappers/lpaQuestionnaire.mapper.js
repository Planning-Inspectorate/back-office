import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { addressToString } from '#lib/address-formatter.js';
import * as displayFormatter from '#lib/display-page-formatter.js';
import { conditionalFormatter, mapAddressInput } from './global-mapper-formatter.js';

// TODO: Limit the input types to constants (not working??)
/**
 * @typedef {object} ComponentType
 * @prop {string} type
 */

/**
 * @typedef MappedLPAQInstructions
 * @type {object}
 * @prop {LPAQInstructionCollection} lpaq
 */
/**
 * @typedef LPAQInstructionCollection
 * A collection of Instructions to display Appeal Data
 * @type {Object<string, Instructions>}
 */

/**
 * @typedef Instructions
 * A series of instructions pages where you display data, input data, and the API associated with that data
 * @type {object}
 * @property {string} id
 * @property {DisplayInstructions} display Collection of display instructions
 * @property {InputInstruction[]} [input] Collection of input instructions
 * @property {string} [submitApi]
 */
/**
 * @typedef DisplayInstructions
 * Display Instructions
 * @type {object}
 * @property {SummaryListRowProperties} [summaryListItem] To create a row in a summary list
 * @property {StatusTag} [statusTag] To create a Status Tag
 * @property {TableRowProperties[]} [tableItem] To create a table row
 */
/**
 * @typedef InputInstruction
 * A series of instruction to for pages where you input the data
 * @type {ComponentType & (RadioProperties | TextInputProperties | FieldsetProperties)}
 */
/**
 * @typedef StatusTag
 * @type {object}
 * @property {string} status
 * @property {string} classes
 */

/**
 * @param {*} data
 * @param {string} currentRoute
 * @returns {Promise<MappedLPAQInstructions>}
 */

export async function initialiseAndMapLPAQData(data, currentRoute) {
	/** @type {MappedLPAQInstructions} */
	const mappedData = {};
	mappedData.lpaq = {};
	/** @type {Instructions} */
	mappedData.lpaq.isListedBuilding = {
		id: 'is-listed-building',
		display: {
			summaryListItem: {
				key: {
					text: 'Listed building'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.isListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/is-listed-building`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'is-listed-building',
				name: 'isListedBuilding',
				fieldset: {
					legend: {
						text: 'Does the proposed development change a listed building?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.isListedBuilding
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.isListedBuilding
					}
				]
			}
		]
	};

	if (data.lpaq.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaq.listedBuildingDetails = {
			id: 'listed-building-details',
			display: {
				summaryListItem: {
					key: {
						text: 'Listed building details'
					},
					value: {
						html: displayFormatter.formatListOfListedBuildingNumbers(
							data.lpaq.listedBuildingDetails
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `${currentRoute}/change-lpa-questionnaire/listed-building-details`
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaq.doesAffectAListedBuilding = {
		id: 'does-affect-a-listed-building',
		display: {
			summaryListItem: {
				key: {
					text: 'Affects a listed building'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.doesAffectAListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/does-affect-a-listed-building`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'does-affect-a-listed-building',
				name: 'doesAffectAListedBuilding',
				fieldset: {
					legend: {
						text: 'Do the plans affect the setting of a listed building or site?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.isListedBuilding
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.isListedBuilding
					}
				]
			}
		]
	};

	if (data.lpaq.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaq.affectsListedBuildingDetails = {
			id: 'affects-listed-building-details',
			display: {
				summaryListItem: {
					key: {
						text: 'Affected listed building details'
					},
					value: {
						html: displayFormatter.formatListOfListedBuildingNumbers(
							data.lpaq.affectsListedBuildingDetails
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `${currentRoute}/change-lpa-questionnaire/affects-listed-building-details`
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaq.doesAffectAScheduledMonument = {
		id: 'affects-scheduled-monument',
		display: {
			summaryListItem: {
				key: {
					text: 'Affects a scheduled monument'
				},
				value: {
					html: convertFromBooleanToYesNo(data.lpaq.doesAffectAScheduledMonument) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/affects-scheduled-monument`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'affects-scheduled-monument',
				name: 'affectsAScheduledMonument',
				fieldset: {
					legend: {
						text: 'Would the development affect a scheduled monument?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.doesAffectAScheduledMonument
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.doesAffectAScheduledMonument
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.isCorrectAppealType = {
		id: 'is-correct-appeal-type',
		display: {
			summaryListItem: {
				key: {
					text: 'Correct appeal type'
				},
				value: {
					html: convertFromBooleanToYesNo(data.lpaq.isCorrectAppealType) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/is-correct-appeal-type`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'is-correct-appeal-type',
				name: 'isCorrectAppealType',
				fieldset: {
					legend: {
						text: 'Is this the correct type of appeal?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.doesAffectAScheduledMonument
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.doesAffectAScheduledMonument
					}
				]
			}
		]
	};
	/** @type {Instructions} */
	mappedData.lpaq.inCAOrrelatesToCA = {
		id: 'in-or-relates-to-ca',
		display: {
			summaryListItem: {
				key: {
					text: 'Conservation area'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.inCAOrrelatesToCA) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/in-or-relates-to-ca`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'in-or-relates-to-ca',
				name: 'inOrrelatesToCa',
				fieldset: {
					legend: {
						text: 'Is the site in, or next to a conservation area?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.inCAOrrelatesToCA
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.inCAOrrelatesToCA
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.conservationAreaMap = {
		id: 'conservation-area-map',
		display: {
			summaryListItem: {
				key: {
					text: 'Conservation area map and guidance'
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaq.appealId,
						data.lpaq.documents.conservationAreaMap
					)
				},
				actions: {
					items: [
						{
							text:
								data.lpaq.documents.conservationAreaMap.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaq.appealId,
								data.lpaq.documents.conservationAreaMap,
								buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.siteWithinGreenBelt = {
		id: 'site-within-green-belt',
		display: {
			summaryListItem: {
				key: {
					text: 'Green belt'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.siteWithinGreenBelt) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/site-within-green-belt`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'site-within-green-belt',
				name: 'siteWithinGreenBelt',
				fieldset: {
					legend: {
						text: 'Is the site in a green belt?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.siteWithinGreenBelt
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.siteWithinGreenBelt
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.notifyingParties = {
		id: 'notifying-parties',
		display: {
			summaryListItem: {
				key: {
					text: 'Who was notified'
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaq.appealId,
						data.lpaq.documents.notifyingParties
					)
				},
				actions: {
					items: [
						{
							text: data.lpaq.documents.notifyingParties?.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaq.appealId,
								data.lpaq.documents.notifyingParties,
								buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.lpaNotificationMethods = {
		id: 'notification-methods',
		display: {
			summaryListItem: {
				key: {
					text: 'Notification methods'
				},
				value: {
					html: displayFormatter.formatListOfNotificationMethodsToHtml(
						data.lpaq.lpaNotificationMethods
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/notification-methods`
						}
					]
				}
			}
		},
		input: [
			//TODO: Post MVP => Can only be Written for HAS
			{
				type: 'checkbox',
				name: 'notification-methods',
				fieldset: {
					legend: {
						text: 'How did were people notified about the planning application?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						value: '1017',
						text: 'A site notice',
						checked: data.lpaq.lpaNotificationMethods.some(
							(/** @type {{ name: string; }} */ value) => value.name === 'A site notice'
						)
					},
					{
						value: '1018',
						text: 'Letters or emails to interested parties',
						checked: data.lpaq.lpaNotificationMethods.some(
							(/** @type {{ name: string; }} */ value) =>
								value.name === 'Letter/email to interested parties'
						)
					},
					{
						value: '1019',
						text: 'An advert in the local press',
						checked: data.lpaq.lpaNotificationMethods.some(
							(/** @type {{ name: string; }} */ value) => value.name === 'A press advert'
						)
					}
				]
			}
		]
	};

	if (
		data.lpaq.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) => method.name === 'A site notice'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaq.siteNotices = {
			id: 'site-notices',
			display: {
				summaryListItem: {
					key: {
						text: 'Site Notice'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaq.appealId,
							data.lpaq.documents.siteNotices
						)
					},
					actions: {
						items: [
							{
								text: data.lpaq.documents.siteNotices?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaq.appealId,
									data.lpaq.documents.siteNotices,
									buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaq.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) =>
				method.name === 'Letter/email to interested parties'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaq.lettersToNeighbours = {
			id: 'letters-to-neighbours',
			display: {
				summaryListItem: {
					key: {
						text: 'Letter/email to interested parties'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaq.appealId,
							data.lpaq.documents.lettersToNeighbours
						)
					},
					actions: {
						items: [
							{
								text:
									data.lpaq.documents.lettersToNeighbours?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaq.appealId,
									data.lpaq.documents.lettersToNeighbours,
									buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaq.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) => method.name === 'Advertisement'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaq.pressAdvert = {
			id: 'press-adverts',
			display: {
				summaryListItem: {
					key: {
						text: 'Advertisement'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaq.appealId,
							data.lpaq.documents.pressAdvert
						)
					},
					actions: {
						items: [
							{
								text: data.lpaq.documents.pressAdvert?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaq.appealId,
									data.lpaq.documents.pressAdvert,
									buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaq.hasRepresentationsFromOtherParties = {
		id: 'has-representations-from-other-parties',
		display: {
			summaryListItem: {
				key: {
					text: 'Representations from other parties'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.hasRepresentationsFromOtherParties) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/has-representations-from-other-parties`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'has-representations-from-other-parties',
				name: 'hasRepresentationsFromOtherParties',
				fieldset: {
					legend: {
						text: 'Did you receive representations from members of the public or other parties?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.hasRepresentationsFromOtherParties
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.hasRepresentationsFromOtherParties
					}
				]
			}
		]
	};

	if (data.lpaq.hasRepresentationsFromOtherParties) {
		/** @type {Instructions} */
		mappedData.lpaq.representations = {
			id: 'representations-from-other-parties',
			display: {
				summaryListItem: {
					key: {
						text: 'Representations from other parties documents'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaq.appealId,
							data.lpaq.documents.representations
						)
					},
					actions: {
						items: [
							{
								text: data.lpaq.documents.representations?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaq.appealId,
									data.lpaq.documents.representations,
									buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaq.officersReport = {
		id: 'officers-report',
		display: {
			summaryListItem: {
				key: {
					text: "Planning officer's report"
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaq.appealId,
						data.lpaq.documents.officersReport
					)
				},
				actions: {
					items: [
						{
							text: data.lpaq.documents.officersReport?.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaq.appealId,
								data.lpaq.documents.officersReport,
								buildDocumentUploadUrlTemplate(data.lpaq.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.siteAccess = {
		id: 'does-site-require-inspector-access',
		display: {
			summaryListItem: {
				key: {
					text: 'Site access required'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.doesSiteRequireInspectorAccess) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/does-site-require-inspector-access`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'does-site-require-inspector-access',
				name: 'doesSiteRequireInspectorAccess',
				fieldset: {
					legend: {
						text: 'Did you receive representations from members of the public or other parties?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.doesSiteRequireInspectorAccess
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.doesSiteRequireInspectorAccess
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.isAffectingNeighbouringSites = {
		id: 'is-affecting-neighbouring-sites',
		display: {
			summaryListItem: {
				key: {
					text: 'Affects neighbouring sites'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaq.isAffectingNeighbouringSites) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/is-affecting-neighbouring-sites`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'is-affecting-neighbouring-sites',
				name: 'isAffectingNeighbouringSites',
				fieldset: {
					legend: {
						text: 'Might the inspector need to enter a neighbour’s land or property?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.lpaq.isAffectingNeighbouringSites
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.isAffectingNeighbouringSites
					}
				]
			}
		]
	};

	if (data.lpaq.neighbouringSiteContacts && data.lpaq.neighbouringSiteContacts.length > 0) {
		for (let i = 0; i < data.lpaq.neighbouringSiteContacts.length; i++) {
			mappedData.lpaq[`neighbouringSiteAddress${i}`] = {
				id: `neighbouring-site-address-${i}`,
				display: {
					summaryListItem: {
						key: {
							text: `Neighbour address ${i + 1}`
						},
						value: {
							html: addressToString(data.lpaq.neighbouringSiteContacts[i].address)
						},
						actions: {
							items: [
								{
									text: 'Change',
									href: `${currentRoute}/change-lpa-questionnaire/neighbouring-site-address-${i}`
								}
							]
						}
					}
				},
				input: mapAddressInput(
					'What is the site address?',
					data.lpaq.neighbouringSiteContacts[i].address
				)
			};
		}
	}

	/** @type {Instructions} */
	mappedData.lpaq.lpaHealthAndSafety = {
		id: 'health-and-safety',
		display: {
			summaryListItem: {
				key: {
					text: 'Potential safety risks'
				},
				value: {
					html: displayFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.lpaq.doesSiteHaveHealthAndSafetyIssues) || '',
						data.lpaq.healthAndSafetyDetails
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/health-and-safety`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'health-and-safety',
				name: 'healthAndSafety',
				fieldset: {
					legend: {
						text: 'Are there any health and safety concerns?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'health-and-safety-text',
							'healthAndSafetyText',
							'Tell us why the inspector will need to enter the appeal site',
							displayFormatter.nullToEmptyString(data.lpaq.healthAndSafetyDetails)
						),
						checked: data.lpaq.doesSiteHaveHealthAndSafetyIssues
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.doesSiteHaveHealthAndSafetyIssues
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.otherAppeals = {
		id: 'other-appeals',
		display: {
			summaryListItem: {
				key: {
					text: 'Appeals near the site'
				},
				value: {
					html: displayFormatter.formatListOfAppeals(data.lpaq.otherAppeals) || 'No other appeals'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/other-appeals`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'text-input',
				id: 'other-appeals',
				name: 'otherAppeals',
				value: displayFormatter.nullToEmptyString(data.lpaq.otherAppeals),
				label: {
					text: 'What appeals are the other associated with this appeal?'
				}
			}
		]
	};

	/** @type {Instructions} */
	mappedData.lpaq.newConditions = {
		id: 'extra-conditions',
		display: {
			summaryListItem: {
				key: {
					text: 'Extra conditions'
				},
				value: {
					html: displayFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.lpaq.hasExtraConditions) || '',
						data.lpaq.extraConditions
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-lpa-questionnaire/extra-conditions`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'extra-conditions',
				name: 'extraConditions',
				fieldset: {
					legend: {
						text: 'Are there any new conditions?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'extra-conditions-text',
							'extraConditionsText',
							'Tell us about the new conditions',
							displayFormatter.nullToEmptyString(data.lpaq.extraConditions)
						),
						checked: data.lpaq.hasExtraConditions
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.lpaq.hasExtraConditions
					}
				]
			}
		]
	};
	/** @type {Instructions} */
	mappedData.lpaq.reviewOutcome = {
		id: 'review-outcome',
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Questionnaire review outcome'
				},
				value: {
					text: data.lpaq.validation?.outcome || 'Not yet reviewed'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `/appeals-service/appeal-details/${data.lpaq.appealId}/lpa-questionnaire/${data.lpaq.lpaQuestionnaireId}`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				name: 'review-outcome',
				id: 'review-outcome',
				fieldset: {
					legend: {
						text: 'What is the outcome of your review?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--m'
					}
				},
				value: data.lpaq.validation?.outcome || null,
				items: [
					{
						value: 'complete',
						text: 'Complete'
					},
					{
						value: 'incomplete',
						text: 'Incomplete'
					}
				]
			}
		]
	};

	return mappedData;
}

/**
 * @param {string} lpaQuestionnaireId
 * @returns {string}
 */
const buildDocumentUploadUrlTemplate = (lpaQuestionnaireId) => {
	return `/appeals-service/appeal-details/{{appealId}}/lpa-questionnaire/${lpaQuestionnaireId}/add-documents/{{folderId}}/{{documentId}}`;
};

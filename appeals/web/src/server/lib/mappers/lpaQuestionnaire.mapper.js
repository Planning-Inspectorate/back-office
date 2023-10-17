import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { addressToString } from '#lib/address-formatter.js';
import * as displayFormatter from '#lib/display-page-formatter.js';

// TODO: Limit the input types to constants (not working??)
/**
 * @typedef {object} ComponentType
 * @prop {string} type
 */

/**
 * @typedef MappedLPAQInstructions
 * @type {object}
 * @prop {LPAQInstructionCollection} lpaQ
 */

/**
 * @typedef LPAQInstructionCollection
 * A collection of Instructions to display LPA Questionnaire Data
 * @type {object}
 * @prop {Instructions} isListedBuilding
 * @prop {Instructions} listedBuildingDetails
 * @prop {Instructions} doesAffectAListedBuilding
 * @prop {Instructions} affectsListedBuildingDetails
 * @prop {Instructions} doesAffectAScheduledMonument
 * @prop {Instructions} inCAOrrelatesToCA
 * @prop {Instructions} isCorrectAppealType
 * @prop {Instructions} conservationAreaMap
 * @prop {Instructions} siteWithinGreenBelt
 * @prop {Instructions} notifyingParties
 * @prop {Instructions} lpaNotificationMethods
 * @prop {Instructions} [siteNotices]
 * @prop {Instructions} [lettersToNeighbours]
 * @prop {Instructions} [pressAdvert]
 * @prop {Instructions} hasRepresentationsFromOtherParties
 * @prop {Instructions} [representations]
 * @prop {Instructions} officersReport
 * @prop {Instructions} siteAccess
 * @prop {Instructions} isAffectingNeighbouringSites
 * @prop {Instructions[]} [neighbouringSite]
 * @prop {Instructions} lpaHealthAndSafety
 * @prop {Instructions} otherAppeals
 * @prop {Instructions} newConditions
 * @prop {Instructions} reviewOutcome
 */

/**
 * @typedef Instructions
 * A series of instructions pages where you display data, input data, and the API associated with that data
 * @type {object}
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
 * @type {ComponentType & (RadioProperties | TextInputProperties)}
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
 * @returns {MappedLPAQInstructions}
 */

export function initialiseAndMapLPAQData(data, currentRoute) {
	/** @type {MappedLPAQInstructions} */
	const mappedData = {};
	mappedData.lpaQ = {};
	/** @type {Instructions} */
	mappedData.lpaQ.isListedBuilding = {
		display: {
			summaryListItem: {
				key: {
					text: 'Listed building'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.isListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/is-listed-building`
						}
					]
				}
			}
		}
	};

	if (data.lpaQ.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaQ.listedBuildingDetails = {
			display: {
				summaryListItem: {
					key: {
						text: 'Listed building details'
					},
					value: {
						html: displayFormatter.formatListOfListedBuildingNumbers(
							data.lpaQ.listedBuildingDetails
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `${currentRoute}/change/listed-building-details`
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaQ.doesAffectAListedBuilding = {
		display: {
			summaryListItem: {
				key: {
					text: 'Affects a listed building'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.doesAffectAListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/does-affect-a-listed-building`
						}
					]
				}
			}
		}
	};

	if (data.lpaQ.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaQ.affectsListedBuildingDetails = {
			display: {
				summaryListItem: {
					key: {
						text: 'Affected listed building details'
					},
					value: {
						html: displayFormatter.formatListOfListedBuildingNumbers(
							data.lpaQ.affectsListedBuildingDetails
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								href: `${currentRoute}/change/affects-listed-building-details`
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaQ.doesAffectAScheduledMonument = {
		display: {
			summaryListItem: {
				key: {
					text: 'Affects a scheduled monument'
				},
				value: {
					html: convertFromBooleanToYesNo(data.lpaQ.doesAffectAScheduledMonument) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/affects-scheduled-monument`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.isCorrectAppealType = {
		display: {
			summaryListItem: {
				key: {
					text: 'Correct appeal type'
				},
				value: {
					html: convertFromBooleanToYesNo(data.lpaQ.isCorrectAppealType) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/is-correct-appeal-type`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.lpaQ.inCAOrrelatesToCA = {
		display: {
			summaryListItem: {
				key: {
					text: 'Conservation area'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.inCAOrrelatesToCA) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/in-or-relates-to-ca`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.conservationAreaMap = {
		display: {
			summaryListItem: {
				key: {
					text: 'Conservation area map and guidance'
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaQ.appealId,
						data.lpaQ.documents.conservationAreaMap
					)
				},
				actions: {
					items: [
						{
							text:
								data.lpaQ.documents.conservationAreaMap.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaQ.appealId,
								data.lpaQ.documents.conservationAreaMap,
								buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.siteWithinGreenBelt = {
		display: {
			summaryListItem: {
				key: {
					text: 'Green belt'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.siteWithinGreenBelt) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/site-within-green-belt`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.notifyingParties = {
		display: {
			summaryListItem: {
				key: {
					text: 'Who was notified'
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaQ.appealId,
						data.lpaQ.documents.notifyingParties
					)
				},
				actions: {
					items: [
						{
							text: data.lpaQ.documents.notifyingParties?.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaQ.appealId,
								data.lpaQ.documents.notifyingParties,
								buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.lpaNotificationMethods = {
		display: {
			summaryListItem: {
				key: {
					text: 'Notification methods'
				},
				value: {
					html: displayFormatter.formatListOfNotificationMethodsToHtml(
						data.lpaQ.lpaNotificationMethods
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/notification-methods`
						}
					]
				}
			}
		}
	};

	if (
		data.lpaQ.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) => method.name === 'A site notice'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaQ.siteNotices = {
			display: {
				summaryListItem: {
					key: {
						text: 'Site Notice'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaQ.appealId,
							data.lpaQ.documents.siteNotices
						)
					},
					actions: {
						items: [
							{
								text: data.lpaQ.documents.siteNotices?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaQ.appealId,
									data.lpaQ.documents.siteNotices,
									buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaQ.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) =>
				method.name === 'Letter/email to interested parties'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaQ.lettersToNeighbours = {
			display: {
				summaryListItem: {
					key: {
						text: 'Letter/email to interested parties'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaQ.appealId,
							data.lpaQ.documents.lettersToNeighbours
						)
					},
					actions: {
						items: [
							{
								text:
									data.lpaQ.documents.lettersToNeighbours?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaQ.appealId,
									data.lpaQ.documents.lettersToNeighbours,
									buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaQ.lpaNotificationMethods.some(
			(/** @type {{ name: string; }} */ method) => method.name === 'Advertisement'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaQ.pressAdvert = {
			display: {
				summaryListItem: {
					key: {
						text: 'Advertisement'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaQ.appealId,
							data.lpaQ.documents.pressAdvert
						)
					},
					actions: {
						items: [
							{
								text: data.lpaQ.documents.pressAdvert?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaQ.appealId,
									data.lpaQ.documents.pressAdvert,
									buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaQ.hasRepresentationsFromOtherParties = {
		display: {
			summaryListItem: {
				key: {
					text: 'Representations from other parties'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.hasRepresentationsFromOtherParties) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/has-representations-from-other-parties`
						}
					]
				}
			}
		}
	};

	if (data.lpaQ.hasRepresentationsFromOtherParties) {
		/** @type {Instructions} */
		mappedData.lpaQ.representations = {
			display: {
				summaryListItem: {
					key: {
						text: 'Representations from other parties documents'
					},
					value: {
						html: displayFormatter.formatDocumentValues(
							data.lpaQ.appealId,
							data.lpaQ.documents.representations
						)
					},
					actions: {
						items: [
							{
								text: data.lpaQ.documents.representations?.documents?.length > 0 ? 'Change' : 'Add',
								href: displayFormatter.formatDocumentActionLink(
									data.lpaQ.appealId,
									data.lpaQ.documents.representations,
									buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	/** @type {Instructions} */
	mappedData.lpaQ.officersReport = {
		display: {
			summaryListItem: {
				key: {
					text: "Planning officer's report"
				},
				value: {
					html: displayFormatter.formatDocumentValues(
						data.lpaQ.appealId,
						data.lpaQ.documents.officersReport
					)
				},
				actions: {
					items: [
						{
							text: data.lpaQ.documents.officersReport?.documents?.length > 0 ? 'Change' : 'Add',
							href: displayFormatter.formatDocumentActionLink(
								data.lpaQ.appealId,
								data.lpaQ.documents.officersReport,
								buildDocumentUploadUrlTemplate(data.lpaQ.lpaQuestionnaireId)
							)
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.siteAccess = {
		display: {
			summaryListItem: {
				key: {
					text: 'Site access required'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.doesSiteRequireInspectorAccess) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/does-site-require-inspector-access`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.isAffectingNeighbouringSites = {
		display: {
			summaryListItem: {
				key: {
					text: 'Affects neighbouring sites'
				},
				value: {
					text: convertFromBooleanToYesNo(data.lpaQ.isAffectingNeighbouringSites) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/is-affecting-neighbouring-sites`
						}
					]
				}
			}
		}
	};

	if (data.lpaQ.neighbouringSiteContacts && data.lpaQ.neighbouringSiteContacts.length > 0) {
		mappedData.lpaQ.neighbouringSite = [];
		for (let i = 0; i < data.lpaQ.neighbouringSiteContacts.length; i++) {
			mappedData.lpaQ.neighbouringSite.push({
				display: {
					summaryListItem: {
						key: {
							text: `Neighbour ${i + 1}`
						},
						value: {
							html: addressToString(data.lpaQ.neighbouringSiteContacts[i].address)
						},
						actions: {
							items: [
								{
									text: 'Change',
									href: `${currentRoute}/change/neighbouring-site-address-${i}`
								}
							]
						}
					}
				}
			});
		}
	}

	/** @type {Instructions} */
	mappedData.lpaQ.lpaHealthAndSafety = {
		display: {
			summaryListItem: {
				key: {
					text: 'Potential safety risks'
				},
				value: {
					html: displayFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.lpaQ.doesSiteHaveHealthAndSafetyIssues) || '',
						data.lpaQ.healthAndSafetyDetails
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/health-and-safety`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.otherAppeals = {
		display: {
			summaryListItem: {
				key: {
					text: 'Appeals near the site'
				},
				value: {
					html: displayFormatter.formatListOfAppeals(data.lpaQ.otherAppeals) || 'No other appeals'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/other-appeals`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.lpaQ.newConditions = {
		display: {
			summaryListItem: {
				key: {
					text: 'Extra conditions'
				},
				value: {
					html: displayFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.lpaQ.hasExtraConditions) || '',
						data.lpaQ.extraConditions
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/extra-conditions`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.lpaQ.reviewOutcome = {
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Questionnaire review outcome'
				},
				value: {
					text: data.lpaQ.validation?.outcome || 'Not yet reviewed'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `/appeals-service/appeal-details/${data.lpaQ.appealId}/lpa-questionnaire/${data.lpaQ.lpaQuestionnaireId}`
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
				value: data.lpaQ.validation?.outcome || null,
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

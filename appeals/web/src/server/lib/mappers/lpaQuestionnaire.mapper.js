import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { addressToString } from '#lib/address-formatter.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';
import { conditionalFormatter, mapAddressInput } from './global-mapper-formatter.js';
import { isFolderInfo } from '#lib/ts-utilities.js';

/**
 * @typedef StatusTag
 * @type {object}
 * @property {string} status
 * @property {string} classes
 */

/**
 * @typedef {import('@pins/appeals.api').Appeals.FolderInfo} FolderInfo
 * @typedef {import('@pins/appeals.api').Appeals.DocumentInfo} DocumentInfo
 */

/**
 * @param {import("#appeals/appeal-details/appeal-details.types.js").SingleLPAQuestionnaireResponse} data
 * @param {string} currentRoute
 * @returns {{lpaq: MappedInstructions}}
 */
export function initialiseAndMapLPAQData(data, currentRoute) {
	/** @type {{lpaq: MappedInstructions}} */
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
					text: convertFromBooleanToYesNo(data.isListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Listed building',
							href: `${currentRoute}/change-lpa-questionnaire/is-listed-building`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Is listed building',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'isListedBuilding',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.isListedBuilding || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.isListedBuilding
							}
						]
					}
				}
			]
		}
	};

	if (data.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaq.listedBuildingDetails = {
			id: 'listed-building-details',
			display: {
				summaryListItem: {
					key: {
						text: 'Listed building details'
					},
					value: {
						html: displayPageFormatter.formatListOfListedBuildingNumbers(data.listedBuildingDetails)
					},
					actions: {
						items: [
							{
								text: 'Change',
								visuallyHiddenText: 'Listed building details',
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
					text: convertFromBooleanToYesNo(data.doesAffectAListedBuilding) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Affects a listed building',
							href: `${currentRoute}/change-lpa-questionnaire/does-affect-a-listed-building`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Affects a listed building',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'doesAffectAListedBuilding',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.isListedBuilding || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.isListedBuilding
							}
						]
					}
				}
			]
		}
	};

	if (data.isListedBuilding) {
		/** @type {Instructions} */
		mappedData.lpaq.affectsListedBuildingDetails = {
			id: 'affects-listed-building-details',
			display: {
				summaryListItem: {
					key: {
						text: 'Affected listed building details'
					},
					value: {
						html: displayPageFormatter.formatListOfListedBuildingNumbers(
							data.affectsListedBuildingDetails
						)
					},
					actions: {
						items: [
							{
								text: 'Change',
								visuallyHiddenText: 'Affects listed building details',
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
					html: convertFromBooleanToYesNo(data.doesAffectAScheduledMonument) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Affects a scheduled monument',
							href: `${currentRoute}/change-lpa-questionnaire/affects-scheduled-monument`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Affects a scheduled monument',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'affectsAScheduledMonument',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.doesAffectAScheduledMonument || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.doesAffectAScheduledMonument
							}
						]
					}
				}
			]
		}
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
					html: convertFromBooleanToYesNo(data.isCorrectAppealType) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Correct appeal type',
							href: `${currentRoute}/change-lpa-questionnaire/is-correct-appeal-type`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Is correct appeal type',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'isCorrectAppealType',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.doesAffectAScheduledMonument || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.doesAffectAScheduledMonument
							}
						]
					}
				}
			]
		}
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
					text: convertFromBooleanToYesNo(data.inCAOrrelatesToCA) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Conservation area',
							href: `${currentRoute}/change-lpa-questionnaire/in-or-relates-to-ca`
						}
					]
				}
			}
		},
		input: {
			displayName: 'In or relates to conservation area',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'inOrRelatesToCa',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.inCAOrrelatesToCA || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.inCAOrrelatesToCA
							}
						]
					}
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.conservationAreaMap = {
		id: 'conservation-area-map',
		display: {
			summaryListItem: {
				key: {
					text: 'Conservation area map and guidance'
				},
				value: displayPageFormatter.formatDocumentValues(
					data.appealId,
					isFolderInfo(data.documents.conservationAreaMap)
						? data.documents.conservationAreaMap.documents
						: []
				),
				actions: {
					items: [
						...((isFolderInfo(data.documents.conservationAreaMap)
							? data.documents.conservationAreaMap.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'Conservation area map and guidance',
										href: mapDocumentManageUrl(
											data.appealId,
											data.lpaQuestionnaireId,
											isFolderInfo(data.documents.conservationAreaMap)
												? data.documents.conservationAreaMap.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'Conservation area map and guidance',
							href: displayPageFormatter.formatDocumentActionLink(
								data.appealId,
								data.documents.conservationAreaMap,
								buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
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
					text: convertFromBooleanToYesNo(data.siteWithinGreenBelt) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Green belt',
							href: `${currentRoute}/change-lpa-questionnaire/site-within-green-belt`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Site within green belt',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'siteWithinGreenBelt',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.siteWithinGreenBelt || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.siteWithinGreenBelt
							}
						]
					}
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.notifyingParties = {
		id: 'notifying-parties',
		display: {
			summaryListItem: {
				key: {
					text: 'Who was notified'
				},
				value: displayPageFormatter.formatDocumentValues(
					data.appealId,
					isFolderInfo(data.documents.notifyingParties)
						? data.documents.notifyingParties.documents
						: []
				),
				actions: {
					items: [
						...((isFolderInfo(data.documents.notifyingParties)
							? data.documents.notifyingParties.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: 'Who was notified',
										href: mapDocumentManageUrl(
											data.appealId,
											data.lpaQuestionnaireId,
											isFolderInfo(data.documents.notifyingParties)
												? data.documents.notifyingParties.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: 'Who was notified',
							href: displayPageFormatter.formatDocumentActionLink(
								data.appealId,
								data.documents.notifyingParties,
								buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
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
					html: displayPageFormatter.formatListOfNotificationMethodsToHtml(
						data.lpaNotificationMethods
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Notification methods',
							href: `${currentRoute}/change-lpa-questionnaire/notification-methods`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Notification methods',
			instructions: [
				{
					type: 'checkboxes',
					properties: {
						name: 'notification-methods',
						items: [
							{
								value: '1017',
								text: 'A site notice',
								checked: data.lpaNotificationMethods?.some(
									(value) => value.name === 'A site notice'
								)
							},
							{
								value: '1018',
								text: 'Letters or emails to interested parties',
								checked: data.lpaNotificationMethods?.some(
									(value) => value.name === 'Letter/email to interested parties'
								)
							},
							{
								value: '1019',
								text: 'An advert in the local press',
								checked: data.lpaNotificationMethods?.some(
									(value) => value.name === 'A press advert'
								)
							}
						]
					}
				}
			]
		}
	};

	if (
		data.lpaNotificationMethods?.some(
			(/** @type {{ name: string; }} */ method) => method.name === 'A site notice'
		)
	) {
		/** @type {Instructions} */
		mappedData.lpaq.siteNotices = {
			id: 'site-notices',
			display: {
				summaryListItem: {
					key: {
						text: 'Site notice'
					},
					value: displayPageFormatter.formatDocumentValues(
						data.appealId,
						isFolderInfo(data.documents.siteNotices) ? data.documents.siteNotices.documents : []
					),
					actions: {
						items: [
							...((isFolderInfo(data.documents.siteNotices)
								? data.documents.siteNotices.documents
								: []
							).length
								? [
										{
											text: 'Manage',
											visuallyHiddenText: 'Site notice',
											href: mapDocumentManageUrl(
												data.appealId,
												data.lpaQuestionnaireId,
												isFolderInfo(data.documents.siteNotices)
													? data.documents.siteNotices.folderId
													: undefined
											)
										}
								  ]
								: []),
							{
								text: 'Add',
								visuallyHiddenText: 'Site notice',
								href: displayPageFormatter.formatDocumentActionLink(
									data.appealId,
									data.documents.siteNotices,
									buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaNotificationMethods?.some(
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
					value: displayPageFormatter.formatDocumentValues(
						data.appealId,
						isFolderInfo(data.documents.lettersToNeighbours)
							? data.documents.lettersToNeighbours.documents
							: []
					),
					actions: {
						items: [
							...((isFolderInfo(data.documents.lettersToNeighbours)
								? data.documents.lettersToNeighbours.documents
								: []
							).length
								? [
										{
											text: 'Manage',
											visuallyHiddenText: 'Letter or email to interested parties',
											href: mapDocumentManageUrl(
												data.appealId,
												data.lpaQuestionnaireId,
												isFolderInfo(data.documents.lettersToNeighbours)
													? data.documents.lettersToNeighbours.folderId
													: undefined
											)
										}
								  ]
								: []),
							{
								text: 'Add',
								visuallyHiddenText: 'Letter or email to interested parties',
								href: displayPageFormatter.formatDocumentActionLink(
									data.appealId,
									data.documents.lettersToNeighbours,
									buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
								)
							}
						]
					}
				}
			}
		};
	}

	if (
		data.lpaNotificationMethods?.some(
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
					value: displayPageFormatter.formatDocumentValues(
						data.appealId,
						isFolderInfo(data.documents.pressAdvert) ? data.documents.pressAdvert.documents : []
					),
					actions: {
						items: [
							{
								text:
									(isFolderInfo(data.documents.lettersToNeighbours)
										? data.documents.lettersToNeighbours.documents
										: []
									).length > 0
										? 'Change'
										: 'Add',
								visuallyHiddenText: 'Advertisement',
								href: displayPageFormatter.formatDocumentActionLink(
									data.appealId,
									data.documents.pressAdvert,
									buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
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
					text: convertFromBooleanToYesNo(data.hasRepresentationsFromOtherParties) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Representations from other parties',
							href: `${currentRoute}/change-lpa-questionnaire/has-representations-from-other-parties`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Has representations from other parties',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'hasRepresentationsFromOtherParties',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.hasRepresentationsFromOtherParties || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.hasRepresentationsFromOtherParties
							}
						]
					}
				}
			]
		}
	};

	if (data.hasRepresentationsFromOtherParties) {
		/** @type {Instructions} */
		mappedData.lpaq.representations = {
			id: 'representations-from-other-parties',
			display: {
				summaryListItem: {
					key: {
						text: 'Representations from other parties documents'
					},
					value: displayPageFormatter.formatDocumentValues(
						data.appealId,
						isFolderInfo(data.documents.representations)
							? data.documents.representations.documents
							: []
					),
					actions: {
						items: [
							...((isFolderInfo(data.documents.representations)
								? data.documents.representations.documents
								: []
							).length
								? [
										{
											text: 'Manage',
											visuallyHiddenText: 'Representations from other parties documents',
											href: mapDocumentManageUrl(
												data.appealId,
												data.lpaQuestionnaireId,
												isFolderInfo(data.documents.representations)
													? data.documents.representations.folderId
													: undefined
											)
										}
								  ]
								: []),
							{
								text: 'Add',
								visuallyHiddenText: 'Representations from other parties documents',
								href: displayPageFormatter.formatDocumentActionLink(
									data.appealId,
									data.documents.representations,
									buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
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
				value: displayPageFormatter.formatDocumentValues(
					data.appealId,
					isFolderInfo(data.documents.officersReport) ? data.documents.officersReport.documents : []
				),
				actions: {
					items: [
						...((isFolderInfo(data.documents.officersReport)
							? data.documents.officersReport.documents
							: []
						).length
							? [
									{
										text: 'Manage',
										visuallyHiddenText: "Planning officer's report",
										href: mapDocumentManageUrl(
											data.appealId,
											data.lpaQuestionnaireId,
											isFolderInfo(data.documents.officersReport)
												? data.documents.officersReport.folderId
												: undefined
										)
									}
							  ]
							: []),
						{
							text: 'Add',
							visuallyHiddenText: "Planning officer's report",
							href: displayPageFormatter.formatDocumentActionLink(
								data.appealId,
								data.documents.officersReport,
								buildDocumentUploadUrlTemplate(data.lpaQuestionnaireId)
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
					text: convertFromBooleanToYesNo(data.doesSiteRequireInspectorAccess) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Site access required',
							href: `${currentRoute}/change-lpa-questionnaire/does-site-require-inspector-access`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Does site require inspector access',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'doesSiteRequireInspectorAccess',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.doesSiteRequireInspectorAccess || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.doesSiteRequireInspectorAccess
							}
						]
					}
				}
			]
		}
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
					text: convertFromBooleanToYesNo(data.isAffectingNeighbouringSites) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Affects neighbouring sites',
							href: `${currentRoute}/change-lpa-questionnaire/is-affecting-neighbouring-sites`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Is affecting neighbouring sites',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'isAffectingNeighbouringSites',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: data.isAffectingNeighbouringSites || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.isAffectingNeighbouringSites
							}
						]
					}
				}
			]
		}
	};

	if (data.neighbouringSiteContacts && data.neighbouringSiteContacts.length > 0) {
		for (let i = 0; i < data.neighbouringSiteContacts.length; i++) {
			mappedData.lpaq[`neighbouringSiteAddress${i}`] = {
				id: `neighbouring-site-address-${i}`,
				display: {
					summaryListItem: {
						key: {
							text: `Neighbour address ${i + 1}`
						},
						value: {
							html: addressToString(data.neighbouringSiteContacts[i].address)
						},
						actions: {
							items: [
								{
									text: 'Change',
									visuallyHiddenText: `Neighbour address ${i + 1}`,
									href: `${currentRoute}/change-lpa-questionnaire/neighbouring-site-address-${i}`
								}
							]
						}
					}
				},
				input: {
					displayName: `Neighbour address ${i + 1}`,
					instructions: mapAddressInput(data.neighbouringSiteContacts[i].address)
				}
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
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.doesSiteHaveHealthAndSafetyIssues) || '',
						data.healthAndSafetyDetails
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Potential safety risks',
							href: `${currentRoute}/change-lpa-questionnaire/health-and-safety`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Health and safety',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'healthAndSafety',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'health-and-safety-text',
									'healthAndSafetyText',
									'Tell us why the inspector will need to enter the appeal site',
									displayPageFormatter.nullToEmptyString(data.healthAndSafetyDetails)
								),
								checked: data.doesSiteHaveHealthAndSafetyIssues || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.doesSiteHaveHealthAndSafetyIssues
							}
						]
					}
				}
			]
		}
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
					html: displayPageFormatter.formatListOfAppeals(data.otherAppeals) || 'No other appeals'
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Appeals near the site',
							href: `${currentRoute}/change-lpa-questionnaire/other-appeals`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Other appeals',
			instructions: [
				{
					type: 'input',
					properties: {
						id: 'other-appeals',
						name: 'otherAppeals',
						value: displayPageFormatter.nullToEmptyString(data.otherAppeals),
						label: {
							text: 'What appeals are the other associated with this appeal?'
						}
					}
				}
			]
		}
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
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.hasExtraConditions) || '',
						data.extraConditions
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'Extra conditions',
							href: `${currentRoute}/change-lpa-questionnaire/extra-conditions`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Extra conditions',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'extraConditions',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'extra-conditions-text',
									'extraConditionsText',
									'Tell us about the new conditions',
									displayPageFormatter.nullToEmptyString(data.extraConditions)
								),
								checked: data.hasExtraConditions || false
							},
							{
								text: 'No',
								value: 'no',
								checked: !data.hasExtraConditions
							}
						]
					}
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.lpaq.additionalDocuments = {
		id: 'additional-documents',
		display: {
			...((isFolderInfo(data.documents.additionalDocuments)
				? data.documents.additionalDocuments.documents
				: []
			).length > 0
				? {
						summaryListItems: (isFolderInfo(data.documents.additionalDocuments)
							? data.documents.additionalDocuments.documents
							: []
						).map((/** @type {DocumentInfo} */ document) => ({
							key: {
								text: 'Additional documents',
								classes: 'govuk-visually-hidden'
							},
							value: displayPageFormatter.formatDocumentValues(
								data.appealId,
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
	mappedData.lpaq.reviewOutcome = {
		id: 'review-outcome',
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Questionnaire review outcome'
				},
				value: {
					text: data.validation?.outcome || 'Not yet reviewed'
				},
				actions: {
					items: [
						{
							text: 'Change',
							visuallyHiddenText: 'LPA Questionnaire review outcome',
							href: `/appeals-service/appeal-details/${data.appealId}/lpa-questionnaire/${data.lpaQuestionnaireId}`
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
						name: 'review-outcome',
						value: data.validation?.outcome,
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
				}
			]
		}
	};

	return mappedData;
}

/**
 * @param {string|number} lpaQuestionnaireId
 * @returns {string}
 */
export const buildDocumentUploadUrlTemplate = (lpaQuestionnaireId) => {
	return `/appeals-service/appeal-details/{{appealId}}/lpa-questionnaire/${lpaQuestionnaireId}/add-documents/{{folderId}}/{{documentId}}`;
};

/**
 *
 * @param {Number} caseId
 * @param {string|number} lpaQuestionnaireId
 * @param {number|undefined} folderId
 * @returns {string}
 */
export const mapDocumentManageUrl = (caseId, lpaQuestionnaireId, folderId) => {
	if (folderId === undefined) {
		return '';
	}
	return `/appeals-service/appeal-details/${caseId}/lpa-questionnaire/${lpaQuestionnaireId}/manage-documents/${folderId}/`;
};

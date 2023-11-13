import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { addressToString } from '#lib/address-formatter.js';
import { dateToDisplayDate } from '#lib/dates.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';
import usersService from '../../appeals/appeal-users/users-service.js';
import config from '#environment/config.js';
import { surnameFirstToFullName } from '#lib/person-name-formatter.js';
import {
	conditionalFormatter,
	dateAndTimeFormatter,
	mapAddressInput
} from './global-mapper-formatter.js';
import { convert24hTo12hTimeStringFormat } from '#lib/times.js';

// TODO: Limit the input types to constants
/**
 * @typedef {object} ComponentType
 * @property {string} type
 */

/**
 * @typedef MappedAppealInstructions
 * @type {object}
 * @property {AppealInstructionCollection} appeal
 */

/**
 * @typedef AppealInstructionCollection
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
 * @property {string} [inputItemApi]
 */
/**
 * @typedef DisplayInstructions
 * Display Instructions
 * @type {object}
 * @property {SummaryListRowProperties} [summaryListItem] To create a row in a summary list
 * @property {StatusTag} [statusTag] To create a Status Tag
 * @property {TableCellProperties[]} [tableItem] To create a table row
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
 * @param {import('../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<MappedAppealInstructions>}
 */
export async function initialiseAndMapAppealData(data, currentRoute, session) {
	if (data === undefined) {
		throw new Error('Data is undefined');
	}

	if (data.appeal === undefined) {
		data = { appeal: data };
	}
	currentRoute =
		currentRoute[currentRoute.length - 1] === '/' ? currentRoute.slice(0, -1) : currentRoute;

	/** @type {MappedAppealInstructions} */
	let mappedData = {};
	mappedData.appeal = {};
	/** @type {Instructions} */
	mappedData.appeal.appealType = {
		id: 'appeal-type',
		display: {
			summaryListItem: {
				key: {
					text: 'Appeal type'
				},
				value: {
					text: data.appeal.appealType || 'No appeal type'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/appeal-type`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				name: 'appeal-type',
				fieldset: {
					legend: {
						text: 'Appeal Type',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						value: '1013',
						text: 'Householder planning',
						checked:
							displayPageFormatter.nullToEmptyString(data.appeal.appealType) === 'Householder'
					}
					// TODO: Add further appeal types here as they are required (S78, CAS, etc...)
				]
			}
		],
		submitApi: '#',
		inputItemApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.caseProcedure = {
		id: 'case-procedure',
		display: {
			summaryListItem: {
				key: {
					text: 'Case Procedure'
				},
				value: {
					text: data.appeal.procedureType || `No case procedure`
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/case-procedure`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'checkbox',
				name: 'case-procedure',
				fieldset: {
					legend: {
						text: 'Case Procedure',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				value: data.appeal.procedureType,
				items: [
					{
						value: '3',
						text: 'Written Representation',
						hint: {
							text: 'For appeals where the issues are clear from written statements and a site visit. This is the quickest and most common way to make an appeal.'
						},
						checked: data.appeal.procedureType === 'Written'
					},
					{
						value: '1',
						text: 'Hearing',
						hint: {
							text: 'For appeals with more complex issues. The Inspector leads a discussion to answer questions they have about the appeal.'
						},
						checked: data.appeal.procedureType === 'Hearing'
					},
					{
						value: '2',
						text: 'Inquiry',
						hint: {
							text: 'For appeals with very complex issues. Appeal evidence is tested by legal representatives, who question witnesses under oath.'
						},
						checked: data.appeal.procedureType === 'Inquiry'
					}
				]
			}
		],
		submitApi: `/appeals/${data.appeal.appealId}/lpa-questionnaire/${data.appeal.lpaQuestionnaireId}`,
		inputItemApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantName = {
		id: 'appellant-name',
		display: {
			summaryListItem: {
				key: {
					text: 'Appellant name'
				},
				value: {
					text: data.appeal.appellantName || 'No applicant for this appeal'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/appellant-name`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'field-set',
				legend: {
					text: "What is the appellant's name?",
					isPageHeading: true,
					classes: 'govuk-fieldset__legend--l'
				}
			},
			{
				type: 'text-input',
				id: 'appellant-name',
				name: 'appellantName',
				value: displayPageFormatter.nullToEmptyString(data.appeal.appellantName),
				label: {
					text: 'Fullname',
					isPageHeading: false
				}
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.agentName = {
		id: 'agent-name',
		display: {
			summaryListItem: {
				key: {
					text: 'Agent name'
				},
				value: {
					text: data.appeal.agentName || 'No agent for this appeal'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/agent-name`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'field-set',
				legend: {
					text: "What is the agent's name?",
					isPageHeading: true,
					classes: 'govuk-fieldset__legend--l'
				}
			},
			{
				type: 'text-input',
				id: 'agent-name',
				name: 'agentName',
				value: displayPageFormatter.nullToEmptyString(data.appeal.agentName),
				label: {
					text: 'Fullname',
					isPageHeading: true
				}
			}
		],
		submitApi: '#'
	};
	// TODO: Need a decision on how the linked appeals change page looks
	/** @type {Instructions} */
	mappedData.appeal.linkedAppeals = {
		id: 'linked-appeals',
		display: {
			summaryListItem: {
				key: {
					text: 'Linked Appeals'
				},
				value: {
					html:
						displayPageFormatter.formatListOfAppeals(data.appeal.linkedAppeals) ||
						'No linked appeals'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/linked-appeals`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'text-input',
				id: 'linked-appeals',
				name: 'linkedAppeals',
				value: displayPageFormatter.nullToEmptyString(data.appeal.linkedAppeals),
				label: {
					text: 'What appeals are linked to this appeal?'
				}
			}
		],
		submitApi: '#'
	};
	// TODO: Need a decision on how the other appeals change page looks
	/** @type {Instructions} */
	mappedData.appeal.otherAppeals = {
		id: 'other-appeals',
		display: {
			summaryListItem: {
				key: {
					text: 'Other Appeals'
				},
				value: {
					html:
						displayPageFormatter.formatListOfAppeals(data.appeal.otherAppeals) ||
						'<span>No other appeals</span>'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/other-appeals`
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
				value: displayPageFormatter.nullToEmptyString(data.appeal.otherAppeals),
				label: {
					text: 'What appeals are the other associated with this appeal?'
				}
			}
		],
		submitApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.allocationDetails = {
		id: 'allocation-details',
		display: {
			summaryListItem: {
				key: {
					text: 'Allocation details'
				},
				value: {
					html: data.appeal.allocationDetails
						? `
						Level: ${data.appeal.allocationDetails.level}<br />
						Band: ${data.appeal.allocationDetails.band}<br />
						Specialisms:
						<ul class="govuk-!-margin-0"><li>${data.appeal.allocationDetails.specialisms.join(
							'</li><li>'
						)}</li></ul>
					`
						: 'No allocation details for this appeal'
				},
				actions: {
					items: [
						{
							text: data.appeal.allocationDetails ? 'Change' : 'Add',
							href: `${currentRoute}/allocation-details/allocation-level`
						}
					]
				}
			}
		},
		input: [
			//TODO: Multipage change
			{
				type: 'checkbox',
				id: 'allocation-details',
				name: 'allocationDetails',
				fieldset: {
					legend: {
						text: 'Case Procedure',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				value: data.appeal.procedureType,
				items: [
					{
						value: '3',
						text: 'Written Representation',
						hint: {
							text: 'For appeals where the issues are clear from written statements and a site visit. This is the quickest and most common way to make an appeal.'
						},
						checked: data.appeal.procedureType === 'Written'
					},
					{
						value: '1',
						text: 'Hearing',
						hint: {
							text: 'For appeals with more complex issues. The Inspector leads a discussion to answer questions they have about the appeal.'
						},
						checked: data.appeal.procedureType === 'Hearing'
					},
					{
						value: '2',
						text: 'Inquiry',
						hint: {
							text: 'For appeals with very complex issues. Appeal evidence is tested by legal representatives, who question witnesses under oath.'
						},
						checked: data.appeal.procedureType === 'Inquiry'
					}
				]
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaReference = {
		id: 'lpa-reference',
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Reference'
				},
				value: {
					text: data.appeal.appealReference || 'No LPA reference for this appeal'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/lpa-reference`
						}
					]
				}
			}
		}
	};
	// TODO: Add radio options
	/** @type {Instructions} */
	mappedData.appeal.decision = {
		id: 'decision',
		display: {
			summaryListItem: {
				key: {
					text: 'Decision'
				},
				value: {
					text: data.appeal.decision || 'Not issued yet'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/decision`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'decision',
				name: 'appealDecision',
				fieldset: {
					legend: {
						text: 'What was the decision for the appeal?',
						isPageHeading: true
					}
				},
				value: displayPageFormatter.nullToEmptyString(data.appeal.decision),
				items: [
					{
						text: '####',
						value: '#'
					}
				]
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.siteAddress = {
		id: 'site-address',
		display: {
			summaryListItem: {
				key: {
					text: 'Site Address'
				},
				value: {
					text: addressToString(data.appeal.appealSite)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/site-address`
						}
					]
				}
			}
		},
		input: mapAddressInput('What is the site address?', data.appeal.appealSite)
	};

	/** @type {Instructions} */
	mappedData.appeal.localPlanningAuthority = {
		id: 'local-planning-department',
		display: {
			summaryListItem: {
				key: {
					text: 'Local planning authority'
				},
				value: {
					text: data.appeal.localPlanningDepartment
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/local-planning-department`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.appealStatus = {
		id: 'appeal-status',
		display: {
			summaryListItem: {
				key: {
					text: 'Appeal Status'
				},
				value: {
					text: data.appeal.appealStatus
				}
			},
			statusTag: {
				status: data.appeal.appealStatus,
				classes: 'govuk-!-margin-bottom-4'
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaInspectorAccess = {
		id: 'lpa-inspector-access',
		display: {
			summaryListItem: {
				key: {
					text: "Inspector access (LPA's answer)"
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.appeal.inspectorAccess.lpaQuestionnaire.isRequired) ||
							'No answer provided',
						data.appeal.inspectorAccess.lpaQuestionnaire.details
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/lpa-inspector-access/`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'lpa-inspector-access',
				name: 'lpaInspectorAccess',
				fieldset: {
					legend: {
						text: 'Might the inspector need access to the appellant’s land or property (LPA)?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'lpa-inspector-access-text',
							'lpaInspectorAccessText',
							'Tell us why the inspector will need to enter the appeal site',
							displayPageFormatter.nullToEmptyString(
								data.appeal.inspectorAccess.lpaQuestionnaire.details
							)
						),
						checked: data.appeal.inspectorAccess.lpaQuestionnaire.isRequired
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.appeal.inspectorAccess.lpaQuestionnaire.isRequired
					}
				]
			}
		]
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantInspectorAccess = {
		id: 'appellant-case-inspector-access',
		display: {
			summaryListItem: {
				key: {
					text: "Inspector access (Appellant's answer)"
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.appeal.inspectorAccess.appellantCase.isRequired) ||
							'No answer provided',
						data.appeal.inspectorAccess.appellantCase.details
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/appellant-case-inspector-access`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'appellant-case-inspector-access',
				name: 'appellantCaseInspectorAccess',
				fieldset: {
					legend: {
						text: 'Might the inspector need access to the appellant’s land or property (Appellant)?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'appellant-case-inspector-access-text',
							'appellantCaseInspectorAccessText',
							'Tell us why the inspector will need to enter the appeal site',
							displayPageFormatter.nullToEmptyString(
								data.appeal.inspectorAccess.appellantCase.details
							)
						),
						checked: data.appeal.inspectorAccess.appellantCase.isRequired
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.appeal.inspectorAccess.appellantCase.isRequired
					}
				]
			}
		]
	};
	/** @type {Instructions} */
	mappedData.appeal.neighbouringSiteIsAffected = {
		id: 'neighbouring-site-is-affected',
		display: {
			summaryListItem: {
				key: {
					text: 'Could a neighbouring site be affected?'
				},
				value: {
					html:
						convertFromBooleanToYesNo(data.appeal.neighbouringSite.isAffected) ||
						'No answer provided'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/neighbouring-site-is-affected`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'neighbouring-site-is-affected',
				name: 'neighbouringSiteIsAffected',
				fieldset: {
					legend: {
						text: 'Could a neighbouring site be affected?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						checked: data.appeal.neighbouringSite.isAffected
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.appeal.neighbouringSite.isAffected
					}
				]
			}
		]
	};
	if (data.appeal.neighbouringSite.contacts && data.appeal.neighbouringSite.contacts.length > 0) {
		for (let i = 0; i < data.appeal.neighbouringSite.contacts.length; i++) {
			mappedData.appeal[`neighbouringSiteAddress${i}`] = {
				id: `neighbouring-site-address-${i}`,
				display: {
					summaryListItem: {
						key: {
							text: `Neighbour address ${i + 1}`
						},
						value: {
							html: addressToString(data.appeal.neighbouringSite.contacts[i].address)
						},
						actions: {
							items: [
								{
									text: 'Change',
									href: `${currentRoute}/change-appeal-details/neighbouring-site-address-${i}`
								}
							]
						}
					}
				},
				input: mapAddressInput(
					'What is the neighbours address?',
					data.appeal.neighbouringSite.contacts[i].address
				)
			};
		}
	}
	/** @type {Instructions} */
	mappedData.appeal.lpaHealthAndSafety = {
		id: 'lpa-health-and-safety',
		display: {
			summaryListItem: {
				key: {
					text: "Potential safety risks (LPA's answer)"
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.appeal.healthAndSafety.lpaQuestionnaire.hasIssues) ||
							'No answer provided',
						data.appeal.healthAndSafety.lpaQuestionnaire.details
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/lpa-health-and-safety`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'lpa-health-and-safety',
				name: 'lpaHealthAndSafety',
				fieldset: {
					legend: {
						text: 'Are there any health and safety concerns (LPA)?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'lpa-health-and-safety-text',
							'lpaHealthAndSafetyText',
							'Tell us why the inspector will need to enter the appeal site',
							displayPageFormatter.nullToEmptyString(
								data.appeal.healthAndSafety.lpaQuestionnaire.details
							)
						),
						checked: data.appeal.healthAndSafety.lpaQuestionnaire.hasIssues
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.appeal.healthAndSafety.lpaQuestionnaire.hasIssues
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.appeal.appellantHealthAndSafety = {
		id: 'appellant-case-health-and-safety',
		display: {
			summaryListItem: {
				key: {
					text: "Potential safety risks (Appellant's answer)"
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(data.appeal.healthAndSafety.appellantCase.hasIssues) ||
							'No answer provided',
						data.appeal.healthAndSafety.appellantCase.details
					)
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/appellant-case-health-and-safety`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				id: 'appellant-case-health-and-safety',
				name: 'appellantCaseHealthAndSafety',
				fieldset: {
					legend: {
						text: 'Are there any health and safety concerns (Appellant)?',
						isPageHeading: true,
						classes: 'govuk-fieldset__legend--l'
					}
				},
				items: [
					{
						text: 'Yes',
						value: 'yes',
						conditional: conditionalFormatter(
							'appellant-case-health-and-safety-text',
							'appellantCaseHealthAndSafetyText',
							'Tell us why the inspector will need to enter the appeal site',
							displayPageFormatter.nullToEmptyString(
								data.appeal.healthAndSafety.appellantCase.details
							)
						),
						checked: data.appeal.healthAndSafety.appellantCase.hasIssues
					},
					{
						text: 'No',
						value: 'no',
						checked: !data.appeal.healthAndSafety.appellantCase.hasIssues
					}
				]
			}
		]
	};

	/** @type {Instructions} */
	mappedData.appeal.visitType = {
		id: 'set-visit-type',
		display: {
			summaryListItem: {
				key: {
					text: 'Visit type'
				},
				value: {
					text: data.appeal.siteVisit.visitType
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/site-visit/${
								data.appeal.siteVisit?.visitType ? 'set-visit-type' : 'schedule-visit'
							}`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.startedAt = {
		id: 'start-date',
		display: {
			summaryListItem: {
				key: {
					text: 'Start date'
				},
				value: {
					html: dateToDisplayDate(data.appeal.startedAt) || ''
				},
				actions: {
					items: []
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaQuestionnaireDueDate = {
		id: 'lpa-questionnaire-due-date',
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Questionnaire'
				},
				value: {
					html:
						dateToDisplayDate(data.appeal.appealTimetable?.lpaQuestionnaireDueDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/appeal-timetables/lpa-questionnaire`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.statementReviewDueDate = {
		id: 'statement-review-due-date',
		display: {
			summaryListItem: {
				key: {
					text: 'Statement review due'
				},
				value: {
					html:
						dateToDisplayDate(data.appeal.appealTimetable?.statementReviewDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: data.appeal?.statementReviewDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/appeal-timetables/statement-review`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.finalCommentReviewDueDate = {
		id: 'final-comment-review-due-date',
		display: {
			summaryListItem: {
				key: {
					text: 'Final comment review due'
				},
				value: {
					html:
						dateToDisplayDate(data.appeal.appealTimetable?.finalCommentReviewDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: data.appeal?.finalCommentReviewDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/appeal-timetables/final-comment-review`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.siteVisitDate = {
		id: 'schedule-visit',
		display: {
			summaryListItem: {
				key: {
					text: 'Site visit'
				},
				value: {
					html:
						dateAndTimeFormatter(
							dateToDisplayDate(data.appeal.siteVisit?.visitDate),
							convert24hTo12hTimeStringFormat(data.appeal.siteVisit?.visitStartTime),
							convert24hTo12hTimeStringFormat(data.appeal.siteVisit?.visitEndTime)
						) || 'Visit date not yet set'
				},
				actions: {
					items: [
						{
							text: data.appeal.siteVisit?.visitDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/site-visit/schedule-visit`
						}
					]
				}
			}
		}
	};

	let caseOfficerRowValue = '';
	let caseOfficerUser;

	if (data.appeal.caseOfficer) {
		caseOfficerUser = await usersService.getUserByRoleAndId(
			config.referenceData.appeals.caseOfficerGroupId,
			session,
			data.appeal.caseOfficer
		);
		caseOfficerRowValue = caseOfficerUser
			? `<ul class="govuk-list"><li>${surnameFirstToFullName(caseOfficerUser?.name)}</li><li>${
					caseOfficerUser?.email
			  }</li></ul>`
			: '<p class="govuk-body">A case officer is assigned but their user account was not found';
	}

	/** @type {Instructions} */
	mappedData.appeal.caseOfficer = {
		id: 'case-officer',
		display: {
			summaryListItem: {
				key: {
					text: 'Case Officer'
				},
				value: {
					html: caseOfficerRowValue
				},
				actions: {
					items: [
						{
							text: data.appeal.caseOfficer ? 'Change' : 'Assign',
							href: `${currentRoute}/assign-user/case-officer`
						}
					]
				}
			}
		}
	};

	let inspectorRowValue = '';
	let inspectorUser;

	if (data.appeal.inspector) {
		inspectorUser = await usersService.getUserByRoleAndId(
			config.referenceData.appeals.inspectorGroupId,
			session,
			data.appeal.inspector
		);
		inspectorRowValue = inspectorUser
			? `<ul class="govuk-list"><li>${surnameFirstToFullName(inspectorUser?.name)}</li><li>${
					inspectorUser?.email
			  }</li></ul>`
			: '<p class="govuk-body">An inspector is assigned but their user account was not found';
	}

	/** @type {Instructions} */
	mappedData.appeal.inspector = {
		id: 'inspector',
		display: {
			summaryListItem: {
				key: {
					text: 'Inspector'
				},
				value: {
					html: inspectorRowValue
				},
				actions: {
					items: [
						{
							text: data.appeal.inspector ? 'Change' : 'Assign',
							href: `${currentRoute}/assign-user/inspector`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantCase = {
		id: 'appellant-case',
		display: {
			tableItem: [
				{
					text: 'Appellant Case'
				},
				{
					text: displayPageFormatter.mapDocumentStatus(
						data.appeal?.documentationSummary?.appellantCase?.status
					)
				},
				{
					text: dateToDisplayDate(data.appeal?.documentationSummary?.appellantCase?.dueDate)
				},
				{
					html:
						data.appeal?.documentationSummary?.appellantCase?.status !== 'not_received'
							? `<a href="${currentRoute}/appellant-case" class="govuk-link">Review</a>`
							: ''
				}
			]
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaQuestionnaire = {
		id: 'lpa-questionnaire',
		display: {
			tableItem: [
				{
					text: 'LPA Questionnaire'
				},
				{
					text: displayPageFormatter.mapDocumentStatus(
						data.appeal?.documentationSummary?.lpaQuestionnaire?.status
					)
				},
				{
					text: dateToDisplayDate(data.appeal?.documentationSummary?.lpaQuestionnaire?.dueDate)
				},
				{
					html:
						data.appeal?.documentationSummary?.lpaQuestionnaire?.status !== 'not_received'
							? `<a href="${currentRoute}/lpa-questionnaire/${data.appeal?.lpaQuestionnaireId}" class="govuk-link">Review</a>`
							: ''
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.issueDeterminationDate = {
		id: 'issue-determination',
		display: {
			summaryListItem: {
				key: {
					text: 'Issue Determination'
				},
				value: {
					html:
						dateToDisplayDate(data.appeal.appealTimetable?.issueDeterminationDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: data.appeal?.issueDeterminationDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/appeal-timetables/issue-determination`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.completeDate = {
		id: 'complete-date',
		display: {
			summaryListItem: {
				key: {
					text: 'Complete'
				},
				value: {
					html:
						dateToDisplayDate(data.appeal.appealTimetable?.completeDate) || 'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: data.appealTimetable?.completeDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/change-appeal-details/complete-date`
						}
					]
				}
			}
		}
	};

	return mappedData;
}

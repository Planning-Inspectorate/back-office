import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { addressToString } from '#lib/address-formatter.js';
import { dateToDisplayDate } from '#lib/dates.js';
import * as displayPageFormatter from '#lib/display-page-formatter.js';

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
 * @type {object}
 * @property {Instructions} appealType
 * @property {Instructions} caseProcedure
 * @property {Instructions} appellantName
 * @property {Instructions} agentName
 * @property {Instructions} linkedAppeals
 * @property {Instructions} otherAppeals
 * @property {Instructions} allocationDetails
 * @property {Instructions} lpaReference
 * @property {Instructions} decision
 * @property {Instructions} siteAddress
 * @property {Instructions} localPlanningAuthority
 * @property {Instructions} localPlanningAuthorities
 * @property {Instructions} appealStatus
 * @property {Instructions} lpaInspectorAccess
 * @property {Instructions} appellantInspectorAccess
 * @property {Instructions} neighbouringSiteIsAffected
 * @property {Instructions[]} neighbouringSite
 * @property {Instructions} lpaHealthAndSafety
 * @property {Instructions} appellantHealthAndSafety
 * @property {Instructions} visitType
 * @property {Instructions} startedAt
 * @property {Instructions} lpaQuestionnaireDueDate
 * @property {Instructions} statementReviewDueDate
 * @property {Instructions} finalCommentReviewDueDate
 * @property {Instructions} siteVisitDate
 * @property {Instructions} caseOfficer
 * @property {Instructions} inspector
 * @property {Instructions} appellantCase
 * @property {Instructions} lpaQuestionnaire
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
 * @returns {MappedAppealInstructions}
 */
export function initialiseAndMapAppealData(data, currentRoute) {
	/** @type {MappedAppealInstructions} */
	let mappedData = {};
	mappedData.appeal = {};
	/** @type {Instructions} */
	mappedData.appeal.appealType = {
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
							href: `${currentRoute}/change/appeal-type`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				name: 'appeal-type',
				value: displayPageFormatter.nullToEmptyString(data.appeal.appealType),
				items: [
					{
						value: 'full-planning',
						text: 'Full planning'
					},
					{
						value: 'householder-planning',
						text: 'Householder planning'
					},
					{
						value: 'outline-planning',
						text: 'Outline planning'
					},
					{
						value: 'prior-approval',
						text: 'Prior approval'
					},
					{
						value: 'reserved-matters',
						text: 'Reserved matters'
					},
					{
						value: 'removal-or-variation-of-conditions',
						text: 'Removal or variation of conditions'
					}
				]
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.caseProcedure = {
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
							href: `${currentRoute}/change/case-procedure`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				name: 'case-procedure',
				value: data.appeal.procedureType,
				items: [
					{
						value: 'written',
						text: 'Written Representation',
						hint: {
							text: 'For appeals where the issues are clear from written statements and a site visit. This is the quickest and most common way to make an appeal.'
						}
					},
					{
						value: 'hearing',
						text: 'Hearing',
						hint: {
							text: 'For appeals with more complex issues. The Inspector leads a discussion to answer questions they have about the appeal.'
						}
					},
					{
						value: 'inquiry',
						text: 'Inquiry',
						hint: {
							text: 'For appeals with very complex issues. Appeal evidence is tested by legal representatives, who question witnesses under oath.'
						}
					}
				]
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantName = {
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
							href: `${currentRoute}/change/appellant-name`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'text-input',
				id: 'appellant-name',
				name: 'appellantName',
				value: displayPageFormatter.nullToEmptyString(data.appeal.appellantName),
				label: {
					text: "What is the appellant's name?",
					isPageHeading: true
				}
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.agentName = {
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
							href: `${currentRoute}/change/agent-name`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'text-input',
				id: 'agent-name',
				name: 'agentName',
				value: displayPageFormatter.nullToEmptyString(data.appeal.agentName),
				label: {
					text: "What is the agent's name?",
					isPageHeading: true
				}
			}
		],
		submitApi: '#'
	};
	// TODO: Need a decision on how the linked appeals change page looks
	/** @type {Instructions} */
	mappedData.appeal.linkedAppeals = {
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
							href: `${currentRoute}/change/linked-appeals`
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
							href: `${currentRoute}/change/other-appeals`
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
	// TODO: Need to determine the input type (set to text-input as a default)
	/** @type {Instructions} */
	mappedData.appeal.allocationDetails = {
		display: {
			summaryListItem: {
				key: {
					text: 'Allocation details'
				},
				value: {
					text: data.appeal.allocationDetails
						? data.appeal.allocationDetails
						: 'No allocation details for this appeal'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/allocation-details`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'text-input',
				id: 'allocation-details',
				name: 'allocationDetails',
				label: {
					text: 'What are allocation details?',
					isPageHeading: true
				}
			}
		],
		submitApi: '#'
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaReference = {
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
							href: `${currentRoute}/change/lpa-reference`
						}
					]
				}
			}
		}
	};
	// TODO: Add radio options
	/** @type {Instructions} */
	mappedData.appeal.decision = {
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
							href: `${currentRoute}/change/decision`
						}
					]
				}
			}
		},
		input: [
			{
				type: 'radio',
				fieldset: {
					legend: {
						text: 'What was the decision for the appeal?',
						isPageHeading: true
					}
				},
				name: 'appealDecision',
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
							href: `${currentRoute}/change/site-address`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.localPlanningAuthority = {
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
							href: `${currentRoute}/change/local-planning-department`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.appealStatus = {
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
							href: `${currentRoute}/change/lpa-questionnaire/inspector-access/`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantInspectorAccess = {
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
							href: `${currentRoute}/change/appellant-case/inspector-access/`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.neighbouringSiteIsAffected = {
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
							href: `${currentRoute}/change/neighbouring-site-is-affected`
						}
					]
				}
			}
		}
	};
	if (data.appeal.neighbouringSite.contacts && data.appeal.neighbouringSite.contacts.length > 0) {
		mappedData.appeal.neighbouringSite = [];
		for (let i = 0; i < data.appeal.neighbouringSite.contacts.length; i++) {
			mappedData.appeal.neighbouringSite.push({
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
	mappedData.appeal.lpaHealthAndSafety = {
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
							href: `${currentRoute}/change/appellant-case/health-and-safety`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.appellantHealthAndSafety = {
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
							href: `${currentRoute}/change/lpa-questionnaire/health-and-safety`
						}
					]
				}
			}
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.visitType = {
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
		display: {
			summaryListItem: {
				key: {
					text: 'Start date'
				},
				value: {
					html: dateToDisplayDate(data.appeal.startedAt) || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change/start-date`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.lpaQuestionnaireDueDate = {
		display: {
			summaryListItem: {
				key: {
					text: 'LPA Questionnaire due'
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
							href: `${currentRoute}/change/lpa-questionnaire-due-date`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.statementReviewDueDate = {
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
							text: 'Change',
							href: `${currentRoute}/change/statement-review-due-date`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.finalCommentReviewDueDate = {
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
							text: 'Change',
							href: `${currentRoute}/change/final-comment-review-due-date`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.siteVisitDate = {
		display: {
			summaryListItem: {
				key: {
					text: 'Site visit'
				},
				value: {
					html: dateToDisplayDate(data.appeal.siteVisit?.visitDate) || 'Visit date not yet set'
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
	/** @type {Instructions} */
	mappedData.appeal.caseOfficer = {
		display: {
			summaryListItem: {
				key: {
					text: 'Case Officer'
				},
				value: {
					html: data.appeal.caseOfficer || 'No project members have been added yet'
				},
				actions: {
					items: [
						{
							text: data.appeal.caseOfficer ? 'Change' : 'Add',
							href: `${currentRoute}/change/case-officer`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.inspector = {
		display: {
			summaryListItem: {
				key: {
					text: 'Inspector'
				},
				value: {
					html: data.appeal.inspector || 'No project members have been added yet'
				},
				actions: {
					items: [
						{
							text: data.appeal.inspector ? 'Change' : 'Add',
							href: `${currentRoute}/change/inspector`
						}
					]
				}
			}
		}
	};
	/** @type {Instructions} */
	mappedData.appeal.appellantCase = {
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

	return mappedData;
}

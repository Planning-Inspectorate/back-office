import { convertFromBooleanToYesNo } from '../boolean-formatter.js';
import { appealSiteToAddressString } from '#lib/address-formatter.js';
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

/**
 * @param {import('#appeals/appeal-details/appeal-details.types.js').WebAppeal} appealDetails
 * @param {string} currentRoute
 * @param {import('../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<{appeal: MappedInstructions}>}
 */
export async function initialiseAndMapAppealData(appealDetails, currentRoute, session) {
	if (appealDetails === undefined) {
		throw new Error('appealDetails is undefined');
	}

	currentRoute =
		currentRoute[currentRoute.length - 1] === '/' ? currentRoute.slice(0, -1) : currentRoute;

	/** @type {{appeal: MappedInstructions}} */
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
					text: appealDetails.appealType || 'No appeal type'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-type/appeal-type`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Appeal type',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'appeal-type',
						items: [
							{
								value: '1013',
								text: 'Householder planning',
								checked:
									displayPageFormatter.nullToEmptyString(appealDetails.appealType) === 'Householder'
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
	mappedData.appeal.caseProcedure = {
		id: 'case-procedure',
		display: {
			summaryListItem: {
				key: {
					text: 'Case procedure'
				},
				value: {
					text: appealDetails.procedureType || `No case procedure`
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
		input: {
			displayName: 'Case procedure',
			instructions: [
				{
					type: 'checkboxes',
					properties: {
						name: 'case-procedure',
						items: [
							{
								value: '3',
								text: 'Written Representation',
								checked: appealDetails.procedureType === 'Written'
							},
							{
								value: '1',
								text: 'Hearing',
								checked: appealDetails.procedureType === 'Hearing'
							},
							{
								value: '2',
								text: 'Inquiry',
								checked: appealDetails.procedureType === 'Inquiry'
							}
						]
					}
				}
			]
		},
		submitApi: `/appeals/${appealDetails.appealId}/lpa-questionnaire/${appealDetails.lpaQuestionnaireId}`,
		inputItemApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.appellant = {
		id: 'appellant',
		display: {
			summaryListItem: {
				key: {
					text: 'Appellant'
				},
				value: {
					html: appealDetails.appellant
						? `${appealDetails.appellant?.firstName + ' ' || ''}${
								appealDetails.appellant?.lastName + '<br>' || ''
						  }${appealDetails.appellant?.email || ''}`
						: 'No appellant'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/appellant`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Appellant',
			instructions: [
				{
					type: 'input',
					properties: {
						id: 'appellant-firstName',
						name: 'appellant-firstName',
						value: displayPageFormatter.nullToEmptyString(appealDetails.appellant?.firstName),
						label: {
							text: 'First name',
							isPageHeading: false
						}
					}
				},
				{
					type: 'input',
					properties: {
						id: 'appellant-lastName',
						name: 'appellant-lastName',
						value: displayPageFormatter.nullToEmptyString(appealDetails.appellant?.lastName),
						label: {
							text: 'Last name',
							isPageHeading: false
						}
					}
				},
				{
					type: 'input',
					properties: {
						id: 'appellant-email',
						name: 'appellant-email',
						value: displayPageFormatter.nullToEmptyString(appealDetails.appellant?.email),
						label: {
							text: 'Email address',
							isPageHeading: false
						}
					}
				}
			]
		},
		submitApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.agent = {
		id: 'agent',
		display: {
			summaryListItem: {
				key: {
					text: 'Agent'
				},
				value: {
					html: appealDetails.agent
						? `${appealDetails.agent?.firstName + ' ' || ''}${
								appealDetails.agent?.lastName + '<br>' || ''
						  }${appealDetails.agent?.email || ''}`
						: 'No agent'
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/agent`
						}
					]
				}
			}
		},
		input: {
			displayName: 'Agent',
			instructions: [
				{
					type: 'input',
					properties: {
						id: 'agent-firstName',
						name: 'agent-firstName',
						value: displayPageFormatter.nullToEmptyString(appealDetails.agent?.firstName),
						label: {
							text: 'First name',
							isPageHeading: false
						}
					}
				},
				{
					type: 'input',
					properties: {
						id: 'agent-lastName',
						name: 'agent-lastName',
						value: displayPageFormatter.nullToEmptyString(appealDetails.agent?.lastName),
						label: {
							text: 'Last name',
							isPageHeading: false
						}
					}
				},
				{
					type: 'input',
					properties: {
						id: 'agent-email',
						name: 'agent-email',
						value: displayPageFormatter.nullToEmptyString(appealDetails.agent?.email),
						label: {
							text: 'Email address',
							isPageHeading: false
						}
					}
				}
			]
		},
		submitApi: '#'
	};

	// TODO: Need a decision on how the linked appeals change page looks
	/** @type {Instructions} */
	mappedData.appeal.linkedAppeals = {
		id: 'linked-appeals',
		display: {
			summaryListItem: {
				key: {
					text: 'Linked appeals'
				},
				value: {
					html:
						displayPageFormatter.formatListOfAppeals(appealDetails.linkedAppeals) ||
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
		input: {
			displayName: 'Linked appeals',
			instructions: [
				{
					type: 'input',
					properties: {
						id: 'linked-appeals',
						name: 'linkedAppeals',
						value: displayPageFormatter.nullToEmptyString(appealDetails.linkedAppeals),
						label: {
							text: 'What appeals are linked to this appeal?'
						}
					}
				}
			]
		},
		submitApi: '#'
	};

	// TODO: Need a decision on how the other appeals change page looks
	/** @type {Instructions} */
	mappedData.appeal.otherAppeals = {
		id: 'other-appeals',
		display: {
			summaryListItem: {
				key: {
					text: 'Related appeals'
				},
				value: {
					html: displayPageFormatter.formatListOfAppeals([]) || '<span>No related appeals</span>'
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
		input: {
			displayName: 'Related appeals',
			instructions: [
				{
					type: 'input',
					properties: {
						id: 'other-appeals',
						name: 'otherAppeals',
						value: displayPageFormatter.nullToEmptyString(appealDetails.otherAppeals),
						label: {
							text: 'What appeals are the other associated with this appeal?'
						}
					}
				}
			]
		},
		submitApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.allocationDetails = {
		id: 'allocation-details',
		display: {
			summaryListItem: {
				key: {
					text: 'Allocation level'
				},
				value: {
					html: appealDetails.allocationDetails
						? `
						Level: ${appealDetails.allocationDetails.level}<br />
						Band: ${appealDetails.allocationDetails.band}<br />
						Specialisms:
						<ul class="govuk-!-margin-0"><li>${appealDetails.allocationDetails.specialisms.join(
							'</li><li>'
						)}</li></ul>
					`
						: 'No allocation level for this appeal'
				},
				actions: {
					items: [
						{
							text: appealDetails.allocationDetails ? 'Change' : 'Add',
							href: `${currentRoute}/allocation-details/allocation-level`
						}
					]
				}
			}
		},
		input: {
			// TODO: Multipage change?
			displayName: 'Allocation level',
			instructions: [
				{
					type: 'checkboxes',
					properties: {
						name: 'allocationDetails',
						items: [
							{
								value: '3',
								text: 'Written Representation',
								hint: {
									text: 'For appeals where the issues are clear from written statements and a site visit. This is the quickest and most common way to make an appeal.'
								},
								checked: appealDetails.procedureType === 'Written'
							},
							{
								value: '1',
								text: 'Hearing',
								hint: {
									text: 'For appeals with more complex issues. The Inspector leads a discussion to answer questions they have about the appeal.'
								},
								checked: appealDetails.procedureType === 'Hearing'
							},
							{
								value: '2',
								text: 'Inquiry',
								hint: {
									text: 'For appeals with very complex issues. Appeal evidence is tested by legal representatives, who question witnesses under oath.'
								},
								checked: appealDetails.procedureType === 'Inquiry'
							}
						]
					}
				}
			]
		},
		submitApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.lpaReference = {
		id: 'lpa-reference',
		display: {
			summaryListItem: {
				key: {
					text: 'LPA reference'
				},
				value: {
					text: appealDetails.appealReference || 'No LPA reference for this appeal'
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
					text: appealDetails.decision?.outcome || 'Not issued yet'
				}
			}
		},
		input: {
			displayName: 'Decision',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'appealDecision',
						value: displayPageFormatter.nullToEmptyString(appealDetails.decision),
						items: [
							{
								text: '',
								value: '#'
							}
						]
					}
				}
			]
		},
		submitApi: '#'
	};

	/** @type {Instructions} */
	mappedData.appeal.siteAddress = {
		id: 'site-address',
		display: {
			summaryListItem: {
				key: {
					text: 'Site address'
				},
				value: {
					text: appealSiteToAddressString(appealDetails.appealSite)
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
		input: {
			instructions: mapAddressInput(appealDetails.appealSite)
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.localPlanningAuthority = {
		id: 'local-planning-authority',
		display: {
			summaryListItem: {
				key: {
					text: 'Planning authority'
				},
				value: {
					text: appealDetails.localPlanningDepartment
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/change-appeal-details/local-planning-authority`
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
					text: 'Appeal status'
				},
				value: {
					text: appealDetails.appealStatus
				}
			},
			statusTag: {
				status: appealDetails?.appealStatus || '',
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
					text: 'Inspection access (LPA answer)'
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(appealDetails.inspectorAccess.lpaQuestionnaire.isRequired) ||
							'No answer provided',
						appealDetails.inspectorAccess.lpaQuestionnaire.details
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
		input: {
			displayName: 'Inspection access (LPA answer)',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'lpaInspectorAccess',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'lpa-inspector-access-text',
									'lpaInspectorAccessText',
									'Tell us why the inspector will need to enter the appeal site',
									displayPageFormatter.nullToEmptyString(
										appealDetails.inspectorAccess.lpaQuestionnaire.details
									)
								),
								checked: appealDetails.inspectorAccess.lpaQuestionnaire.isRequired
							},
							{
								text: 'No',
								value: 'no',
								checked: !appealDetails.inspectorAccess.lpaQuestionnaire.isRequired
							}
						]
					}
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.appellantInspectorAccess = {
		id: 'appellant-case-inspector-access',
		display: {
			summaryListItem: {
				key: {
					text: 'Inspection access (appellant answer)'
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(appealDetails.inspectorAccess.appellantCase.isRequired) ||
							'No answer provided',
						appealDetails.inspectorAccess.appellantCase.details
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
		input: {
			displayName: 'Inspection access (appellant answer)',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'appellantCaseInspectorAccess',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'appellant-case-inspector-access-text',
									'appellantCaseInspectorAccessText',
									'Tell us why the inspector will need to enter the appeal site',
									displayPageFormatter.nullToEmptyString(
										appealDetails.inspectorAccess.appellantCase.details
									)
								),
								checked: appealDetails.inspectorAccess.appellantCase.isRequired
							},
							{
								text: 'No',
								value: 'no',
								checked: !appealDetails.inspectorAccess.appellantCase.isRequired
							}
						]
					}
				}
			]
		}
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
						convertFromBooleanToYesNo(appealDetails.neighbouringSite.isAffected) ||
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
		input: {
			displayName: 'Could a neighbouring site be affected?',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'neighbouringSiteIsAffected',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								checked: appealDetails.neighbouringSite.isAffected
							},
							{
								text: 'No',
								value: 'no',
								checked: !appealDetails.neighbouringSite.isAffected
							}
						]
					}
				}
			]
		}
	};

	if (
		appealDetails.neighbouringSite.contacts &&
		appealDetails.neighbouringSite.contacts.length > 0
	) {
		for (let i = 0; i < appealDetails.neighbouringSite.contacts.length; i++) {
			mappedData.appeal[`neighbouringSiteAddress${i}`] = {
				id: `neighbouring-site-address-${i}`,
				display: {
					summaryListItem: {
						key: {
							text: `Neighbour address ${i + 1}`
						},
						value: {
							html: appealSiteToAddressString(appealDetails.neighbouringSite.contacts[i].address)
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
				input: {
					instructions: mapAddressInput(appealDetails.neighbouringSite.contacts[i].address)
				}
			};
		}
	}

	/** @type {Instructions} */
	mappedData.appeal.lpaHealthAndSafety = {
		id: 'lpa-health-and-safety',
		display: {
			summaryListItem: {
				key: {
					text: 'Potential safety risks (LPA answer)'
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(appealDetails.healthAndSafety.lpaQuestionnaire.hasIssues) ||
							'No answer provided',
						appealDetails.healthAndSafety.lpaQuestionnaire.details
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
		input: {
			displayName: 'Potential safety risks (LPA answer)',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'lpaHealthAndSafety',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'lpa-health-and-safety-text',
									'lpaHealthAndSafetyText',
									'Tell us why the inspector will need to enter the appeal site',
									displayPageFormatter.nullToEmptyString(
										appealDetails.healthAndSafety.lpaQuestionnaire.details
									)
								),
								checked: appealDetails.healthAndSafety.lpaQuestionnaire.hasIssues
							},
							{
								text: 'No',
								value: 'no',
								checked: !appealDetails.healthAndSafety.lpaQuestionnaire.hasIssues
							}
						]
					}
				}
			]
		}
	};

	/** @type {Instructions} */
	mappedData.appeal.appellantHealthAndSafety = {
		id: 'appellant-case-health-and-safety',
		display: {
			summaryListItem: {
				key: {
					text: 'Potential safety risks (appellant answer)'
				},
				value: {
					html: displayPageFormatter.formatAnswerAndDetails(
						convertFromBooleanToYesNo(appealDetails.healthAndSafety.appellantCase.hasIssues) ||
							'No answer provided',
						appealDetails.healthAndSafety.appellantCase.details
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
		input: {
			displayName: 'Potential safety risks (appellant answer)',
			instructions: [
				{
					type: 'radios',
					properties: {
						name: 'appellantCaseHealthAndSafety',
						items: [
							{
								text: 'Yes',
								value: 'yes',
								conditional: conditionalFormatter(
									'appellant-case-health-and-safety-text',
									'appellantCaseHealthAndSafetyText',
									'Tell us why the inspector will need to enter the appeal site',
									displayPageFormatter.nullToEmptyString(
										appealDetails.healthAndSafety.appellantCase.details
									)
								),
								checked: appealDetails.healthAndSafety.appellantCase.hasIssues
							},
							{
								text: 'No',
								value: 'no',
								checked: !appealDetails.healthAndSafety.appellantCase.hasIssues
							}
						]
					}
				}
			]
		}
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
					text: appealDetails.siteVisit?.visitType || ''
				},
				actions: {
					items: [
						{
							text: 'Change',
							href: `${currentRoute}/site-visit/${
								appealDetails.siteVisit?.visitType ? 'visit-booked' : 'schedule-visit'
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
					html: dateToDisplayDate(appealDetails.startedAt) || ''
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
					text: 'LPA questionnaire due'
				},
				value: {
					html:
						dateToDisplayDate(appealDetails.appealTimetable?.lpaQuestionnaireDueDate) ||
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
						dateToDisplayDate(appealDetails.appealTimetable?.statementReviewDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: appealDetails.appealTimetable?.statementReviewDate ? 'Change' : 'Schedule',
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
						dateToDisplayDate(appealDetails.appealTimetable?.finalCommentReviewDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: appealDetails.appealTimetable?.finalCommentReviewDate ? 'Change' : 'Schedule',
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
							dateToDisplayDate(appealDetails.siteVisit?.visitDate),
							convert24hTo12hTimeStringFormat(appealDetails.siteVisit?.visitStartTime),
							convert24hTo12hTimeStringFormat(appealDetails.siteVisit?.visitEndTime)
						) || 'Visit date not yet set'
				},
				actions: {
					items: [
						{
							text: appealDetails.siteVisit?.visitDate ? 'Change' : 'Arrange',
							href: `${currentRoute}/site-visit/${
								appealDetails.siteVisit?.visitDate ? 'manage' : 'schedule'
							}-visit`
						}
					]
				}
			}
		}
	};

	let caseOfficerRowValue = '';
	let caseOfficerUser;

	if (appealDetails.caseOfficer) {
		caseOfficerUser = await usersService.getUserByRoleAndId(
			config.referenceData.appeals.caseOfficerGroupId,
			session,
			appealDetails.caseOfficer
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
					text: 'Case officer'
				},
				value: {
					html: caseOfficerRowValue
				},
				actions: {
					items: [
						{
							text: appealDetails.caseOfficer ? 'Change' : 'Assign',
							href: `${currentRoute}/assign-user/case-officer`
						}
					]
				}
			}
		}
	};

	let inspectorRowValue = '';
	let inspectorUser;

	if (appealDetails.inspector) {
		inspectorUser = await usersService.getUserByRoleAndId(
			config.referenceData.appeals.inspectorGroupId,
			session,
			appealDetails.inspector
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
							text: appealDetails.inspector ? 'Change' : 'Assign',
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
					text: 'Appellant case'
				},
				{
					text: displayPageFormatter.mapDocumentStatus(
						appealDetails?.documentationSummary?.appellantCase?.status,
						appealDetails?.documentationSummary?.appellantCase?.dueDate
					)
				},
				{
					text: dateToDisplayDate(appealDetails?.documentationSummary?.appellantCase?.dueDate)
				},
				{
					html:
						appealDetails?.documentationSummary?.appellantCase?.status !== 'not_received'
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
					text: 'LPA questionnaire'
				},
				{
					text: displayPageFormatter.mapDocumentStatus(
						appealDetails?.documentationSummary?.lpaQuestionnaire?.status
					)
				},
				{
					text: dateToDisplayDate(appealDetails?.documentationSummary?.lpaQuestionnaire?.dueDate)
				},
				{
					html:
						appealDetails?.documentationSummary?.lpaQuestionnaire?.status !== 'not_received'
							? `<a href="${currentRoute}/lpa-questionnaire/${appealDetails?.lpaQuestionnaireId}" class="govuk-link">Review</a>`
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
					text: 'Issue determination'
				},
				value: {
					html:
						dateToDisplayDate(appealDetails.appealTimetable?.issueDeterminationDate) ||
						'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: appealDetails.appealTimetable?.issueDeterminationDate ? 'Change' : 'Schedule',
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
						dateToDisplayDate(appealDetails.appealTimetable?.completeDate) || 'Due date not yet set'
				},
				actions: {
					items: [
						{
							text: appealDetails.appealTimetable?.completeDate ? 'Change' : 'Schedule',
							href: `${currentRoute}/change-appeal-details/complete-date`
						}
					]
				}
			}
		}
	};

	return mappedData;
}

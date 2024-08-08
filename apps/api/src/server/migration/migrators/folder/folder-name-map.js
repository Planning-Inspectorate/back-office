import { createFolders } from './folder.js';

const partialMappingObject = {
	'01 - Project Management': {
		'Project management': {
			'01 - Fees': 'Fees',
			'02 - Case Management': 'Case management',
			'03 - Logistics': {
				Logistics: {
					'01 - Travel': 'Travel',
					'02 - Programme Officer': 'Programme officer',
					'03 - Welsh Translations': 'Welsh'
				}
			},
			'04 - Internal ExA Meetings': 'Internal ExA meetings'
		}
	},
	'02 - Section 51 Advice': 'S51 advice',
	'03 - Land Rights': {
		'Land rights': {
			'01 - s52': {
				S52: {
					'01 - Applicants Request': 'Applicant request',
					'02 - Recommendation and Authorisation': 'Recommendation and authorisation',
					'03 - Correspondence': 'Correspondence'
				}
			},
			'02 - s53': {
				S53: {
					'01 - Applicants Request': 'Applicant request',
					'02 - Recommendation and Authorisation': 'Recommendation and authorisation',
					'03 - Correspondence': 'Correspondence'
				}
			}
		}
	},
	'04 - Transboundary': {
		Transboundary: {
			'01 - First Screening': 'First screening',
			'02 - Second Screening': 'Second screening'
		}
	},
	'05 - Pre-App': {
		'Pre-application': {
			'01 - Draft Docs': {
				'Draft documents': {
					'01 - SOCC': 'SOCC'
				}
			},
			'02 - EIA': {
				EIA: {
					'01 - Screening': 'Screening',
					'02 - Scoping': {
						Scoping: {
							'01 - Responses': 'Responses'
						}
					}
				}
			},
			'03 - Habitat Regulations': 'Habitat regulations',
			'04 - Evidence Plans': 'Evidence plans',
			'05 - Correspondence': {
				Correspondence: {
					'01 - Internal': 'Internal',
					'02 - External': 'External'
				}
			},
			'06 - Meetings': {
				'Events / meetings': {
					'01 - Outreach': 'Outreach'
				}
			},
			'07 - Developers Consultation': {
				"Developer's consultation": {
					'01 - Statutory': {
						Statutory: {
							'01 - PEIR': 'PEIR'
						}
					},
					'02 - Non-Statutory': 'Non-statutory',
					'03 - Consultation Feedback': 'Consultation feedback'
				}
			}
		}
	},
	'06 - Post-Submission Correspondence > 01 - Acceptance': {
		Acceptance: {
			'01 - Acceptance': {
				Correspondence: {
					'01 - Internal': '01 - Internal',
					'02 - External': '02 - External'
				}
			}
		}
	},
	'06 - Post-Submission Correspondence > 03 - Recommendation': {
		Recommendation: {
			'03 - Recommendation': {
				Correspondence: {
					'01 - Internal': '01 - Internal',
					'02 - External': '02 - External'
				}
			}
		}
	},
	'06 - Post-Submission Correspondence > 04 - Decision': {
		Decision: {
			'04 - Decision': {
				Correspondence: {
					'01 - Internal': '01 - Internal',
					'02 - External': '02 - External'
				}
			}
		}
	},
	'06 - Post-Submission Correspondence > 05 - Post-Decision': {
		'Post-decision': {
			'05 - Post-Decision': {
				Correspondence: {
					'01 - Internal': '01 - Internal',
					'02 - External': '02 - External'
				}
			}
		}
	},
	'06 - Post-Submission Correspondence > 06 - SoS': {
		Decision: {
			'06 - SoS': {
				'SoS consultation': {
					'01 - Internal': 'Correspondence > 01 - Internal',
					'02 - External': 'Correspondence > 02 - External'
				}
			}
		}
	},
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance': {
		Acceptance: {
			'01 - Application Documents': {
				'Application documents': {
					'01 - Application Form': 'Application form',
					'02 - Compulsory Acquisition Information': 'Compulsory acquisition information',
					'03 - DCO Documents': 'DCO documents',
					'04 - Environmental Statement': 'Environmental statement',
					'05 - Other Documents': 'Other documents',
					'06 - Plans': 'Plans',
					'07 - Reports': 'Reports',
					'08 - Additional Reg 6 Information': 'Additional Reg 6 information'
				}
			},
			'02 - Adequacy of Consultation': 'Adequacy of consultation',
			'03 - Reg 5': 'Reg 5 and Reg 6',
			'04 - EST': 'EST',
			'05 - Drafting': 'Drafting and decision',
			'06 - Decision': 'Drafting and decision'
		}
	},
	'07 - Acceptance, Pre-Exam and Exam > 02 - Post Submission Changes':
		'Pre-examination > Additional submissions > Post submission changes',
	'07 - Acceptance, Pre-Exam and Exam > 03 - Additional Submission':
		'Examination > Additional submission',
	'07 - Acceptance, Pre-Exam and Exam > 05 - Exam Timetable': 'Examination > Examination timetable',
	'07 - Acceptance, Pre-Exam and Exam > 08 - Legal Advice': 'Legal advice',
	'07 - Acceptance, Pre-Exam and Exam > 09 - Relevant Representation Attachments':
		'Relevant representations',
	'08 - Recommendation': {
		Recommendation: {
			'01 - Documents Received': 'Documents received',
			'02 - Drafting': 'Recommendation report > Drafts',
			'03 - Final Submitted Report': 'Recommendation report > Final submitted report'
		}
	},
	'09 - Decision': {
		Decision: {
			'01 - SoS Consultation': {
				'SoS consultation': {
					'01 - Consultation Docs': 'Consultation documents',
					'02 - Post Exam Submissions': 'Post examination submissions'
				}
			},
			'02 - SoS Decision': 'SoS Decision'
		}
	},
	'10 - Post Decision': {
		'Post-decision': {
			'01 - Feedback': 'Feedback',
			'02 - JR': 'Judicial review',
			'03 - Non-Material Change': {
				'Non-material change': {
					'01 - Application Documents': 'Application documents',
					'02 - Consultation Responses': 'Consultation responses',
					'03 - Procedural Decisions': 'Procedural decisions'
				}
			},
			'04 - Costs': 'Costs'
		}
	}
};

export const attemptPartialMapping = async (documentPath, caseId, folderIdMap) => {
	const folderPathLevels = documentPath.split(' > ');
	const cbosPathSections = traversePartialMap(folderPathLevels);
	if (!cbosPathSections.cbosPathParts.length) {
		return null;
	}
	console.log(folderIdMap);
	console.log('eyooo: ', cbosPathSections);
	const mappingKey = cbosPathSections.cbosPathParts.join(' > ');
	const folderIdOfDeepestPartialMap = folderIdMap[mappingKey];
	console.log('sup: ', folderIdOfDeepestPartialMap);
	return await createFolders(
		cbosPathSections.failedToMatchParts,
		caseId,
		folderIdOfDeepestPartialMap
	);
};

const traversePartialMap = (
	folderPathLevels,
	cbosPathObject = { cbosPathParts: [], failedToMatchParts: [] },
	mappingObject = partialMappingObject
) => {
	const currentLevel = folderPathLevels[0];
	const nextLevel = folderPathLevels[1];

	let currentLevelObject = mappingObject[currentLevel];
	if (!currentLevelObject) {
		currentLevelObject = mappingObject[[currentLevel, nextLevel].join(' > ')];
	}
	if (!currentLevelObject) {
		currentLevelObject = mappingObject[nextLevel];
		if (currentLevelObject) {
			folderPathLevels.shift();
		}
	}
	if (!currentLevelObject) {
		cbosPathObject.failedToMatchParts.push(...folderPathLevels);
		return cbosPathObject;
	}
	if (typeof currentLevelObject === 'string') {
		cbosPathObject.cbosPathParts.push(currentLevelObject);
		return cbosPathObject;
	}

	const cbosPathPart = Object.keys(currentLevelObject)[0];
	cbosPathObject.cbosPathParts.push(cbosPathPart);
	folderPathLevels.shift();

	return traversePartialMap(folderPathLevels, cbosPathObject, {
		...currentLevelObject[cbosPathPart]
	});
};

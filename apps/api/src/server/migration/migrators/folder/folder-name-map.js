import { createFolders } from './folder.js';

const partialMappingObject = {
	'Project Management': {
		'Project management': {
			Fees: 'Fees',
			'Case Management': 'Case management',
			Logistics: {
				Logistics: {
					Travel: 'Travel',
					'Programme Officer': 'Programme officer',
					'Welsh Translations': 'Welsh'
				}
			},
			'Internal ExA Meetings': 'Internal ExA meetings'
		}
	},
	'Section 51 Advice': 'S51 advice',
	'Land Rights': {
		'Land rights': {
			s52: {
				S52: {
					'Applicants Request': 'Applicant request',
					'Recommendation and Authorisation': 'Recommendation and authorisation',
					Correspondence: 'Correspondence'
				}
			},
			s53: {
				S53: {
					'Applicants Request': 'Applicant request',
					'Recommendation and Authorisation': 'Recommendation and authorisation',
					Correspondence: 'Correspondence'
				}
			}
		}
	},
	Transboundary: {
		Transboundary: {
			'First Screening': 'First screening',
			'Second Screening': 'Second screening'
		}
	},
	'Pre-App': {
		'Pre-application': {
			'Draft Docs': {
				'Draft documents': {
					SOCC: 'SOCC'
				}
			},
			EIA: {
				EIA: {
					Screening: 'Screening',
					Scoping: {
						Scoping: {
							Responses: 'Responses'
						}
					}
				}
			},
			'Habitat Regulations': 'Habitat regulations',
			'Evidence Plans': 'Evidence plans',
			Correspondence: {
				Correspondence: {
					Internal: 'Internal',
					External: 'External'
				}
			},
			Meetings: {
				'Events / meetings': {
					Outreach: 'Outreach'
				}
			},
			'Developers Consultation': {
				"Developer's consultation": {
					Statutory: {
						Statutory: {
							PEIR: 'PEIR'
						}
					},
					'Non-Statutory': 'Non-statutory',
					'Consultation Feedback': 'Consultation feedback'
				}
			}
		}
	},
	'Post-Submission Correspondence > Acceptance': {
		Acceptance: {
			Acceptance: {
				Correspondence: {
					Internal: 'Internal',
					External: 'External'
				}
			}
		}
	},
	'Post-Submission Correspondence > Recommendation': {
		Recommendation: {
			Recommendation: {
				Correspondence: {
					Internal: 'Internal',
					External: 'External'
				}
			}
		}
	},
	'Post-Submission Correspondence > Decision': {
		Decision: {
			Decision: {
				Correspondence: {
					Internal: 'Internal',
					External: 'External'
				}
			}
		}
	},
	'Post-Submission Correspondence > Post-Decision': {
		'Post-decision': {
			'Post-Decision': {
				Correspondence: {
					Internal: 'Internal',
					External: 'External'
				}
			}
		}
	},
	'Post-Submission Correspondence > SoS': {
		Decision: {
			SoS: {
				'SoS consultation': {
					Internal: 'Correspondence > Internal',
					External: 'Correspondence > External'
				}
			}
		}
	},
	'Acceptance, Pre-Exam and Exam > Acceptance': {
		Acceptance: {
			'Application Documents': {
				'Application documents': {
					'Application Form': 'Application form',
					'Compulsory Acquisition Information': 'Compulsory acquisition information',
					'DCO Documents': 'DCO documents',
					'Environmental Statement': 'Environmental statement',
					'Other Documents': 'Other documents',
					Plans: 'Plans',
					Reports: 'Reports',
					'Additional Reg 6 Information': 'Additional Reg 6 information'
				}
			},
			'Adequacy of Consultation': 'Adequacy of consultation',
			'Reg 5': 'Reg 5 and Reg 6',
			EST: 'EST',
			Drafting: 'Drafting and decision',
			Decision: 'Drafting and decision'
		}
	},
	'Acceptance, Pre-Exam and Exam > Post Submission Changes':
		'Pre-examination > Additional submissions > Post submission changes',
	'Acceptance, Pre-Exam and Exam > Additional Submission': 'Examination > Additional submission',
	'Acceptance, Pre-Exam and Exam > Exam Timetable': 'Examination > Examination timetable',
	'Acceptance, Pre-Exam and Exam > Legal Advice': 'Legal advice',
	'Acceptance, Pre-Exam and Exam > Relevant Representation Attachments': 'Relevant representations',
	Recommendation: {
		Recommendation: {
			'Documents Received': 'Documents received',
			Drafting: 'Recommendation report > Drafts',
			'Final Submitted Report': 'Recommendation report > Final submitted report'
		}
	},
	Decision: {
		Decision: {
			'SoS Consultation': {
				'SoS consultation': {
					'Consultation Docs': 'Consultation documents',
					'Post Exam Submissions': 'Post examination submissions'
				}
			},
			'SoS Decision': 'SoS Decision'
		}
	},
	'Post Decision': {
		'Post-decision': {
			Feedback: 'Feedback',
			JR: 'Judicial review',
			'Non-Material Change': {
				'Non-material change': {
					'Application Documents': 'Application documents',
					'Consultation Responses': 'Consultation responses',
					'Procedural Decisions': 'Procedural decisions'
				}
			},
			Costs: 'Costs'
		}
	},
	Correspondence: 'Correspondence'
};

export const attemptPartialMapping = async (documentPath, caseId, folderIdMap) => {
	const folderPathLevels = documentPath.split(' > ');
	const cbosPathSections = traversePartialMap(folderPathLevels);
	if (!cbosPathSections.cbosPathParts.length) {
		return null;
	}

	const mappingKey = cbosPathSections.cbosPathParts.join(' > ');
	const folderIdOfDeepestPartialMap = folderIdMap[mappingKey];
	return createFolders(
		cbosPathSections.failedToMatchParts.map((pathParts) => pathParts + ' - migrated'),
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
		nextLevel && cbosPathObject.failedToMatchParts.push(nextLevel);
		return cbosPathObject;
	}

	const cbosPathPart = Object.keys(currentLevelObject)[0];
	cbosPathObject.cbosPathParts.push(cbosPathPart);
	folderPathLevels.shift();

	return traversePartialMap(folderPathLevels, cbosPathObject, {
		...currentLevelObject[cbosPathPart]
	});
};

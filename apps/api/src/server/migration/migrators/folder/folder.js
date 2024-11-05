import {
	createCorrespondenceFolders,
	getAllByCaseId,
	getFolderByNameAndCaseId
} from '#repositories/folder.repository.js';
import { buildFolderHierarchy } from './utils.js';
import { memoize } from 'lodash-es';

import { folderDocumentCaseStageMappings } from '../../../applications/constants.js';
import { databaseConnector } from '#utils/database-connector.js';
import logger from '#utils/logger.js';
import { attemptPartialMapping } from './folder-name-map.js';

/**
 * Folders to be created for cases which are being migrated. Includes all the default Back Office folders that
 * are defined in `folder.repository.js#defaultCaseFolders` except the root level `Correspondence` folder.
 *
 * In addition to the default folders, the following are created:
 * Project management > Case management
 * Project management > Logistics > Programme officer
 * Project management > Internal ExA meetings
 * Pre-application > Draft documents > SOCC
 * Pre-application > Events / meetings > Outreach
 * Pre-application > Developer's consultation > Statutory > PEIR
 * Pre-application > Correspondence > External
 * Pre-application > Correspondence > Internal
 * Acceptance > Correspondence > Internal
 * Acceptance > Correspondence > External
 * Pre-examination > Correspondence > Internal
 * Pre-examination > Correspondence > External
 * Examination > Correspondence > Internal
 * Examination > Correspondence > External
 * Recommendation > Correspondence > Internal
 * Recommendation > Correspondence > External
 * Recommendation > Documents received
 * Decision > Correspondence
 * Decision > Correspondence > Internal
 * Decision > Correspondence > External
 * Post-decision > Correspondence
 * Post-decision > Correspondence > Internal
 * Post-decision > Correspondence > External
 * Decision > SoS consultation > Correspondence
 * Decision > SoS consultation > Correspondence > Internal
 * Decision > SoS consultation > Correspondence > External
 * Acceptance > Drafting
 * Acceptance > Decision
 * Decision > SoS consultation > Consultation documents
 * Decision > SoS consultation > Post examination submissions
 * Post-decision > Feedback
 * Post-decision > Non-material change > Application documents
 * Post-decision > Non-material change > Consultation responses
 * Post-decision > Non-material change > Procedural decisions
 * Archived documentation
 *
 * @type {FolderTemplate[]} defaultCaseFoldersForMigration
 */
export const defaultCaseFoldersForMigration = [
	{
		displayNameEn: 'Project management',
		displayOrder: 100,
		stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT,
		childFolders: {
			create: [
				{
					displayNameEn: 'Logistics',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT,
					childFolders: {
						create: [
							{
								displayNameEn: 'Travel',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
							},
							{
								displayNameEn: 'Welsh',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
							},
							{
								displayNameEn: 'Programme officer',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
							}
						]
					}
				},
				{
					displayNameEn: 'Mail merges',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
				},
				{
					displayNameEn: 'Fees',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
				},
				{
					displayNameEn: 'Case management',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
				},
				{
					displayNameEn: 'Internal ExA meetings',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.PROJECT_MANAGEMENT
				}
			]
		}
	},
	{
		displayNameEn: 'Correspondence',
		displayOrder: 150,
		stage: folderDocumentCaseStageMappings.CORRESPONDENCE,
		childFolders: {
			create: [
				{
					displayNameEn: '2023',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.CORRESPONDENCE,
					childFolders: {
						create: createCorrespondenceFolders()
					}
				},
				{
					displayNameEn: '2024',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.CORRESPONDENCE,
					childFolders: {
						create: createCorrespondenceFolders()
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		stage: folderDocumentCaseStageMappings.LEGAL_ADVICE
	},
	{
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		stage: folderDocumentCaseStageMappings.TRANSBOUNDARY,
		childFolders: {
			create: [
				{
					displayNameEn: 'First screening',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.TRANSBOUNDARY
				},
				{
					displayNameEn: 'Second screening',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.TRANSBOUNDARY
				}
			]
		}
	},
	{
		displayNameEn: 'Land rights',
		displayOrder: 400,
		stage: folderDocumentCaseStageMappings.LAND_RIGHTS,
		childFolders: {
			create: [
				{
					displayNameEn: 'S52',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.LAND_RIGHTS,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							}
						]
					}
				},
				{
					displayNameEn: 'S53',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.LAND_RIGHTS,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: folderDocumentCaseStageMappings.LAND_RIGHTS
							}
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'S51 advice',
		displayOrder: 500,
		stage: folderDocumentCaseStageMappings.S51_ADVICE
	},
	{
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Outreach',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							}
						]
					}
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'External',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Internal',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							}
						]
					}
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Screening',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Scoping',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
								childFolders: {
									create: [
										{
											displayNameEn: 'Responses',
											displayOrder: 100,
											stage: folderDocumentCaseStageMappings.PRE_APPLICATION
										}
									]
								}
							}
						]
					}
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Evidence plans',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Draft documents',
					displayOrder: 600,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'SOCC',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							}
						]
					}
				},
				{
					displayNameEn: "Developer's consultation",
					displayOrder: 700,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Statutory',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION,
								childFolders: {
									create: [
										{
											displayNameEn: 'PEIR',
											displayOrder: 100,
											stage: folderDocumentCaseStageMappings.PRE_APPLICATION
										}
									]
								}
							},
							{
								displayNameEn: 'Non-statutory',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Consultation feedback',
								displayOrder: 300,
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
							}
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Acceptance',
		displayOrder: 700,
		stage: folderDocumentCaseStageMappings.ACCEPTANCE,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.ACCEPTANCE
							}
						]
					}
				},
				{
					displayNameEn: 'EST',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Application documents',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Application form',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Compulsory acquisition information',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'DCO documents',
								displayOrder: 300,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Environmental statement',
								displayOrder: 400,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Other documents',
								displayOrder: 500,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Plans',
								displayOrder: 600,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Reports',
								displayOrder: 700,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							},
							{
								displayNameEn: 'Additional Reg 6 information',
								displayOrder: 800,
								stage: folderDocumentCaseStageMappings.DEVELOPERS_APPLICATION
							}
						]
					}
				},
				{
					displayNameEn: 'Adequacy of consultation',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Reg 5 and Reg 6',
					displayOrder: 600,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Drafting and decision',
					displayOrder: 700,
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
				}
			]
		}
	},
	{
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		stage: folderDocumentCaseStageMappings.PRE_EXAMINATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Post submission changes',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
				}
			]
		}
	},
	{
		displayNameEn: 'Relevant representations',
		displayOrder: 900,
		stage: folderDocumentCaseStageMappings.RELEVANT_REPRESENTATIONS
	},
	{
		displayNameEn: 'Examination',
		displayOrder: 1000,
		stage: folderDocumentCaseStageMappings.EXAMINATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Correspondence',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.EXAMINATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.EXAMINATION
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'Examination timetable',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.EXAMINATION,
					childFolders: {
						// for examination timetable we storing date in yyyyMMdd(20231230) format for display order.
						// To display other in the end we need to put other in highest possible order.
						create: [
							{
								displayNameEn: 'Other',
								displayOrder: 30000000,
								stage: folderDocumentCaseStageMappings.EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: folderDocumentCaseStageMappings.EXAMINATION
				}
			]
		}
	},
	{
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		stage: folderDocumentCaseStageMappings.RECOMMENDATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.RECOMMENDATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.RECOMMENDATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.RECOMMENDATION
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.RECOMMENDATION
							}
						]
					}
				},
				{
					displayNameEn: 'Recommendation report',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.RECOMMENDATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Drafts',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.RECOMMENDATION
							},
							{
								displayNameEn: 'Final submitted report',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.RECOMMENDATION
							}
						]
					}
				},
				{
					displayNameEn: 'Documents received',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.RECOMMENDATION
				}
			]
		}
	},
	{
		displayNameEn: 'Decision',
		displayOrder: 1200,
		stage: folderDocumentCaseStageMappings.DECISION,
		childFolders: {
			create: [
				{
					displayNameEn: 'SoS consultation',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.DECISION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Correspondence',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.DECISION,
								childFolders: {
									create: [
										{
											displayNameEn: 'Internal',
											displayOrder: 100,
											stage: folderDocumentCaseStageMappings.DECISION
										},
										{
											displayNameEn: 'External',
											displayOrder: 200,
											stage: folderDocumentCaseStageMappings.DECISION
										}
									]
								}
							},
							{
								displayNameEn: 'Consultation documents',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.DECISION
							},
							{
								displayNameEn: 'Post examination submissions',
								displayOrder: 300,
								stage: folderDocumentCaseStageMappings.DECISION
							}
						]
					}
				},
				{
					displayNameEn: 'SoS decision',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.DECISION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.DECISION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.DECISION
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.DECISION
							}
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		stage: folderDocumentCaseStageMappings.POST_DECISION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Judicial review',
					displayOrder: 100,
					stage: folderDocumentCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Costs',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Non-material change',
					displayOrder: 300,
					stage: folderDocumentCaseStageMappings.POST_DECISION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Application documents',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							},
							{
								displayNameEn: 'Consultation responses',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							},
							{
								displayNameEn: 'Procedural decisions',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							}
						]
					}
				},
				{
					displayNameEn: 'Material change',
					displayOrder: 400,
					stage: folderDocumentCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Redetermination',
					displayOrder: 500,
					stage: folderDocumentCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 600,
					stage: folderDocumentCaseStageMappings.POST_DECISION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							},
							{
								displayNameEn: 'External',
								displayOrder: 200,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							}
						]
					}
				},
				{
					displayNameEn: 'Feedback',
					displayOrder: 700,
					stage: folderDocumentCaseStageMappings.POST_DECISION
				}
			]
		}
	},
	{
		displayNameEn: 'Archived documentation',
		displayOrder: 1400,
		childFolders: {
			create: [
				{
					displayNameEn: 'Post-Submission Correspondence',
					displayOrder: 100,
					childFolders: {
						create: [
							{
								displayNameEn: 'Pre-Exam and Exam',
								displayOrder: 100,
								childFolders: {
									create: [
										{
											displayNameEn: 'Internal',
											displayOrder: 100
										},
										{
											displayNameEn: 'External',
											displayOrder: 200
										}
									]
								}
							}
						]
					}
				},
				{
					displayNameEn: 'Acceptance, Pre-Exam and Exam',
					displayOrder: 200,
					childFolders: {
						create: [
							{
								displayNameEn: 'Procedural Decisions',
								displayOrder: 100,
								childFolders: {
									create: [
										{
											displayNameEn: 'Drafts',
											displayOrder: 100
										}
									]
								}
							},
							{
								displayNameEn: 'EIA',
								displayOrder: 200
							},
							{
								displayNameEn: 'Habitat Regs',
								displayOrder: 300
							}
						]
					}
				}
			]
		}
	}
];

/**
 * Mapping of folder paths to their equivalent folder in Back Office
 */
const folderMapping = {
	'Project Management': 'Project management',
	'Project Management > Fees': 'Project management > Fees',
	'Project Management > Case Management': 'Project management > Case management',
	'Project Management > Logistics': 'Project management > Logistics',
	'Project Management > Logistics > Travel': 'Project management > Logistics > Travel',
	'Project Management > Logistics > Programme Officer':
		'Project management > Logistics > Programme officer',
	'Project Management > Logistics > Welsh Translations': 'Project management > Logistics > Welsh',
	'Project Management > Internal ExA Meetings': 'Project management > Internal ExA meetings',

	'Section 51 Advice': 'S51 advice',

	'Land Rights': 'Land rights',
	'Land Rights > s52': 'Land rights > S52',
	'Land Rights > s52 > Applicants Request': 'Land rights > S52 > Applicant request',
	'Land Rights > s52 > Recommendation and Authorisation':
		'Land rights > S52 > Recommendation and authorisation',
	'Land Rights > s52 > Correspondence': 'Land rights > S52 > Correspondence',
	'Land Rights > s53': 'Land rights > S53',
	'Land Rights > s53 > Applicants Request': 'Land rights > S53 > Applicant request',
	'Land Rights > s53 > Recommendation and Authorisation':
		'Land rights > S53 > Recommendation and authorisation',
	'Land Rights > s53 > Correspondence': 'Land rights > S53 > Correspondence',

	Transboundary: 'Transboundary',
	'Transboundary > First Screening': 'Transboundary > First screening',
	'Transboundary > Second Screening': 'Transboundary > Second screening',

	'Pre-App': 'Pre-application',
	'Pre-App > Draft Docs': 'Pre-application > Draft documents',
	'Pre-App > Draft Docs > SOCC': 'Pre-application > Draft documents > SOCC',
	'Pre-App > EIA': 'Pre-application > EIA',
	'Pre-App > EIA > Screening': 'Pre-application > EIA > Screening',
	'Pre-App > EIA > Scoping': 'Pre-application > EIA > Scoping',
	'Pre-App > EIA > Scoping > Responses': 'Pre-application > EIA > Scoping > Responses',
	'Pre-App > Habitat Regulations': 'Pre-application > Habitat regulations',
	'Pre-App > Evidence Plans': 'Pre-application > Evidence plans',
	'Pre-App > Correspondence': 'Pre-application > Correspondence',
	'Pre-App > Correspondence > Internal': 'Pre-application > Correspondence > Internal',
	'Pre-App > Correspondence > External': 'Pre-application > Correspondence > External',
	'Pre-App > Meetings': 'Pre-application > Events / meetings',
	'Pre-App > Meetings > Outreach': 'Pre-application > Events / meetings > Outreach',
	'Pre-App > Developers Consultation': "Pre-application > Developer's consultation",
	'Pre-App > Developers Consultation > Statutory':
		"Pre-application > Developer's consultation > Statutory",
	'Pre-App > Developers Consultation > Statutory > PEIR':
		"Pre-application > Developer's consultation > Statutory > PEIR",
	'Pre-App > Developers Consultation > Non-Statutory':
		"Pre-application > Developer's consultation > Non-statutory",
	'Pre-App > Developers Consultation > Consultation Feedback':
		"Pre-application > Developer's consultation > Consultation feedback",

	'Post-Submission Correspondence > Acceptance': 'Acceptance > Correspondence',
	'Post-Submission Correspondence > Acceptance > Internal':
		'Acceptance > Correspondence > Internal',
	'Post-Submission Correspondence > Acceptance > External':
		'Acceptance > Correspondence > External',
	'Post-Submission Correspondence > Recommendation': 'Recommendation > Correspondence',
	'Post-Submission Correspondence > Recommendation > Internal':
		'Recommendation > Correspondence > Internal',
	'Post-Submission Correspondence > Recommendation > External':
		'Recommendation > Correspondence > External',
	'Post-Submission Correspondence > Decision': 'Decision > Correspondence',
	'Post-Submission Correspondence > Decision > Internal': 'Decision > Correspondence > Internal',
	'Post-Submission Correspondence > Decision > External': 'Decision > Correspondence > External',
	'Post-Submission Correspondence > Post-Decision > Internal':
		'Post-decision > Correspondence > Internal',
	'Post-Submission Correspondence > Post-Decision > External':
		'Post-decision > Correspondence > External',
	'Post-Submission Correspondence > SoS': 'Decision > SoS consultation > Correspondence',
	'Post-Submission Correspondence > SoS > Internal':
		'Decision > SoS consultation > Correspondence > Internal',
	'Post-Submission Correspondence > SoS > External':
		'Decision > SoS consultation > Correspondence > External',

	'Acceptance, Pre-Exam and Exam > Acceptance': 'Acceptance',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents':
		'Acceptance > Application documents',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Application Form':
		'Acceptance > Application documents > Application form',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Compulsory Acquisition Information':
		'Acceptance > Application documents > Compulsory acquisition information',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > DCO Documents':
		'Acceptance > Application documents > DCO documents',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Environmental Statement':
		'Acceptance > Application documents > Environmental statement',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Other Documents':
		'Acceptance > Application documents > Other documents',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Plans':
		'Acceptance > Application documents > Plans',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Reports':
		'Acceptance > Application documents > Reports',
	'Acceptance, Pre-Exam and Exam > Acceptance > Application Documents > Additional Reg 6 Information':
		'Acceptance > Application documents > Additional Reg 6 information',
	'Acceptance, Pre-Exam and Exam > Acceptance > Adequacy of Consultation':
		'Acceptance > Adequacy of consultation',
	'Acceptance, Pre-Exam and Exam > Acceptance > Reg 5': 'Acceptance > Reg 5 and Reg 6',
	'Acceptance, Pre-Exam and Exam > Acceptance > EST': 'Acceptance > EST',
	'Acceptance, Pre-Exam and Exam > Acceptance > Drafting': 'Acceptance > Drafting and decision',
	'Acceptance, Pre-Exam and Exam > Acceptance > Decision': 'Acceptance > Drafting and decision',
	'Acceptance, Pre-Exam and Exam > Post Submission Changes':
		'Pre-examination > Additional submissions > Post submission changes',
	'Acceptance, Pre-Exam and Exam > Additional Submissions': 'Examination > Additional submissions',
	'Acceptance, Pre-Exam and Exam > Exam Timetable': 'Examination > Examination timetable',
	'Acceptance, Pre-Exam and Exam > Legal Advice': 'Legal advice',
	'Acceptance, Pre-Exam and Exam > Relevant Representation Attachments': 'Relevant representations',

	Recommendation: 'Recommendation',
	'Recommendation > Documents Received': 'Recommendation > Documents received',
	'Recommendation > Drafting': 'Recommendation > Recommendation report > Drafts',
	'Recommendation > Final Submitted Report':
		'Recommendation > Recommendation report > Final submitted report',

	Decision: 'Decision',
	'Decision > SoS Consultation': 'Decision > SoS consultation',
	'Decision > SoS Consultation > Consultation Docs':
		'Decision > SoS consultation > Consultation documents',
	'Decision > SoS Consultation > Post Exam Submissions':
		'Decision > SoS consultation > Post examination submissions',
	'Decision > SoS Decision': 'Decision > SoS Decision',

	'Post Decision': 'Post-decision',
	'Post Decision > Feedback': 'Post-decision > Feedback',
	'Post Decision > JR': 'Post-decision > Judicial review',
	'Post Decision > Non-Material Change': 'Post-decision > Non-material change',
	'Post Decision > Non-Material Change > Application Documents':
		'Post-decision > Non-material change > Application documents',
	'Post Decision > Non-Material Change > Consultation Responses':
		'Post-decision > Non-material change > Consultation responses',
	'Post Decision > Non-Material Change > Procedural Decisions':
		'Post-decision > Non-material change > Procedural decisions',
	'Post Decision > Costs': 'Post-decision > Costs',

	Correspondence: 'Correspondence',

	Unmapped: 'Archived documentation'
};

/**
 * Mapping of Horizon folder paths to their Back Office equivalent, depending on the file's stage
 */
const stageMap = {
	'Post-Submission Correspondence': {
		examination: 'Examination > Correspondence',
		acceptance: 'Acceptance > Correspondence',
		decision: 'Decision > Correspondence',
		'pre-examination': 'Pre-examination > Correspondence',
		recommendation: 'Recommendation > Correspondence',
		null: 'Archived documentation > Post-Submission Correspondence'
	},
	'Post-Submission Correspondence > Pre-Exam and Exam': {
		examination: 'Examination > Correspondence',
		acceptance: 'Acceptance > Correspondence',
		decision: 'Decision > Correspondence',
		'pre-examination': 'Pre-examination > Correspondence',
		recommendation: 'Recommendation > Correspondence',
		null: 'Archived documentation > Post-Submission Correspondence > Pre-Exam and Exam'
	},
	'Post-Submission Correspondence > Pre-Exam and Exam > Internal': {
		examination: 'Examination > Correspondence > Internal',
		acceptance: 'Acceptance > Correspondence > Internal',
		decision: 'Decision > Correspondence > Internal',
		'pre-examination': 'Pre-examination > Correspondence > Internal',
		recommendation: 'Recommendation > Correspondence > Internal',
		null: 'Archived documentation > Post-Submission Correspondence > Pre-Exam and Exam > Internal'
	},
	'Post-Submission Correspondence > Pre-Exam and Exam > External': {
		examination: 'Examination > Correspondence > External',
		acceptance: 'Acceptance > Correspondence > External',
		decision: 'Decision > Correspondence > External',
		'pre-examination': 'Pre-examination > Correspondence > External',
		recommendation: 'Recommendation > Correspondence > External',
		null: 'Archived documentation > Post-Submission Correspondence > Pre-Exam and Exam > External'
	},
	'Acceptance, Pre-Exam and Exam': {
		examination: 'Examination',
		acceptance: 'Acceptance',
		decision: 'Decision',
		'pre-examination': 'Pre-examination',
		recommendation: 'Recommendation',
		null: 'Archived documentation > Acceptance, Pre-Exam and Exam'
	},
	'Acceptance, Pre-Exam and Exam > Procedural Decisions': {
		examination: 'Examination > Procedural decisions',
		'pre-examination': 'Pre-examination > Procedural decisions',
		null: 'Archived documentation > Acceptance, Pre-Exam and Exam > Procedural Decisions'
	},
	'Acceptance, Pre-Exam and Exam > Procedural Decisions > Drafts': {
		examination: 'Examination > Procedural decisions',
		'pre-examination': 'Pre-examination > Procedural decisions',
		null: 'Archived documentation > Acceptance, Pre-Exam and Exam > Procedural Decisions > Drafts'
	},
	'Acceptance, Pre-Exam and Exam > EIA': {
		'pre-application': 'Pre-application > EIA',
		examination: 'Examination > EIA',
		'pre-examination': 'Pre-examination > EIA',
		null: 'Archived documentation > Acceptance, Pre-Exam and Exam > EIA'
	},
	'Acceptance, Pre-Exam and Exam > Habitat Regs': {
		'pre-application': 'Pre-application > Habitat regulations',
		'pre-examination': 'Pre-examination > Habitat regulations',
		examination: 'Examination > Habitat regulations',
		null: 'Archived documentation > Acceptance, Pre-Exam and Exam > Habitat Regs'
	}
};

const getFolderIdMap = memoize(async (caseId) => {
	const folders = await getAllByCaseId(caseId);
	const folderHierarchy = buildFolderHierarchy(folders);
	return buildFolderPaths(folderHierarchy);
});

const getArchivedDocumentationFolderId = memoize(async (caseId) => {
	const archivedDocumentationFolder = await getFolderByNameAndCaseId(
		caseId,
		'Archived documentation'
	);
	if (!archivedDocumentationFolder)
		throw `Archived documentation folder not found for caseId ${caseId}`;
	return archivedDocumentationFolder?.id;
});

const getS51AdviceFolderId = memoize(async (caseId) => {
	const s51AdviceFolder = await getFolderByNameAndCaseId(caseId, 'S51 advice');
	if (!s51AdviceFolder) throw `S51 advice folder not found for caseId ${caseId}`;
	return s51AdviceFolder?.id;
});

const getExamTimetableFolderId = memoize(async (caseId) => {
	const examTimetableFolder = await getFolderByNameAndCaseId(caseId, 'Examination timetable');
	if (!examTimetableFolder) throw `Examination timetable folder not found for caseId ${caseId}`;
	return examTimetableFolder?.id;
});

/**
 * look up path in maps, or create it if not found
 * @param documentPath
 * @param caseId
 * @return {Promise<number>}
 */
export const getDocumentFolderId = async ({ path, documentCaseStage }, caseId) => {
	const folders = path.split('/').slice(1); // index 0 is project name/root, not needed
	const formattedFolderNames = folders.map((folderName) => folderName.replace(/^\d+ - /, ''));
	const documentPath = formattedFolderNames.join(' > ');

	logger.info(`path: ${documentPath}, documentCaseStage: ${documentCaseStage}`);

	if (isS51AdviceFolder(path)) {
		logger.info('Path is S51 advice folder');
		return getS51AdviceFolderId(caseId);
	}

	if (isExamTimetableSubfolder(path)) {
		logger.info('Creating Exam Timetable subfolder');
		return createExamTimetableSubfolder(formattedFolderNames, caseId);
	}

	let folderId;
	const folderIdMap = await getFolderIdMap(caseId);
	const folderMap = folderMapping[documentPath];
	const stageFolderMap = stageMap[documentPath];
	if (folderMap) {
		logger.info(`Mapping found for path: ${folderMap}`);
		folderId = folderIdMap[folderMap];
	} else if (stageFolderMap && stageFolderMap[documentCaseStage]) {
		logger.info(`Mapping found for path + stage: ${stageFolderMap[documentCaseStage]}`);
		folderId = folderIdMap[stageFolderMap[documentCaseStage]];
	} else {
		logger.info(`Attempting partial mapping for path: ${documentPath}`);
		folderId = await attemptPartialMapping(documentPath, caseId, folderIdMap);
		if (!folderId) {
			logger.info(
				`Failed to partially map document path - creating folders within Archive folder: ${documentPath}`
			);
			folderId = await createArchivedFolders(formattedFolderNames, caseId);
		}
	}
	if (!folderId) throw `folderId not found`;

	return folderId;
};

const isExamTimetableSubfolder = (documentPath) => /Exam Timetable\/(.*)/.test(documentPath);

const isS51AdviceFolder = (documentPath) => /Section 51 Advice/.test(documentPath);

const createExamTimetableSubfolder = async (folders, caseId) => {
	const parentFolderId = await getExamTimetableFolderId(caseId);

	const folderIndex = folders.findIndex((folderName) => /Exam Timetable$/.test(folderName));
	const subFolders = folders.slice(folderIndex + 1);

	return createFolders(subFolders, caseId, parentFolderId);
};

/**
 * recursively create folders within the Archive parent folder
 * @param {array[string]} folders
 * @param caseId
 * @return {Promise<number>}
 */
const createArchivedFolders = async (folders, caseId) => {
	let parentFolderId = await getArchivedDocumentationFolderId(caseId);
	return await createFolders(folders, caseId, parentFolderId);
};

/**
 * recursively create folders within parent folder
 * @param {array[string]} folders
 * @param caseId
 * @param parentFolderId
 * @return {Promise<number>}
 */
export const createFolders = async (folders, caseId, parentFolderId) => {
	for (const folderName of folders) {
		const folderUpsertInput = {
			caseId,
			parentFolderId,
			displayNameEn: folderName
		};

		let folderObject = await databaseConnector.folder.findFirst({
			where: { ...folderUpsertInput, deletedAt: null }
		});

		if (!folderObject) {
			folderObject = await databaseConnector.folder.create({
				data: folderUpsertInput
			});
		}

		parentFolderId = folderObject.id;
	}
	return parentFolderId;
};

/**
 * takes List of Folder entities and builds path delimited by ` > `
 * @param folders
 * @param paths
 * @param parentPath
 * @return {Map<string, number>} folderPathToIdMap
 */
const buildFolderPaths = (folders, paths = {}, parentPath = []) => {
	folders.forEach((folder) => {
		let path = parentPath ? parentPath.concat(folder.displayNameEn) : [folder.displayNameEn];
		paths[path.join(' > ')] = folder.id;

		if (folder.children.length > 0) {
			buildFolderPaths(folder.children, paths, path);
		}
	});
	return paths;
};

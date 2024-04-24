import { getAllByCaseId, getFolderByNameAndCaseId } from '#repositories/folder.repository.js';
import { buildFolderHierarchy } from './utils.js';
import { memoize } from 'lodash-es';

import { folderDocumentCaseStageMappings } from '../../../applications/constants.js';
import { databaseConnector } from '#utils/database-connector.js';
import logger from '#utils/logger.js';

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
 * Pre-application > Developer's consulation > Statutory > PEIR
 * Pre-application > Correspondence > External
 * Pre-application > Correspondence > Internal
 * Acceptance > Correspondence > 01 - Internal
 * Acceptance > Correspondence > 02 - External
 * Pre-examination > Correspondence > 01 - Internal
 * Pre-examination > Correspondence > 02 - External
 * Examination > Correspondence > 01 - Internal
 * Examination > Correspondence > 02 - External
 * Recommendation > Correspondence > 01 - Internal
 * Recommendation > Correspondence > 02 - External
 * Recommendation > Documents received
 * Decision > Correspondence
 * Decision > Correspondence > 01 - Internal
 * Decision > Correspondence > 02 - External
 * Post-decision > Correspondence
 * Post-decision > Correspondence > 01 - Internal
 * Post-decision > Correspondence > 02 - External
 * Decision > SoS consultation > Correspondence
 * Decision > SoS consultation > Correspondence > 01 - Internal
 * Decision > SoS consultation > Correspondence > 02 - External
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: '02 - External',
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
							},
							{
								displayNameEn: '02 - External',
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.EXAMINATION
							},
							{
								displayNameEn: '02 - External',
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.RECOMMENDATION
							},
							{
								displayNameEn: '02 - External',
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
											displayNameEn: '01 - Internal',
											displayOrder: 100,
											stage: folderDocumentCaseStageMappings.DECISION
										},
										{
											displayNameEn: '02 - External',
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.DECISION
							},
							{
								displayNameEn: '02 - External',
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
								displayNameEn: '01 - Internal',
								displayOrder: 100,
								stage: folderDocumentCaseStageMappings.POST_DECISION
							},
							{
								displayNameEn: '02 - External',
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
					displayNameEn: '06 - Post-Submission Correspondence',
					displayOrder: 100,
					childFolders: {
						create: [
							{
								displayNameEn: '02 - Pre-Exam and Exam',
								displayOrder: 100,
								childFolders: {
									create: [
										{
											displayNameEn: '01 - Internal',
											displayOrder: 100
										},
										{
											displayNameEn: '02 - External',
											displayOrder: 200
										}
									]
								}
							}
						]
					}
				},
				{
					displayNameEn: '07 - Acceptance, Pre-Exam and Exam',
					displayOrder: 200,
					childFolders: {
						create: [
							{
								displayNameEn: '04 - Procedural Decisions',
								displayOrder: 100,
								childFolders: {
									create: [
										{
											displayNameEn: '01 - Drafts',
											displayOrder: 100
										}
									]
								}
							},
							{
								displayNameEn: '06 - EIA',
								displayOrder: 200
							},
							{
								displayNameEn: '07 - Habitat Regs',
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
export const folderMapping = {
	'01 - Project Management': 'Project management',
	'01 - Project Management > 01 - Fees': 'Project management > Fees',
	'01 - Project Management > 02 - Case Management': 'Project management > Case management',
	'01 - Project Management > 03 - Logistics': 'Project management > Logistics',
	'01 - Project Management > 03 - Logistics > 01 - Travel':
		'Project management > Logistics > Travel',
	'01 - Project Management > 03 - Logistics > 02 - Programme Officer':
		'Project management > Logistics > Programme officer',
	'01 - Project Management > 03 - Logistics > 03 - Welsh Translations':
		'Project management > Logistics > Welsh',
	'01 - Project Management > 04 - Internal ExA Meetings':
		'Project management > Internal ExA meetings',

	'02 - Section 51 Advice': 'S51 advice',

	'03 - Land Rights': 'Land rights',
	'03 - Land Rights > 01 - s52': 'Land rights > S52',
	'03 - Land Rights > 01 - s52 > 01 - Applicants Request': 'Land rights > S52 > Applicant request',
	'03 - Land Rights > 01 - s52 > 02 - Recommendation and Authorisation':
		'Land rights > S52 > Recommendation and authorisation',
	'03 - Land Rights > 01 - s52 > 03 - Correspondence': 'Land rights > S52 > Correspondence',
	'03 - Land Rights > 02 - s53': 'Land rights > S53',
	'03 - Land Rights > 02 - s53 > 01 - Applicants Request': 'Land rights > S53 > Applicant request',
	'03 - Land Rights > 02 - s53 > 02 - Recommendation and Authorisation':
		'Land rights > S53 > Recommendation and authorisation',
	'03 - Land Rights > 02 - s53 > 03 - Correspondence': 'Land rights > S53 > Correspondence',

	'04 - Transboundary': 'Transboundary',
	'04 - Transboundary > 01 - First Screening': 'Transboundary > First screening',
	'04 - Transboundary > 02 - Second Screening': 'Transboundary > Second screening',

	'05 - Pre-App': 'Pre-application',
	'05 - Pre-App > 01 - Draft Docs': 'Pre-application > Draft documents',
	'05 - Pre-App > 01 - Draft Docs > 01 - SOCC': 'Pre-application > Draft documents > SOCC',
	'05 - Pre-App > 02 - EIA': 'Pre-application > EIA',
	'05 - Pre-App > 02 - EIA > 01 - Screening': 'Pre-application > EIA > Screening',
	'05 - Pre-App > 02 - EIA > 02 - Scoping': 'Pre-application > EIA > Scoping',
	'05 - Pre-App > 02 - EIA > 02 - Scoping > 01 - Responses':
		'Pre-application > EIA > Scoping > Responses',
	'05 - Pre-App > 03 - Habitat Regulations': 'Pre-application > Habitat regulations',
	'05 - Pre-App > 04 - Evidence Plans': 'Pre-application > Evidence plans',
	'05 - Pre-App > 05 - Correspondence': 'Pre-application > Correspondence',
	'05 - Pre-App > 05 - Correspondence > 01 - Internal':
		'Pre-application > Correspondence > Internal',
	'05 - Pre-App > 05 - Correspondence > 02 - External':
		'Pre-application > Correspondence > External',
	'05 - Pre-App > 06 - Meetings': 'Pre-application > Events / meetings',
	'05 - Pre-App > 06 - Meetings > 01 - Outreach': 'Pre-application > Events / meetings > Outreach',
	'05 - Pre-App > 07 - Developers Consultation': "Pre-application > Developer's consulation",
	'05 - Pre-App > 07 - Developers Consultation > 01 - Statutory':
		"Pre-application > Developer's consulation > Statutory",
	'05 - Pre-App > 07 - Developers Consultation > 01 - Statutory > 01 - PEIR':
		"Pre-application > Developer's consulation > Statutory > PEIR",
	'05 - Pre-App > 07 - Developers Consultation > 02 - Non-Statutory':
		"Pre-application > Developer's consulation > Non-statutory",
	'05 - Pre-App > 07 - Developers Consultation > 03 - Consultation Feedback':
		"Pre-application > Developer's consulation > Consultation feedback",

	'06 - Post-Submission Correspondence > 01 - Acceptance': 'Acceptance > Correspondence',
	'06 - Post-Submission Correspondence > 01 - Acceptance > 01 - Internal':
		'Acceptance > Correspondence > 01 - Internal',
	'06 - Post-Submission Correspondence > 01 - Acceptance > 02 - External':
		'Acceptance > Correspondence > 02 - External',
	'06 - Post-Submission Correspondence > 03 - Recommendation': 'Recommendation > Correspondence',
	'06 - Post-Submission Correspondence > 03 - Recommendation > 01 - Internal':
		'Recommendation > Correspondence > 01 - Internal',
	'06 - Post-Submission Correspondence > 03 - Recommendation > 02 - External':
		'Recommendation > Correspondence > 02 - External',
	'06 - Post-Submission Correspondence > 04 - Decision': 'Decision > Correspondence',
	'06 - Post-Submission Correspondence > 04 - Decision > 01 - Internal':
		'Decision > Correspondence > 01 - Internal',
	'06 - Post-Submission Correspondence > 04 - Decision > 02 - External':
		'Decision > Correspondence > 02 - External',
	'06 - Post-Submission Correspondence > 05 - Post-Decision > 01 - Internal':
		'Post-decision > Correspondence > 01 - Internal',
	'06 - Post-Submission Correspondence > 05 - Post-Decision > 02 - External':
		'Post-decision > Correspondence > 02 - External',
	'06 - Post-Submission Correspondence > 06 - SoS': 'Decision > SoS consultation > Correspondence',
	'06 - Post-Submission Correspondence > 06 - SoS > 01 - Internal':
		'Decision > SoS consultation > Correspondence > 01 - Internal',
	'06 - Post-Submission Correspondence > 06 - SoS > 02 - External':
		'Decision > SoS consultation > Correspondence > 02 - External',

	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance': 'Acceptance',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents':
		'Acceptance > Application documents',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 01 - Application Form':
		'Acceptance > Application documents > Application form',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 02 - Compulsory Acquisition Information':
		'Acceptance > Application documents > Compulsory acquisition information',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 03 - DCO Documents':
		'Acceptance > Application documents > DCO documents',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 04 - Environmental Statement':
		'Acceptance > Application documents > Environmental statement',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 05 - Other Documents':
		'Acceptance > Application documents > Other documents',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 06 - Plans':
		'Acceptance > Application documents > Plans',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 07 - Reports':
		'Acceptance > Application documents > Reports',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 01 - Application Documents > 08 - Additional Reg 6 Information':
		'Acceptance > Application documents > Additional Reg 6 information',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 02 - Adequacy of Consultation':
		'Acceptance > Adequacy of consultation',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 03 - Reg 5':
		'Acceptance > Reg 5 and Reg 6',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 04 - EST': 'Acceptance > EST',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 05 - Drafting':
		'Acceptance > Drafting and decision',
	'07 - Acceptance, Pre-Exam and Exam > 01 - Acceptance > 06 - Decision':
		'Acceptance > Drafting and decision',
	'07 - Acceptance, Pre-Exam and Exam > 02 - Post Submission Changes':
		'Pre-examination > Additional submissions > Post submission changes',
	'07 - Acceptance, Pre-Exam and Exam > 03 - Additional Submissions':
		'Examination > Additional submissions',
	'07 - Acceptance, Pre-Exam and Exam > 05 - Exam Timetable': 'Examination > Examination timetable',
	'07 - Acceptance, Pre-Exam and Exam > 08 - Legal Advice': 'Legal advice',
	'07 - Acceptance, Pre-Exam and Exam > 09 - Relevant Representation Attachments':
		'Relevant representations',

	'08 - Recommendation': 'Recommendation',
	'08 - Recommendation > 01 - Documents Received': 'Recommendation > Documents received',
	'08 - Recommendation > 02 - Drafting': 'Recommendation > Recommendation report > Drafts',
	'08 - Recommendation > 03 - Final Submitted Report':
		'Recommendation > Recommendation report > Final submitted report',

	'09 - Decision': 'Decision',
	'09 - Decision > 01 - SoS Consultation': 'Decision > SoS consultation',
	'09 - Decision > 01 - SoS Consultation > 01 - Consultation Docs':
		'Decision > SoS consultation > Consultation documents',
	'09 - Decision > 01 - SoS Consultation > 02 - Post Exam Submissions':
		'Decision > SoS consultation > Post examination submissions',
	'09 - Decision > 02 - SoS Decision': 'Decision > SoS Decision',

	'10 - Post Decision': 'Post-decision',
	'10 - Post Decision > 01 - Feedback': 'Post-decision > Feedback',
	'10 - Post Decision > 02 - JR': 'Post-decision > Judicial review',
	'10 - Post Decision > 03 - Non-Material Change': 'Post-decision > Non-material change',
	'10 - Post Decision > 03 - Non-Material Change > 01 - Application Documents':
		'Post-decision > Non-material change > Application documents',
	'10 - Post Decision > 03 - Non-Material Change > 02 - Consultation Responses':
		'Post-decision > Non-material change > Consultation responses',
	'10 - Post Decision > 03 - Non-Material Change > 03 - Procedural Decisions':
		'Post-decision > Non-material change > Procedural decisions',
	'10 - Post Decision > 04 - Costs': 'Post-decision > Costs',

	Unmapped: 'Archived documentation'
};

/**
 * Mapping of Horizon folder paths to their Back Office equivalent, depending on the file's stage
 */
export const stageMap = {
	'06 - Post-Submission Correspondence': {
		examination: 'Examination > Correspondence',
		acceptance: 'Acceptance > Correspondence',
		decision: 'Decision > Correspondence',
		'pre-examination': 'Pre-examination > Correspondence',
		recommendation: 'Recommendation > Correspondence',
		null: 'Archived documentation > 06 - Post-Submission Correspondence'
	},
	'06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam': {
		examination: 'Examination > Correspondence',
		acceptance: 'Acceptance > Correspondence',
		decision: 'Decision > Correspondence',
		'pre-examination': 'Pre-examination > Correspondence',
		recommendation: 'Recommendation > Correspondence',
		null: 'Archived documentation > 06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam'
	},
	'06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam > 01 - Internal': {
		examination: 'Examination > Correspondence > 01 - Internal',
		acceptance: 'Acceptance > Correspondence > 01 - Internal',
		decision: 'Decision > Correspondence > 01 - Internal',
		'pre-examination': 'Pre-examination > Correspondence > 01 - Internal',
		recommendation: 'Recommendation > Correspondence > 01 - Internal',
		null: 'Archived documentation > 06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam > 01 - Internal'
	},
	'06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam > 02 - External': {
		examination: 'Examination > Correspondence > 02 - External',
		acceptance: 'Acceptance > Correspondence > 02 - External',
		decision: 'Decision > Correspondence > 02 - External',
		'pre-examination': 'Pre-examination > Correspondence > 02 - External',
		recommendation: 'Recommendation > Correspondence > 02 - External',
		null: 'Archived documentation > 06 - Post-Submission Correspondence > 02 - Pre-Exam and Exam > 02 - External'
	},
	'07 - Acceptance, Pre-Exam and Exam': {
		examination: 'Examination',
		acceptance: 'Acceptance',
		decision: 'Decision',
		'pre-examination': 'Pre-examination',
		recommendation: 'Recommendation',
		null: 'Archived documentation > 07 - Acceptance, Pre-Exam and Exam'
	},
	'07 - Acceptance, Pre-Exam and Exam > 04 - Procedural Decisions': {
		examination: 'Examination > Procedural decisions',
		'pre-examination': 'Pre-examination > Procedural decisions',
		null: 'Archived documentation > 07 - Acceptance, Pre-Exam and Exam > 04 - Procedural Decisions'
	},
	'07 - Acceptance, Pre-Exam and Exam > 04 - Procedural Decisions > 01 - Drafts': {
		examination: 'Examination > Procedural decisions',
		'pre-examination': 'Pre-examination > Procedural decisions',
		null: 'Archived documentation > 07 - Acceptance, Pre-Exam and Exam > 04 - Procedural Decisions > 01 - Drafts'
	},
	'07 - Acceptance, Pre-Exam and Exam > 06 - EIA': {
		'pre-application': 'Pre-application > EIA',
		examination: 'Examination > EIA',
		'pre-examination': 'Pre-examination > EIA',
		null: 'Archived documentation > 07 - Acceptance, Pre-Exam and Exam > 06 - EIA'
	},
	'07 - Acceptance, Pre-Exam and Exam > 07 - Habitat Regs': {
		'pre-application': 'Pre-application > Habitat regulations',
		'pre-examination': 'Pre-examination > Habitat regulations',
		examination: 'Examination > Habitat regulations',
		null: 'Archived documentation > 07 - Acceptance, Pre-Exam and Exam > 07 - Habitat Regs'
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

/**
 * look up path in maps, or create it if not found
 * @param documentPath
 * @param caseId
 * @return {Promise<number>}
 */
export const getDocumentFolderId = async ({ path, documentCaseStage }, caseId) => {
	const folders = path.split('/').slice(1); // index 0 is project name/root, not needed
	if (folders.length === 0) throw `unexpected path format: ${path}`;
	const documentPath = folders.join(' > ');

	logger.info(`path: ${documentPath}, documentCaseStage: ${documentCaseStage}`);

	if (folders[0] === '02 - Section 51 Advice') {
		logger.info('Path is S51 advice folder');
		return getS51AdviceFolderId(caseId);
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
		logger.info(`Creating folders within Archive folder: ${documentPath}`);
		folderId = await createArchivedFolders(folders, caseId);
	}

	if (!folderId) throw `folderId not found`;

	return folderId;
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
const createFolders = async (folders, caseId, parentFolderId) => {
	for (const folderName of folders) {
		const folderUpsertInput = { caseId, parentFolderId, displayNameEn: folderName };
		const folderObject = await databaseConnector.folder.upsert({
			where: { caseId_displayNameEn_parentFolderId: folderUpsertInput },
			update: {},
			create: folderUpsertInput
		});
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
export const buildFolderPaths = (folders, paths = {}, parentPath = []) => {
	folders.forEach((folder) => {
		let path = parentPath ? parentPath.concat(folder.displayNameEn) : [folder.displayNameEn];
		paths[path.join(' > ')] = folder.id;

		if (folder.children.length > 0) {
			buildFolderPaths(folder.children, paths, path);
		}
	});
	return paths;
};

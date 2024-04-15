import { folderDocumentCaseStageMappings } from '../../../applications/constants.js';

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
					displayNameEn: 'Mail merge spreadsheet',
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
					stage: folderDocumentCaseStageMappings.PRE_EXAMINATION
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
					stage: folderDocumentCaseStageMappings.EXAMINATION
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
				},
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
		displayOrder: 1400
	}
];

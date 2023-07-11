import { databaseConnector } from '../utils/database-connector.js';

/** @typedef {import('@pins/api').Schema.Folder} Folder */
/** @typedef {import('@pins/applications').FolderTemplate} FolderTemplate */
/** @typedef {import('@pins/applications').ChildFolderTemplate} ChildFolderTemplate */
/** @typedef {import('@pins/applications').FolderDetails} FolderDetails */

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @param {number |null} parentFolderId
 * @returns {Promise<Folder[]>}
 */
export const getByCaseId = (caseId, parentFolderId = null) => {
	// if no parentFolderId, null value in the call, to get the top level folders on the case

	return databaseConnector.folder.findMany({ where: { caseId, parentFolderId } });
};

/**
 * Returns a single folder on a case
 *
 * @param {number} folderId
 * @returns {Promise<Folder |null>}
 */
export const getById = (folderId) => {
	return databaseConnector.folder.findUnique({ where: { id: folderId } });
};

/**
 * find a folder in an array
 *
 * @param { Folder[] } folders
 * @param { number } id
 * @returns { Folder |null}
 */
const findFolder = (folders, id) => {
	const matchedFolder = folders.find((folder) => folder.id === id);

	return matchedFolder ?? null;
};

/**
 * Returns array of folder path (parent folders) from current folder upwards
 * used for breadcrumbs etc
 *
 * @param {number} caseId
 * @param {number} currentFolderId
 * @returns {Promise<(Folder |null)[]>}
 */
export const getFolderPath = async (caseId, currentFolderId) => {
	const allFolders = await databaseConnector.folder.findMany({ where: { caseId } });

	let folderPath = [];

	/** @type {number | null} */ let searchId = currentFolderId;
	let currentFolder;

	do {
		currentFolder = findFolder(allFolders, searchId);
		folderPath.push(currentFolder);
		searchId = currentFolder?.parentFolderId ?? null;
	} while (searchId);

	// tree is traversed in order, we want it reversed
	if (folderPath) {
		folderPath = folderPath.reverse();
	}
	return folderPath;
};

/**
 *
 * @param {number} caseId
 * @param {string} folderName
 * @returns {Promise<(Folder |null)>}
 */
export const getFolderByNameAndCaseId = (caseId, folderName) => {
	return databaseConnector.folder.findFirst({
		where: { caseId, displayNameEn: folderName }
	});
};

/**
 * @param {Object} folder
 * @param {string} folder.displayNameEn
 * @param {number} folder.caseId
 * @param {number|null} folder.parentFolderId
 * @param {number|null} folder.displayOrder
 * @returns {Promise<(Folder |null)>}
 */
export const createFolder = (folder) => {
	return databaseConnector.folder.create({ data: folder });
};

/**
 * Deletes many folders by array of ids
 *
 * @param {number[]} idsToDelete
 * @returns
 */
export const deleteFolderMany = (idsToDelete) => {
	return databaseConnector.folder.deleteMany({
		where: {
			id: {
				in: idsToDelete
			}
		}
	});
};

/**
 * Deletes folder by id
 *
 * @param {number} id
 * @returns
 */
export const deleteById = (id) => {
	return databaseConnector.folder.delete({
		where: { id }
	});
};

/**
 * adds the caseId to a folder ready for db creation, and recursively adds to all child folders
 *
 * @param {number} caseId
 * @param {FolderTemplate} folder
 * @returns {FolderTemplate}
 */
const mapFolderTemplateWithCaseId = (caseId, folder) => {
	folder.caseId = caseId;

	if (folder.childFolders && folder.childFolders.create) {
		for (let /** @type {FolderTemplate} */ child of folder.childFolders.create) {
			child = mapFolderTemplateWithCaseId(caseId, child);
		}
	}

	return folder;
};

/**
 * Creates the top level folders on a case using the folder template
 * and recursively creates all sub folders.
 * Returns an array of promises
 *
 * @param {number} caseId
 * @returns {Promise<Folder>[]}
 */
export const createFolders = (caseId) => {
	const foldersCreated = [];

	// Prisma many to nested many does not work, so we cannot create the top folders and all subfolders nested using createMany.
	// so we loop through the top folders, using create to create the folder and all its subfolders, correctly assigning caseId, parentFolderId etc
	// and we return an array of these promises
	for (const topLevelFolder of defaultCaseFolders) {
		const newFolders = {
			data: mapFolderTemplateWithCaseId(caseId, topLevelFolder)
		};

		const topFoldersCreated = databaseConnector.folder.create(newFolders);

		foldersCreated.push(topFoldersCreated);
	}

	return foldersCreated;
};

/**
 *
 * @param {number} folderId
 * @param {*} updateValues
 * @returns {Promise<(Folder |null)>}
 */
export const updateFolderById = (folderId, updateValues) => {
	return databaseConnector.folder.update({
		where: { id: folderId },
		data: updateValues
	});
};

/**
 * The default template folder structure for a new NI Applications type case
 *
 * @type {FolderTemplate[]} defaultCaseFolders
 */
const defaultCaseFolders = [
	{
		displayNameEn: 'Project management',
		displayOrder: 100,
		stage: null,
		childFolders: {
			create: [
				{
					displayNameEn: 'Logistics',
					displayOrder: 100,
					stage: null,
					childFolders: {
						create: [
							{
								displayNameEn: 'Travel',
								displayOrder: 100,
								stage: null
							},
							{
								displayNameEn: 'Welsh',
								displayOrder: 200,
								stage: null
							}
						]
					}
				},
				{
					displayNameEn: 'Mail merge spreadsheet',
					displayOrder: 200,
					stage: null
				},
				{
					displayNameEn: 'Fees',
					displayOrder: 300,
					stage: null
				}
			]
		}
	},
	{
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		stage: null
	},
	{
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		stage: 'Pre-application',
		childFolders: {
			create: [
				{
					displayNameEn: 'First screening',
					displayOrder: 100,
					stage: 'Pre-application'
				},
				{
					displayNameEn: 'Second screening',
					displayOrder: 200,
					stage: 'Pre-application'
				}
			]
		}
	},
	{
		displayNameEn: 'Land rights',
		displayOrder: 400,
		stage: null,
		childFolders: {
			create: [
				{
					displayNameEn: 'S52',
					displayOrder: 100,
					stage: null,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: null
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: null
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: null
							}
						]
					}
				},
				{
					displayNameEn: 'S53',
					displayOrder: 200,
					stage: null,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: null
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: null
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: null
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
		stage: null
	},
	{
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		stage: 'Pre-application',
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: 'Pre-application'
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: 'Pre-application'
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 300,
					stage: 'Pre-application',
					childFolders: {
						create: [
							{
								displayNameEn: 'Screening',
								displayOrder: 100,
								stage: 'Pre-application'
							},
							{
								displayNameEn: 'Scoping',
								displayOrder: 200,
								stage: 'Pre-application',
								childFolders: {
									create: [
										{
											displayNameEn: 'Responses',
											displayOrder: 100,
											stage: 'Pre-application'
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
					stage: 'Pre-application'
				},
				{
					displayNameEn: 'Evidence plans',
					displayOrder: 500,
					stage: 'Pre-application'
				},
				{
					displayNameEn: 'Draft documents',
					displayOrder: 600,
					stage: 'Pre-application'
				},
				{
					displayNameEn: "Developer's consultation",
					displayOrder: 700,
					stage: 'Pre-application',
					childFolders: {
						create: [
							{
								displayNameEn: 'Statutory',
								displayOrder: 100,
								stage: 'Pre-application'
							},
							{
								displayNameEn: 'Non-statutory',
								displayOrder: 200,
								stage: 'Pre-application'
							},
							{
								displayNameEn: 'Consultation feedback',
								displayOrder: 300,
								stage: 'Pre-application'
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
		stage: 'Acceptance',
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: 'Acceptance'
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: 'Acceptance'
				},
				{
					displayNameEn: 'EST',
					displayOrder: 300,
					stage: 'Acceptance'
				},
				{
					displayNameEn: 'Application documents',
					displayOrder: 400,
					stage: 'Acceptance',
					childFolders: {
						create: [
							{
								displayNameEn: 'Application form',
								displayOrder: 100,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Compulsory acquisition information',
								displayOrder: 200,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'DCO documents',
								displayOrder: 300,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Environmental statement',
								displayOrder: 400,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Other documents',
								displayOrder: 500,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Plans',
								displayOrder: 600,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Reports',
								displayOrder: 700,
								stage: 'Acceptance'
							},
							{
								displayNameEn: 'Additional Reg 6 information',
								displayOrder: 800,
								stage: 'Acceptance'
							}
						]
					}
				},
				{
					displayNameEn: 'Adequacy of consultation',
					displayOrder: 500,
					stage: 'Acceptance'
				},
				{
					displayNameEn: 'Reg 5 and Reg 6',
					displayOrder: 600,
					stage: 'Acceptance'
				},
				{
					displayNameEn: 'Drafting and decision',
					displayOrder: 700,
					stage: 'Acceptance'
				}
			]
		}
	},
	{
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		stage: 'Pre-examination',
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: 'Pre-examination'
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: 'Pre-examination'
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 300,
					stage: 'Pre-examination',
					childFolders: {
						create: [
							{
								displayNameEn: 'Post submission changes',
								displayOrder: 100,
								stage: 'Pre-examination'
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: 'Pre-examination'
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: 'Pre-examination'
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: 'Pre-examination'
				}
			]
		}
	},
	{
		displayNameEn: 'Relevant representations',
		displayOrder: 900,
		stage: 'Pre-examination'
	},
	{
		displayNameEn: 'Examination',
		displayOrder: 1000,
		stage: 'Examination',
		childFolders: {
			create: [
				{
					displayNameEn: 'Correspondence',
					displayOrder: 100,
					stage: 'Examination'
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 200,
					stage: 'Examination'
				},
				{
					displayNameEn: 'Examination timetable',
					displayOrder: 300,
					stage: 'Examination',
					childFolders: {
						// for examination timetable we storing date in yyyyMMdd(20231230) format for display order.
						// To display other in the end we need to put other in highest possible order.
						create: [
							{
								displayNameEn: 'Other',
								displayOrder: 30000000,
								stage: 'Examination'
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: 'Examination'
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: 'Examination'
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: 'Examination'
				}
			]
		}
	},
	{
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		stage: 'Recommendation',
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: 'Recommendation'
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: 'Recommendation'
				},
				{
					displayNameEn: 'Recommendation report',
					displayOrder: 300,
					stage: 'Recommendation',
					childFolders: {
						create: [
							{
								displayNameEn: 'Drafts',
								displayOrder: 100,
								stage: 'Recommendation'
							},
							{
								displayNameEn: 'Final submitted report',
								displayOrder: 200,
								stage: 'Recommendation'
							}
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Decision',
		displayOrder: 1200,
		stage: 'Decision',
		childFolders: {
			create: [
				{
					displayNameEn: 'SoS consultation',
					displayOrder: 100,
					stage: 'Decision'
				},
				{
					displayNameEn: 'SoS decision',
					displayOrder: 200,
					stage: 'Decision'
				}
			]
		}
	},
	{
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		stage: 'Post-decision',
		childFolders: {
			create: [
				{
					displayNameEn: 'Judicial review',
					displayOrder: 100,
					stage: 'Post-decision'
				},
				{
					displayNameEn: 'Costs',
					displayOrder: 200,
					stage: 'Post-decision'
				},
				{
					displayNameEn: 'Non-material change',
					displayOrder: 300,
					stage: 'Post-decision'
				},
				{
					displayNameEn: 'Material change',
					displayOrder: 400,
					stage: 'Post-decision'
				},
				{
					displayNameEn: 'Redetermination',
					displayOrder: 500,
					stage: 'Post-decision'
				}
			]
		}
	}
];

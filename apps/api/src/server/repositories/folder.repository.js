import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */
/** @typedef {import('@pins/applications').FolderTemplate} FolderTemplate */
/** @typedef {import('@pins/applications').ChildFolderTemplate} ChildFolderTemplate */
/** @typedef {import('@pins/applications').FolderDetails} FolderDetails */

// Define all the case stages that can be mapped to folders
const CASE_STAGE_PRE_APPLICATION = 'Pre-application';
const CASE_STAGE_ACCEPTANCE = 'Acceptance';
const CASE_STAGE_PRE_EXAMINATION = 'Pre-examination';
const CASE_STAGE_EXAMINATION = 'Examination';
const CASE_STAGE_RECOMMENDATION = 'Recommendation';
const CASE_STAGE_DECISION = 'Decision';
const CASE_STAGE_POST_DECISION = 'Post-decision';

// Define top level case stage mappings so we can change in one single place if needed
const folderCaseStageMappings = {
	PROJECT_MANAGEMENT: null,
	LEGAL_ADVICE: null,
	TRANSBOUNDARY: CASE_STAGE_PRE_APPLICATION,
	LAND_RIGHTS: null,
	S51_ADVICE: null,
	PRE_APPLICATION: CASE_STAGE_PRE_APPLICATION,
	ACCEPTANCE: CASE_STAGE_ACCEPTANCE,
	PRE_EXAMINATION: CASE_STAGE_PRE_EXAMINATION,
	RELEVANT_REPRESENTATIONS: CASE_STAGE_PRE_EXAMINATION,
	EXAMINATION: CASE_STAGE_EXAMINATION,
	RECOMMENDATION: CASE_STAGE_RECOMMENDATION,
	DECISION: CASE_STAGE_DECISION,
	POST_DECISION: CASE_STAGE_POST_DECISION
};

/**
 * Returns array of folders in a folder or case (if parentFolderId is null)
 *
 * @param {number} caseId
 * @param {number |null} parentFolderId
 * @returns {Promise<Folder[]>}
 */
export const getByCaseId = async (caseId, parentFolderId = null) => {
	// if no parentFolderId, null value in the call, to get the top level folders on the case

	const result = await databaseConnector.folder.findMany({ where: { caseId, parentFolderId } });
	if (!Array.isArray(result)) {
		return [];
	}

	return result;
};

/**
 * Returns full array of folders in a case
 *
 * @param {number} caseId
 * @returns {Promise<Folder[]>}
 * */
export const getAllByCaseId = async (caseId) => {
	const result = await databaseConnector.folder.findMany({ where: { caseId } });
	if (!Array.isArray(result)) {
		return [];
	}

	return result;
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
 * Returns the requested folder along with all of its parents
 *
 * @param {number} folderId
 * @returns {Promise<Folder[]>}
 * */
export const getFolderWithParents = async (folderId) => {
	const folder = await databaseConnector.folder.findUnique({ where: { id: folderId } });
	if (!folder) {
		return [];
	}

	if (!folder.parentFolderId) {
		return [folder];
	}

	const parents = await getFolderWithParents(folder.parentFolderId);

	return [folder, ...parents];
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
		stage: folderCaseStageMappings.PROJECT_MANAGEMENT,
		childFolders: {
			create: [
				{
					displayNameEn: 'Logistics',
					displayOrder: 100,
					stage: folderCaseStageMappings.PROJECT_MANAGEMENT,
					childFolders: {
						create: [
							{
								displayNameEn: 'Travel',
								displayOrder: 100,
								stage: folderCaseStageMappings.PROJECT_MANAGEMENT
							},
							{
								displayNameEn: 'Welsh',
								displayOrder: 200,
								stage: folderCaseStageMappings.PROJECT_MANAGEMENT
							}
						]
					}
				},
				{
					displayNameEn: 'Mail merge spreadsheet',
					displayOrder: 200,
					stage: folderCaseStageMappings.PROJECT_MANAGEMENT
				},
				{
					displayNameEn: 'Fees',
					displayOrder: 300,
					stage: folderCaseStageMappings.PROJECT_MANAGEMENT
				}
			]
		}
	},
	{
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		stage: folderCaseStageMappings.LEGAL_ADVICE
	},
	{
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		stage: folderCaseStageMappings.TRANSBOUNDARY,
		childFolders: {
			create: [
				{
					displayNameEn: 'First screening',
					displayOrder: 100,
					stage: folderCaseStageMappings.TRANSBOUNDARY
				},
				{
					displayNameEn: 'Second screening',
					displayOrder: 200,
					stage: folderCaseStageMappings.TRANSBOUNDARY
				}
			]
		}
	},
	{
		displayNameEn: 'Land rights',
		displayOrder: 400,
		stage: folderCaseStageMappings.LAND_RIGHTS,
		childFolders: {
			create: [
				{
					displayNameEn: 'S52',
					displayOrder: 100,
					stage: folderCaseStageMappings.LAND_RIGHTS,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: folderCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: folderCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: folderCaseStageMappings.LAND_RIGHTS
							}
						]
					}
				},
				{
					displayNameEn: 'S53',
					displayOrder: 200,
					stage: folderCaseStageMappings.LAND_RIGHTS,
					childFolders: {
						create: [
							{
								displayNameEn: 'Applicant request',
								displayOrder: 100,
								stage: folderCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Recommendation and authorisation',
								displayOrder: 200,
								stage: folderCaseStageMappings.LAND_RIGHTS
							},
							{
								displayNameEn: 'Correspondence',
								displayOrder: 300,
								stage: folderCaseStageMappings.LAND_RIGHTS
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
		stage: folderCaseStageMappings.S51_ADVICE
	},
	{
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		stage: folderCaseStageMappings.PRE_APPLICATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 300,
					stage: folderCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Screening',
								displayOrder: 100,
								stage: folderCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Scoping',
								displayOrder: 200,
								stage: folderCaseStageMappings.PRE_APPLICATION,
								childFolders: {
									create: [
										{
											displayNameEn: 'Responses',
											displayOrder: 100,
											stage: folderCaseStageMappings.PRE_APPLICATION
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
					stage: folderCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Evidence plans',
					displayOrder: 500,
					stage: folderCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Draft documents',
					displayOrder: 600,
					stage: folderCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: "Developer's consultation",
					displayOrder: 700,
					stage: folderCaseStageMappings.PRE_APPLICATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Statutory',
								displayOrder: 100,
								stage: folderCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Non-statutory',
								displayOrder: 200,
								stage: folderCaseStageMappings.PRE_APPLICATION
							},
							{
								displayNameEn: 'Consultation feedback',
								displayOrder: 300,
								stage: folderCaseStageMappings.PRE_APPLICATION
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
		stage: folderCaseStageMappings.ACCEPTANCE,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'EST',
					displayOrder: 300,
					stage: folderCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Application documents',
					displayOrder: 400,
					stage: folderCaseStageMappings.ACCEPTANCE,
					childFolders: {
						create: [
							{
								displayNameEn: 'Application form',
								displayOrder: 100,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Compulsory acquisition information',
								displayOrder: 200,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'DCO documents',
								displayOrder: 300,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Environmental statement',
								displayOrder: 400,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Other documents',
								displayOrder: 500,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Plans',
								displayOrder: 600,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Reports',
								displayOrder: 700,
								stage: folderCaseStageMappings.ACCEPTANCE
							},
							{
								displayNameEn: 'Additional Reg 6 information',
								displayOrder: 800,
								stage: folderCaseStageMappings.ACCEPTANCE
							}
						]
					}
				},
				{
					displayNameEn: 'Adequacy of consultation',
					displayOrder: 500,
					stage: folderCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Reg 5 and Reg 6',
					displayOrder: 600,
					stage: folderCaseStageMappings.ACCEPTANCE
				},
				{
					displayNameEn: 'Drafting and decision',
					displayOrder: 700,
					stage: folderCaseStageMappings.ACCEPTANCE
				}
			]
		}
	},
	{
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		stage: folderCaseStageMappings.PRE_EXAMINATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 300,
					stage: folderCaseStageMappings.PRE_EXAMINATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Post submission changes',
								displayOrder: 100,
								stage: folderCaseStageMappings.PRE_EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: folderCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: folderCaseStageMappings.PRE_EXAMINATION
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: folderCaseStageMappings.PRE_EXAMINATION
				}
			]
		}
	},
	{
		displayNameEn: 'Relevant representations',
		displayOrder: 900,
		stage: folderCaseStageMappings.RELEVANT_REPRESENTATIONS
	},
	{
		displayNameEn: 'Examination',
		displayOrder: 1000,
		stage: folderCaseStageMappings.EXAMINATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Correspondence',
					displayOrder: 100,
					stage: folderCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 200,
					stage: folderCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'Examination timetable',
					displayOrder: 300,
					stage: folderCaseStageMappings.EXAMINATION,
					childFolders: {
						// for examination timetable we storing date in yyyyMMdd(20231230) format for display order.
						// To display other in the end we need to put other in highest possible order.
						create: [
							{
								displayNameEn: 'Other',
								displayOrder: 30000000,
								stage: folderCaseStageMappings.EXAMINATION
							}
						]
					}
				},
				{
					displayNameEn: 'Procedural decisions',
					displayOrder: 400,
					stage: folderCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'EIA',
					displayOrder: 500,
					stage: folderCaseStageMappings.EXAMINATION
				},
				{
					displayNameEn: 'Habitat regulations',
					displayOrder: 600,
					stage: folderCaseStageMappings.EXAMINATION
				}
			]
		}
	},
	{
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		stage: folderCaseStageMappings.RECOMMENDATION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Events / meetings',
					displayOrder: 100,
					stage: folderCaseStageMappings.RECOMMENDATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderCaseStageMappings.RECOMMENDATION
				},
				{
					displayNameEn: 'Recommendation report',
					displayOrder: 300,
					stage: folderCaseStageMappings.RECOMMENDATION,
					childFolders: {
						create: [
							{
								displayNameEn: 'Drafts',
								displayOrder: 100,
								stage: folderCaseStageMappings.RECOMMENDATION
							},
							{
								displayNameEn: 'Final submitted report',
								displayOrder: 200,
								stage: folderCaseStageMappings.RECOMMENDATION
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
		stage: folderCaseStageMappings.DECISION,
		childFolders: {
			create: [
				{
					displayNameEn: 'SoS consultation',
					displayOrder: 100,
					stage: folderCaseStageMappings.DECISION
				},
				{
					displayNameEn: 'SoS decision',
					displayOrder: 200,
					stage: folderCaseStageMappings.DECISION
				}
			]
		}
	},
	{
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		stage: folderCaseStageMappings.POST_DECISION,
		childFolders: {
			create: [
				{
					displayNameEn: 'Judicial review',
					displayOrder: 100,
					stage: folderCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Costs',
					displayOrder: 200,
					stage: folderCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Non-material change',
					displayOrder: 300,
					stage: folderCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Material change',
					displayOrder: 400,
					stage: folderCaseStageMappings.POST_DECISION
				},
				{
					displayNameEn: 'Redetermination',
					displayOrder: 500,
					stage: folderCaseStageMappings.POST_DECISION
				}
			]
		}
	}
];

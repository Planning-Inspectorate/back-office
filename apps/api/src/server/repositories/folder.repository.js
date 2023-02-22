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
 * The default template folder structure for a new NI Applications type case
 *
 * @type {FolderTemplate[]} defaultCaseFolders
 */
const defaultCaseFolders = [
	{
		displayNameEn: 'Project management',
		displayOrder: 100,
		childFolders: {
			create: [
				{
					displayNameEn: 'Logistics',
					displayOrder: 100,
					childFolders: {
						create: [
							{ displayNameEn: 'Travel', displayOrder: 100 },
							{ displayNameEn: 'Welsh', displayOrder: 200 }
						]
					}
				},
				{ displayNameEn: 'Mail merge spreadsheet', displayOrder: 200 },
				{ displayNameEn: 'Fees', displayOrder: 300 }
			]
		}
	},
	{ displayNameEn: 'Legal advice', displayOrder: 200 },
	{
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		childFolders: {
			create: [
				{ displayNameEn: 'First screening', displayOrder: 100 },
				{ displayNameEn: 'Second screening', displayOrder: 200 }
			]
		}
	},
	{
		displayNameEn: 'Land rights',
		displayOrder: 400,
		childFolders: {
			create: [
				{
					displayNameEn: 'S52',
					displayOrder: 100,
					childFolders: {
						create: [
							{ displayNameEn: 'Applicant request', displayOrder: 100 },
							{ displayNameEn: 'Recommendation and authorisation', displayOrder: 200 },
							{ displayNameEn: 'Correspondence', displayOrder: 300 }
						]
					}
				},
				{
					displayNameEn: 'S53',
					displayOrder: 200,
					childFolders: {
						create: [
							{ displayNameEn: 'Applicant request', displayOrder: 100 },
							{ displayNameEn: 'Recommendation and authorisation', displayOrder: 200 },
							{ displayNameEn: 'Correspondence', displayOrder: 300 }
						]
					}
				}
			]
		}
	},
	{ displayNameEn: 'S51 advice', displayOrder: 500 },
	{
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		childFolders: {
			create: [
				{ displayNameEn: 'Events / meetings', displayOrder: 100 },
				{ displayNameEn: 'Correspondence', displayOrder: 200 },
				{
					displayNameEn: 'EIA',
					displayOrder: 300,
					childFolders: {
						create: [
							{ displayNameEn: 'Screening', displayOrder: 100 },
							{
								displayNameEn: 'Scoping',
								displayOrder: 200,
								childFolders: {
									create: [{ displayNameEn: 'Responses', displayOrder: 100 }]
								}
							}
						]
					}
				},
				{ displayNameEn: 'Habitat regulations', displayOrder: 400 },
				{ displayNameEn: 'Evidence plans', displayOrder: 500 },
				{ displayNameEn: 'Draft documents', displayOrder: 600 },
				{
					displayNameEn: "Developer's consultation",
					displayOrder: 700,
					childFolders: {
						create: [
							{ displayNameEn: 'Statutory', displayOrder: 100 },
							{ displayNameEn: 'Non-statutory', displayOrder: 200 },
							{ displayNameEn: 'Consultation feedback', displayOrder: 300 }
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Acceptance',
		displayOrder: 700,
		childFolders: {
			create: [
				{ displayNameEn: 'Events / meetings', displayOrder: 100 },
				{ displayNameEn: 'Correspondence', displayOrder: 200 },
				{ displayNameEn: 'EST', displayOrder: 300 },
				{
					displayNameEn: 'Application documents',
					displayOrder: 400,
					childFolders: {
						create: [
							{ displayNameEn: 'Application form', displayOrder: 100 },
							{ displayNameEn: 'Compulsory acquisition information', displayOrder: 200 },
							{ displayNameEn: 'DCO documents', displayOrder: 300 },
							{ displayNameEn: 'Environmental statement', displayOrder: 400 },
							{ displayNameEn: 'Other documents', displayOrder: 500 },
							{ displayNameEn: 'Plans', displayOrder: 600 },
							{ displayNameEn: 'Reports', displayOrder: 700 },
							{ displayNameEn: 'Additional Reg 6 information', displayOrder: 800 }
						]
					}
				},
				{ displayNameEn: 'Adequacy of consultation', displayOrder: 500 },
				{ displayNameEn: 'Reg 5 and Reg 6', displayOrder: 600 },
				{ displayNameEn: 'Drafting and decision', displayOrder: 700 }
			]
		}
	},
	{
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		childFolders: {
			create: [
				{ displayNameEn: 'Events / meetings', displayOrder: 100 },
				{ displayNameEn: 'Correspondence', displayOrder: 200 },
				{
					displayNameEn: 'Additional submissions',
					displayOrder: 300,
					childFolders: {
						create: [{ displayNameEn: 'Post submission changes', displayOrder: 100 }]
					}
				},
				{ displayNameEn: 'Procedural decisions', displayOrder: 400 },
				{ displayNameEn: 'EIA', displayOrder: 500 },
				{ displayNameEn: 'Habitat regulations', displayOrder: 600 }
			]
		}
	},
	{ displayNameEn: 'Relevant representations', displayOrder: 900 },
	{
		displayNameEn: 'Examination',
		displayOrder: 1000,
		childFolders: {
			create: [
				{ displayNameEn: 'Correspondence', displayOrder: 100 },
				{ displayNameEn: 'Additional submissions', displayOrder: 200 },
				{
					displayNameEn: 'Examination timetable',
					displayOrder: 300,
					childFolders: {
						create: [
							{ displayNameEn: 'Preliminary meetings', displayOrder: 100 },
							{ displayNameEn: 'Site inspections', displayOrder: 200 }
						]
					}
				},
				{ displayNameEn: 'Procedural decisions', displayOrder: 400 },
				{ displayNameEn: 'EIA', displayOrder: 500 },
				{ displayNameEn: 'Habitat regulations', displayOrder: 600 }
			]
		}
	},
	{
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		childFolders: {
			create: [
				{ displayNameEn: 'Events / meetings', displayOrder: 100 },
				{ displayNameEn: 'Correspondence', displayOrder: 200 },
				{
					displayNameEn: 'Recommendation report',
					displayOrder: 300,
					childFolders: {
						create: [
							{ displayNameEn: 'Drafts', displayOrder: 100 },
							{ displayNameEn: 'Final submitted report', displayOrder: 200 }
						]
					}
				}
			]
		}
	},
	{
		displayNameEn: 'Decision',
		displayOrder: 1200,
		childFolders: {
			create: [
				{ displayNameEn: 'SoS consultation', displayOrder: 100 },
				{ displayNameEn: 'SoS decision', displayOrder: 200 }
			]
		}
	},
	{
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		childFolders: {
			create: [
				{ displayNameEn: 'Judicial review', displayOrder: 100 },
				{ displayNameEn: 'Costs', displayOrder: 200 },
				{ displayNameEn: 'Non-material change', displayOrder: 300 },
				{ displayNameEn: 'Material change', displayOrder: 400 },
				{ displayNameEn: 'Redetermination', displayOrder: 500 }
			]
		}
	}
];

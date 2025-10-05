import { databaseConnector } from '#utils/database-connector.js';
import { folderDocumentCaseStageMappings } from '#api-constants';
import BackOfficeAppError from '#utils/app-error.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */
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
 * @param {number} [parentFolderId]
 * @returns {Promise<(Folder |null)>}
 */
export const getFolderByNameAndCaseId = (caseId, folderName, parentFolderId) =>
	databaseConnector.folder.findFirst({
		where: {
			caseId,
			displayNameEn: folderName,
			...(parentFolderId ? { parentFolderId } : {})
		}
	});

/**
 * @param {number} parentFolderId
 * @param {object | null} options
 */
export const getFoldersByParentId = (parentFolderId, options = null) => {
	return databaseConnector.folder.findMany({
		where: {
			parentFolderId
		},
		...options
	});
};

/**
 * @param {Object} folder
 * @param {boolean} isCustom
 * @param {string} folder.displayNameEn
 * @param {number} folder.caseId
 * @param {number|null} folder.parentFolderId
 * @param {number|null} folder.displayOrder
 * @returns {Promise<(Folder |null)>}
 */
export const createFolder = async (folder, isCustom = true) => {
	const newFolder = await databaseConnector.folder.create({
		data: { ...folder, isCustom }
	});
	try {
		await setPath(newFolder.id, newFolder.parentFolderId);
	} catch (e) {
		throw new BackOfficeAppError(`Failed to set path for folder ${newFolder.id}`, 500);
	}
	return newFolder;
};

/**
 * @param {number} folderId
 * @returns {Promise<{ documentCount: number }>}
 * returns document count for a folder
 */
export const getDocumentCount = async (folderId) => {
	try {
		const documentCount = await databaseConnector.folder.findUnique({
			where: {
				id: folderId
			},
			select: {
				documentCount: true
			}
		});
		if (!documentCount) {
			console.error(`No document count for folder: ${folderId}`);
			return null;
		}
		return documentCount.documentCount;
	} catch (e) {
		throw new BackOfficeAppError(
			`Error connecting to DB when getting document count for folder: ${folderId}`
		);
	}
};

/**
 *
 * @param {number} id
 * @param {number|null} parentFolderId
 * @returns {Promise<(Folder |null)>}
 */
// sets the path for the folder
export const setPath = async (id, parentFolderId) => {
	if (parentFolderId) {
		const parentFolder = await getById(parentFolderId);
		if (parentFolder.path) {
			return databaseConnector.folder.update({
				where: { id },
				data: { path: `${parentFolder.path}/${id}` }
			});
		}
	}
	return databaseConnector.folder.update({
		where: { id },
		data: { path: `/${id}` }
	});
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

/** Map months folders for internal/external correspondence */
export const createCorrespondenceFolders = () => {
	const correspondenceTypes = ['Internal', 'External'];
	const allMonths = [
		'01 January',
		'02 February',
		'03 March',
		'04 April',
		'05 May',
		'06 June',
		'07 July',
		'08 August',
		'09 September',
		'10 October',
		'11 November',
		'12 December'
	];

	const monthsFolders = allMonths.map((month, index) => ({
		displayNameEn: month,
		displayOrder: 100 * (index + 1),
		stage: folderDocumentCaseStageMappings.CORRESPONDENCE
	}));

	return correspondenceTypes.map((type, index) => ({
		displayNameEn: type,
		displayOrder: 100 * (index + 1),
		stage: folderDocumentCaseStageMappings.CORRESPONDENCE,
		childFolders: {
			create: monthsFolders
		}
	}));
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
	folder.isCustom = folder.isCustom ?? false;

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
 * ! Only used for creating non-custom folders. !
 *
 * @param {number} caseId
 * @param {FolderTemplate[]} folders
 * @returns {Promise<Folder>[]}
 */
export const createFolders = async (caseId, folders = defaultCaseFolders) => {
	// const foldersCreated = [];

	// Prisma many to nested many does not work, so we cannot create the top folders and all subfolders nested using createMany.
	// so we loop through the top folders, using create to create the folder and all its subfolders, correctly assigning caseId, parentFolderId etc
	// and we return an array of these promises
	for (const topLevelFolder of folders) {
		const newFolders = {
			data: mapFolderTemplateWithCaseId(caseId, topLevelFolder)
		};

		const topFoldersCreated = await databaseConnector.folder.create(newFolders);
		await recursivelySetPaths(topFoldersCreated.id);
		// foldersCreated.push(topFoldersCreated);
	}
	// return foldersCreated;
};

/**
 * recursively navigates the folder structure and sets the path for each folder
 * @param {number} folderId
 **/
const recursivelySetPaths = async (folderId) => {
	const folder = await databaseConnector.folder.findUnique({
		where: { id: folderId },
		include: { childFolders: true }
	});

	if (folder && !folder.parentFolderId) await setPath(folder.id, null);

	if (!folder && !folder.childFolders) return;

	if (folder && !folder.childFolders) {
		await setPath(folder.id, folder.parentFolderId);
		return;
	}

	for (const childFolder of folder.childFolders) {
		await setPath(childFolder.id, childFolder.parentFolderId);
		await recursivelySetPaths(childFolder.id);
	}
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
 * Get the S51 Advice folder on a case
 *
 * @param {number} caseId
 * @returns {Promise<Folder |null>}
 */
export const getS51AdviceFolder = (caseId) => {
	return databaseConnector.folder.findFirst({
		where: {
			caseId,
			displayNameEn: 'S51 advice',
			parentFolderId: null
		}
	});
};

/**
 * decreases the document count for the folder a file is added to, and the ancestor folders
 * @param {number} folderId
 * @param {number} [decreaseBy=1] - Optional value to decrease document count by, default == 1
 * @returns Prisma.PrismaPromise<number>
 */
export const decreaseDocumentCount = async (folderId, decreaseBy) => {
	decreaseBy = decreaseBy || 1;
	const folder = await getById(folderId);
	if (!folder || !folder.path)
		throw new BackOfficeAppError(`Folder or folder path not found ${folderId}`);
	try {
		return databaseConnector.$executeRaw`UPDATE folder SET documentCount = documentCount - ${decreaseBy}
		WHERE ${folder.path} LIKE CONCAT(path, '%')`;
	} catch (e) {
		throw new BackOfficeAppError(`Couldn't decrease document count for folder ${folderId}`);
	}
};

/**
 * updates document count for the folder a file is added to, and the ancestor folders
 * @param {number} folderId
 * @param {number} [increaseBy=1] - Optional value to increase document count by, default == 1
 * @returns Prisma.PrismaPromise<number>
 */
export const increaseDocumentCount = async (folderId, increaseBy) => {
	increaseBy = increaseBy || 1;
	const folder = await getById(folderId);
	if (!folder || !folder.path)
		throw new BackOfficeAppError(`Folder or folder path not found ${folderId}`);
	try {
		return databaseConnector.$executeRaw`UPDATE folder SET documentCount = documentCount + ${increaseBy}
		WHERE ${folder.path} LIKE CONCAT(path, '%')`;
	} catch (e) {
		throw new BackOfficeAppError(`Couldn't increase document count for folder ${folderId}`);
	}
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
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION
				},
				{
					displayNameEn: 'Correspondence',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION
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
					stage: folderDocumentCaseStageMappings.PRE_APPLICATION
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
								stage: folderDocumentCaseStageMappings.PRE_APPLICATION
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
					stage: folderDocumentCaseStageMappings.ACCEPTANCE
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
					stage: folderDocumentCaseStageMappings.RECOMMENDATION
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
					stage: folderDocumentCaseStageMappings.DECISION
				},
				{
					displayNameEn: 'SoS decision',
					displayOrder: 200,
					stage: folderDocumentCaseStageMappings.DECISION
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
					stage: folderDocumentCaseStageMappings.POST_DECISION
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
				}
			]
		}
	}
];

import lodash from 'lodash-es';
import { databaseConnector } from '../utils/database-connector.js';

/** @typedef {import('@pins/api').Schema.Folder} Folder */
/** @typedef {import('@pins/applications').FolderTemplate} FolderTemplate */
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
export const getFolder = (folderId) => {
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
 * Creates the top level folders on a case using the folder template
 * and recursively creates all sub folders
 *
 * @param {number} caseId
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createFolders = async (caseId) => {
	const foldersToCreateTopLevel = {
		data: defaultCaseFolders.map((folder) => ({
			...lodash.omit(folder, ['childFolders', 'uniqueId']),
			caseId
		}))
	};
	const foldersCreated = await databaseConnector.folder.createMany(foldersToCreateTopLevel);

	if (foldersCreated) {
		const topLevelFolders = await getByCaseId(caseId, null);

		// and then recursively create any sub folders of these top level folders,
		// by getting the matching template folder, and its child folder structure to be created
		for (const /** @type {Folder} */ folder of topLevelFolders) {
			if (defaultCaseFolders.some((x) => x.displayNameEn === folder.displayNameEn)) {
				const templateIds = [];
				const templateFolder = defaultCaseFolders.find(
					(x) => x.displayNameEn === folder.displayNameEn
				);

				if (templateFolder) {
					templateIds.push(templateFolder.uniqueId);

					const childFoldersRequired = defaultCaseFolders.find(
						(x) => x.displayNameEn === folder.displayNameEn
					)?.childFolders;

					if (childFoldersRequired) {
						await createSubFolders(caseId, folder.id, childFoldersRequired, templateIds);
					}
				}
			}
		}
	}

	return foldersCreated;
};

/**
 * This recursively creates each of the child folders on a parent folder
 *
 * @param {number} caseId
 * @param {number |null} parentFolderId
 * @param {FolderTemplate[]} childFolders
 * @param {number[]} templateIds
 * @returns {Promise<import('@pins/api').Schema.BatchPayload>}
 */
export const createSubFolders = async (caseId, parentFolderId, childFolders, templateIds) => {
	// create each subfolder
	const subFoldersToCreate = {
		data: childFolders.map((folder) => ({
			...lodash.omit(folder, ['childFolders', 'uniqueId']),
			caseId,
			parentFolderId
		}))
	};
	const foldersCreated = await databaseConnector.folder.createMany(subFoldersToCreate);

	if (foldersCreated) {
		const subFoldersCreated = await getByCaseId(caseId, parentFolderId);
		const parentTemplateFolder = getFolderTemplate(templateIds);

		if (parentTemplateFolder) {
			// and then recursively create the sub folders of these folders
			for (const /** @type {Folder} */ folder of subFoldersCreated) {
				if (folder) {
					// get the template for this sub folder
					const templateFolder = getChildFolderTemplateByName(
						parentTemplateFolder,
						folder.displayNameEn
					);

					// get the child folder structure to be created
					if (templateFolder && templateFolder.childFolders) {
						/** @type {FolderTemplate[] |undefined} childFoldersRequired */
						const childFoldersRequired = templateFolder.childFolders;

						// copy *values* of current array and add this template folder id
						const newTemplateIds = [...templateIds];

						if (templateFolder.uniqueId) {
							newTemplateIds.push(templateFolder.uniqueId);
						}

						await createSubFolders(caseId, folder.id, childFoldersRequired, newTemplateIds);
					}
				}
			}
		}
	}

	return foldersCreated;
};

/**
 * Drills through the default case folder templates using the array of IDs,
 * to return the required template folder
 *
 * @param {number[]} templateIdList
 * @returns {FolderTemplate |undefined}
 */
const getFolderTemplate = (templateIdList) => {
	// get the template for this folder
	/** @type {FolderTemplate |undefined} */
	let templateFolder;
	let firstTime = true;

	// 1st index is for the top level
	const firstTemplateId = templateIdList.find(() => true);

	if (defaultCaseFolders.some((x) => x.uniqueId === Number(firstTemplateId))) {
		templateFolder = defaultCaseFolders.find((x) => x.uniqueId === Number(firstTemplateId));
	}
	for (const templateId of templateIdList) {
		// skip the first 1
		if (firstTime) {
			firstTime = false;
		} else if (templateFolder?.childFolders?.some((x) => x.uniqueId === templateId)) {
			templateFolder = templateFolder.childFolders.find((x) => x.uniqueId === templateId);
		}
	}

	return templateFolder;
};

/**
 * finds a child folder template by name and returns it
 *
 * @param {FolderTemplate} parentFolder
 * @param {string} childName
 * @returns {FolderTemplate |undefined}
 */
const getChildFolderTemplateByName = (parentFolder, childName) => {
	let childFolder;

	if (parentFolder.childFolders) {
		childFolder = parentFolder.childFolders.find((f) => f.displayNameEn === childName);
	}

	return childFolder;
};

/**
 * The default template folder structure for a new NI Applications type case
 *
 * @type {FolderTemplate[]} defaultCaseFolders
 */
export const defaultCaseFolders = [
	{
		displayNameEn: 'Project management',
		displayOrder: 100,
		uniqueId: 100,
		childFolders: [
			{
				displayNameEn: 'Logistics',
				displayOrder: 100,
				uniqueId: 110,
				childFolders: [
					{ displayNameEn: 'Travel', displayOrder: 100, uniqueId: 111 },
					{ displayNameEn: 'Welsh', displayOrder: 200, uniqueId: 112 }
				]
			},
			{ displayNameEn: 'Mail merge spreadsheet', displayOrder: 200, uniqueId: 120 },
			{ displayNameEn: 'Fees', displayOrder: 300, uniqueId: 130 }
		]
	},
	{ displayNameEn: 'Legal advice', displayOrder: 200, uniqueId: 200 },
	{
		displayNameEn: 'Transboundary',
		displayOrder: 300,
		uniqueId: 300,
		childFolders: [
			{ displayNameEn: 'First screening', displayOrder: 100, uniqueId: 310 },
			{ displayNameEn: 'Second screening', displayOrder: 200, uniqueId: 320 }
		]
	},
	{
		displayNameEn: 'Land rights',
		displayOrder: 400,
		uniqueId: 400,
		childFolders: [
			{
				displayNameEn: 'S52',
				displayOrder: 100,
				uniqueId: 410,
				childFolders: [
					{ displayNameEn: 'Applicant request', displayOrder: 100, uniqueId: 411 },
					{ displayNameEn: 'Recommendation and authorisation', displayOrder: 200, uniqueId: 412 },
					{ displayNameEn: 'Correspondence', displayOrder: 300, uniqueId: 413 }
				]
			},
			{
				displayNameEn: 'S53',
				displayOrder: 200,
				uniqueId: 420,
				childFolders: [
					{ displayNameEn: 'Applicant request', displayOrder: 100, uniqueId: 421 },
					{ displayNameEn: 'Recommendation and authorisation', displayOrder: 200, uniqueId: 422 },
					{ displayNameEn: 'Correspondence', displayOrder: 300, uniqueId: 423 }
				]
			}
		]
	},
	{ displayNameEn: 'S51 advice', displayOrder: 500, uniqueId: 500 },
	{
		displayNameEn: 'Pre-application',
		displayOrder: 600,
		uniqueId: 600,
		childFolders: [
			{ displayNameEn: 'Events / meetings', displayOrder: 100, uniqueId: 610 },
			{ displayNameEn: 'Correspondence', displayOrder: 200, uniqueId: 620 },
			{
				displayNameEn: 'EIA',
				displayOrder: 300,
				uniqueId: 630,
				childFolders: [
					{ displayNameEn: 'Screening', displayOrder: 100, uniqueId: 631 },
					{
						displayNameEn: 'Scoping',
						displayOrder: 200,
						uniqueId: 632,
						childFolders: [{ displayNameEn: 'Responses', displayOrder: 100, uniqueId: 6321 }]
					}
				]
			},
			{ displayNameEn: 'Habitat regulations', displayOrder: 400, uniqueId: 640 },
			{ displayNameEn: 'Evidence plans', displayOrder: 500, uniqueId: 650 },
			{ displayNameEn: 'Draft documents', displayOrder: 600, uniqueId: 660 },
			{
				displayNameEn: 'Developers consultation',
				displayOrder: 700,
				uniqueId: 670,
				childFolders: [
					{ displayNameEn: 'Statutory', displayOrder: 100, uniqueId: 671 },
					{ displayNameEn: 'Non-statutory', displayOrder: 200, uniqueId: 672 },
					{ displayNameEn: 'Consultation feedback', displayOrder: 300, uniqueId: 673 }
				]
			}
		]
	},
	{
		displayNameEn: 'Acceptance',
		displayOrder: 700,
		uniqueId: 700,
		childFolders: [
			{ displayNameEn: 'Events / meetings', displayOrder: 100, uniqueId: 710 },
			{ displayNameEn: 'Correspondence', displayOrder: 200, uniqueId: 720 },
			{ displayNameEn: 'EST', displayOrder: 300, uniqueId: 730 },
			{
				displayNameEn: 'Application documents',
				displayOrder: 400,
				uniqueId: 740,
				childFolders: [
					{ displayNameEn: 'Application form', displayOrder: 100, uniqueId: 741 },
					{ displayNameEn: 'Compulsory acquisition information', displayOrder: 200, uniqueId: 742 },
					{ displayNameEn: 'DCO documents', displayOrder: 300, uniqueId: 743 },
					{ displayNameEn: 'Environmental statement', displayOrder: 400, uniqueId: 744 },
					{ displayNameEn: 'Other docuents', displayOrder: 500, uniqueId: 745 },
					{ displayNameEn: 'Plans', displayOrder: 600, uniqueId: 746 },
					{ displayNameEn: 'Reports', displayOrder: 700, uniqueId: 747 },
					{ displayNameEn: 'Additional Reg 6 information', displayOrder: 800, uniqueId: 748 }
				]
			},
			{ displayNameEn: 'Adequacy of consultation', displayOrder: 500, uniqueId: 750 },
			{ displayNameEn: 'Reg 5 and Reg 6', displayOrder: 600, uniqueId: 760 },
			{ displayNameEn: 'Drafting and decision', displayOrder: 700, uniqueId: 770 }
		]
	},
	{
		displayNameEn: 'Pre-examination',
		displayOrder: 800,
		uniqueId: 800,
		childFolders: [
			{ displayNameEn: 'Events / meetings', displayOrder: 100, uniqueId: 810 },
			{ displayNameEn: 'Correspondence', displayOrder: 200, uniqueId: 820 },
			{
				displayNameEn: 'Additional submissions',
				displayOrder: 300,
				uniqueId: 830,
				childFolders: [
					{ displayNameEn: 'Post submission changes', displayOrder: 100, uniqueId: 831 }
				]
			},
			{ displayNameEn: 'Procedural decisions', displayOrder: 400, uniqueId: 840 },
			{ displayNameEn: 'EIA', displayOrder: 500, uniqueId: 850 },
			{ displayNameEn: 'Habitat regulations', displayOrder: 600, uniqueId: 860 }
		]
	},
	{ displayNameEn: 'Relevant representations', displayOrder: 900, uniqueId: 900 },
	{
		displayNameEn: 'Examination',
		displayOrder: 1000,
		uniqueId: 1000,
		childFolders: [
			{ displayNameEn: 'Correspondence', displayOrder: 100, uniqueId: 1010 },
			{ displayNameEn: 'Additional submissions', displayOrder: 200, uniqueId: 1020 },
			{
				displayNameEn: 'Examination timetable',
				displayOrder: 300,
				uniqueId: 1030,
				childFolders: [
					{ displayNameEn: 'Preliminary meetings', displayOrder: 100, uniqueId: 1031 },
					{ displayNameEn: 'Site inspections', displayOrder: 200, uniqueId: 1032 }
				]
			},
			{ displayNameEn: 'Procedural decisions', displayOrder: 400, uniqueId: 1040 },
			{ displayNameEn: 'EIA', displayOrder: 500, uniqueId: 1050 },
			{ displayNameEn: 'Habitat regulations', displayOrder: 600, uniqueId: 1060 }
		]
	},
	{
		displayNameEn: 'Recommendation',
		displayOrder: 1100,
		uniqueId: 1100,
		childFolders: [
			{ displayNameEn: 'Events / meetings', displayOrder: 100, uniqueId: 1110 },
			{ displayNameEn: 'Correspondence', displayOrder: 200, uniqueId: 1120 },
			{
				displayNameEn: 'Recommendation report',
				displayOrder: 300,
				uniqueId: 1130,
				childFolders: [
					{ displayNameEn: 'Drafts', displayOrder: 100, uniqueId: 1131 },
					{ displayNameEn: 'Final submitted report', displayOrder: 200, uniqueId: 1132 }
				]
			}
		]
	},
	{
		displayNameEn: 'Decision',
		displayOrder: 1200,
		uniqueId: 1200,
		childFolders: [
			{ displayNameEn: 'SoS consultation', displayOrder: 100, uniqueId: 1210 },
			{ displayNameEn: 'Sos decision', displayOrder: 200, uniqueId: 1220 }
		]
	},
	{
		displayNameEn: 'Post-decision',
		displayOrder: 1300,
		uniqueId: 1300,
		childFolders: [
			{ displayNameEn: 'Judicial review', displayOrder: 100, uniqueId: 1310 },
			{ displayNameEn: 'Costs', displayOrder: 200, uniqueId: 1320 },
			{ displayNameEn: 'Non-material change', displayOrder: 300, uniqueId: 1330 },
			{ displayNameEn: 'Material change', displayOrder: 400, uniqueId: 1340 },
			{ displayNameEn: 'Redetermination', displayOrder: 500, uniqueId: 1350 }
		]
	}
];

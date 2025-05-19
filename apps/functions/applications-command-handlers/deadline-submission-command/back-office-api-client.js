import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';

const UNASSIGNED_FOLDER_NAME = 'Unassigned';
/** @typedef {{ id: number, displayNameEn: string }} FolderJSON */
/** @typedef {import('./lib.js').ExaminationTimetableItem} ExaminationTimetableItem */

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	try {
		const result = await requestWithApiKey
			.get(`https://${config.apiHost}/applications/reference/${caseReference}`)
			.json();

		return result.id;
	} catch (err) {
		throw new Error(`getCaseID failed for reference ${caseReference} with error: ${err}`);
	}
}

/**
 * @typedef {Object} SubmitDocumentParams
 * @property {number} caseID
 * @property {string} documentName
 * @property {string} description
 * @property {string | null} descriptionWelsh
 * @property {string} filter1
 * @property {string | null} filter1Welsh
 * @property {string} documentType
 * @property {number} documentSize
 * @property {number} folderID
 * @property {string} userEmail
 * */

/**
 *
 * @param {SubmitDocumentParams} _
 * */
async function submitDocument({
	caseID,
	documentName,
	description,
	descriptionWelsh,
	filter1,
	filter1Welsh,
	documentType,
	documentSize,
	folderID,
	userEmail
}) {
	try {
		return await requestWithApiKey
			.post(`https://${config.apiHost}/applications/${caseID}/documents?all=true`, {
				json: [
					{
						documentName,
						description,
						descriptionWelsh,
						filter1,
						filter1Welsh,
						documentType,
						documentSize,
						folderId: folderID,
						username: userEmail,
						fromFrontOffice: true
					}
				]
			})
			.json();
	} catch (err) {
		throw new Error(`submitDocument failed for case ID ${caseID} with error: ${err}`);
	}
}

/**
 * Checks if the exam item folder exists for a given case ID and timetable item folder id - eg folder id for Deadline 1
 *
 * @param {number} caseID
 * @param {number} examItemFolderId
 * @param {string} timetableItemName
 * @returns {Promise<boolean>}
 * */
async function examTimetableItemFolderExists(caseID, examItemFolderId, timetableItemName) {
	/** @type {FolderJSON} */
	const examItemfolder = await (async () => {
		try {
			return await requestWithApiKey
				.get(`https://${config.apiHost}/applications/${caseID}/folders/${examItemFolderId}`)
				.json();
		} catch (err) {
			throw new Error(
				`fetching matching deadline folder failed for case ID ${caseID} and folder ID ${examItemFolderId} with error: ${err}`
			);
		}
	})();

	if (!examItemfolder) {
		throw new Error(`No matching exam item folder found with ID '${examItemFolderId}'`);
	}

	if (!examItemfolder.displayNameEn.endsWith(timetableItemName)) {
		throw new Error(
			`folder name ${examItemfolder.displayNameEn} does not match expected exam item name '${timetableItemName}'`
		);
	}

	return true;
}

/**
 * Gets the Exam Timetable sub item / line item folder ID for a given case ID, timetable item id, and line item name
 *
 * @param {number} caseID
 * @param {number} timetableItemFolderId
 * @param {string} lineItem
 * @returns {Promise<number>}
 * */
async function getExamTimetableLineItemFolderID(caseID, timetableItemFolderId, lineItem) {
	/** @type {FolderJSON[]} */
	const subfolders = await (async () => {
		try {
			return await requestWithApiKey
				.get(
					`https://${config.apiHost}/applications/${caseID}/folders/${timetableItemFolderId}/sub-folders`
				)
				.json();
		} catch (err) {
			throw new Error(
				`fetching subfolders failed for folder ID ${timetableItemFolderId} with error: ${err}`
			);
		}
	})();

	const subfolder = subfolders.find((f) => f.displayNameEn === lineItem);
	if (!subfolder) {
		throw new Error(`No folder found with name '${lineItem}'`);
	}

	return subfolder.id;
}

/**
 * Get the Id of the Unassigned folder for a timetable item
 * or null if it doesn't exist
 *
 * @param {number} caseID
 * @param {number} timetableItemFolderId
 * @param {import('@azure/functions').Context} context
 * @returns {Promise<number | null>}
 */
async function getUnassignedFolderId(caseID, timetableItemFolderId, context) {
	/** @type {FolderJSON[]} */
	const subfolders = await (async () => {
		try {
			return await requestWithApiKey
				.get(
					`https://${config.apiHost}/applications/${caseID}/folders/${timetableItemFolderId}/sub-folders`
				)
				.json();
		} catch (err) {
			throw new Error(
				`Unassigned folder: fetching subfolders failed for folder ID ${timetableItemFolderId} with error: ${err}`
			);
		}
	})();

	let unassignedFolder = subfolders.find((f) => f.displayNameEn === UNASSIGNED_FOLDER_NAME);
	if (!unassignedFolder || unassignedFolder.id === 0) {
		context.log(`No Unassigned folder found in parent folder ID ${timetableItemFolderId}`);
	}
	return unassignedFolder?.id ?? null;
}

/**
 * Get the Id of the Unassigned folder for a timetable item, or create it if it doesn't exist
 *
 * @param {number} caseID
 * @param {number} timetableItemFolderId
 * @param {import('@azure/functions').Context} context
 * @returns
 */
async function getOrCreateUnassignedFolderId(caseID, timetableItemFolderId, context) {
	// try to get the Unassigned folder ID
	let unassignedFolderId = await getUnassignedFolderId(caseID, timetableItemFolderId, context);
	if (!unassignedFolderId) {
		context.log(`Unassigned folder not initially found, creating it...`);

		try {
			let unassignedFolder = await requestWithApiKey
				.post(`https://${config.apiHost}/applications/${caseID}/folders/create-folder`, {
					json: {
						parentFolderId: timetableItemFolderId,
						name: UNASSIGNED_FOLDER_NAME
					}
				})
				.json();
			context.log(`Unassigned folder creation response: ${JSON.stringify(unassignedFolder)}`);
			if (unassignedFolder && unassignedFolder.id) {
				unassignedFolderId = unassignedFolder.id;
				context.log(`Unassigned folder created with ID ${unassignedFolderId}`);
			}
		} catch (err) {
			context.log(
				`Unassigned folder: Error creating Unassigned folder in parent folder ID ${timetableItemFolderId}: ${err}`
			);

			// in case of a concurrency error, try to get the folder again
			unassignedFolderId = await getUnassignedFolderId(caseID, timetableItemFolderId, context);
			if (unassignedFolderId) {
				context.log(`Unassigned folder found after creation attempt, ID: ${unassignedFolderId}`);
			} else {
				context.log(`Unassigned folder not found after creation attempt`);
				throw new Error(
					`Unassigned folder: Failed to create Unassigned folder in parent folder ID ${timetableItemFolderId}: Error: ${err}`
				);
			}
		}
	} else {
		context.log(`Unassigned folder found with ID ${unassignedFolderId}`);
	}
	return unassignedFolderId;
}

/**
 * Get an Exam timetable item by case ID and timetable item name
 *
 * @param {number} caseID
 * @param {string} timetableItemName
 * @returns {Promise<ExaminationTimetableItem | null>}
 * */
async function getTimetableItem(caseID, timetableItemName) {
	/** @type {{ items: ExaminationTimetableItem[] }} */
	const results = await (async () => {
		try {
			return await requestWithApiKey
				.get(`https://${config.apiHost}/applications/examination-timetable-items/case/${caseID}`)
				.json();
		} catch (err) {
			throw new Error(`Fetch for examination timetable failed for case ID ${caseID}: ${err}`);
		}
	})();

	return results?.items?.find((item) => item.name === timetableItemName) ?? null;
}

/**
 *
 * @param {number} caseID
 * @param {{ documentGuid: string, documentName: string, userName: string, deadline: string, submissionType: string, interestedPartyNumber?: string }} _
 * */
async function populateDocumentMetadata(
	caseID,
	{ documentGuid, documentName, userName, deadline, submissionType, interestedPartyNumber }
) {
	await requestWithApiKey.post(
		`https://${config.apiHost}/applications/${caseID}/documents/${documentGuid}/metadata`,
		{
			json: {
				version: 1,
				documentGuid,
				fileName: documentName,
				author: userName,
				interestedPartyNumber,
				filter1: deadline,
				filter2: submissionType
			}
		}
	);
}

export default {
	getCaseID,
	examTimetableItemFolderExists,
	getExamTimetableLineItemFolderID,
	getTimetableItem,
	getOrCreateUnassignedFolderId,
	submitDocument,
	populateDocumentMetadata
};

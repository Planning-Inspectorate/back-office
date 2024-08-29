import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';

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
 *
 * @param {number} caseID
 * @param {string} timetableItemName
 * @param {string} lineItem
 * @returns {Promise<number>}
 * */
async function getFolderID(caseID, timetableItemName, lineItem) {
	/** @type {FolderJSON[]} */
	const folders = await (async () => {
		try {
			return await requestWithApiKey
				.get(`https://${config.apiHost}/applications/${caseID}/folders?all=true`)
				.json();
		} catch (err) {
			throw new Error(`fetching folders failed for case ID ${caseID} with error: ${err}`);
		}
	})();

	const folder = folders.find((f) => f.displayNameEn.endsWith(timetableItemName));
	if (!folder) {
		throw new Error(`No folder found with name '${timetableItemName}'`);
	}

	/** @type {FolderJSON[]} */
	const subfolders = await (async () => {
		try {
			return await requestWithApiKey
				.get(`https://${config.apiHost}/applications/${caseID}/folders/${folder.id}/sub-folders`)
				.json();
		} catch (err) {
			throw new Error(`fetching subfolders failed for folder ID ${folder.id} with error: ${err}`);
		}
	})();

	const subfolder = subfolders.find((f) => f.displayNameEn === lineItem);
	if (!subfolder) {
		throw new Error(`No folder found with name '${lineItem}'`);
	}

	return subfolder.id;
}

/**
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
 * @param {{ documentGuid: string, documentName: string, userName: string, deadline: string, submissionType: string, representative?: string }} _
 * */
async function populateDocumentMetadata(
	caseID,
	{ documentGuid, documentName, userName, deadline, submissionType, representative }
) {
	await requestWithApiKey.post(
		`https://${config.apiHost}/applications/${caseID}/documents/${documentGuid}/metadata`,
		{
			json: {
				version: 1,
				documentGuid,
				fileName: documentName,
				author: userName,
				representative,
				filter1: deadline,
				filter2: submissionType
			}
		}
	);
}

export default {
	getCaseID,
	getFolderID,
	getTimetableItem,
	submitDocument,
	populateDocumentMetadata
};

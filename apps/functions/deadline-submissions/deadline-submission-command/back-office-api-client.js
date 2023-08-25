import got from 'got';
import config from './config.js';

/** @typedef {{ id: number, displayNameEn: string }} FolderJSON */

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	try {
		const result = await got
			.get(`https://${config.apiHost}/applications?reference=${caseReference}`)
			.json();

		return result.id;
	} catch (err) {
		throw new Error(`getCaseID failed for reference ${caseReference} with error: ${err}`);
	}
}

/**
 *
 * @param {{ caseID: number, documentName: string, documentType: string, documentSize: number, folderID: number, userEmail: string }} _
 * */
async function submitDocument({
	caseID,
	documentName,
	documentType,
	documentSize,
	folderID,
	userEmail
}) {
	try {
		return await got
			.post(`https://${config.apiHost}/applications/${caseID}/documents?all=true`, {
				json: [
					{
						documentName,
						documentType,
						documentSize,
						folderId: folderID,
						username: userEmail
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
			return await got.get(`https://${config.apiHost}/applications/${caseID}/folders`).json();
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
			return await got
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
 *
 * @param {number} caseID
 * @param {string} timetableItemName
 * @param {string} lineItem
 * @returns {Promise<boolean>}
 * */
async function lineItemExists(caseID, timetableItemName, lineItem) {
	/** @type {{ items: { name: string, description: string }[] }} */
	const results = await (async () => {
		try {
			return await got
				.get(`https://${config.apiHost}/applications/examination-timetable-items/case/${caseID}`)
				.json();
		} catch (err) {
			throw new Error(`fetching examinatino timetable items failed for case ID ${caseID}: ${err}`);
		}
	})();

	const timetableItem = results.items.find((item) => item.name === timetableItemName);
	if (!timetableItem) {
		return false;
	}

	/** @type {{ bulletPoints: string[] }} */
	const { bulletPoints } = JSON.parse(timetableItem.description);
	const _lineItem = bulletPoints.find((bp) => bp.trim() === lineItem);

	return _lineItem !== null;
}

export default {
	getCaseID,
	getFolderID,
	lineItemExists,
	submitDocument
};

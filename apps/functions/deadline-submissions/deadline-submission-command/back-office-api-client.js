import got from 'got';
import config from './config.js';

/** @typedef {{ id: number, displayNameEn: string }} FolderJSON */

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	const response = await got.get(
		`https://${config.API_HOST}/applications?reference=${caseReference}`
	);
	if (!response.ok) {
		return null;
	}

	return JSON.parse(response.body).id;
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
	return await got
		.post(`https://${config.API_HOST}/applications/${caseID}/documents`, {
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
	const folders = await got.get(`https://${config.API_HOST}/applications/${caseID}/folders`).json();

	const folder = folders.find((f) => f.displayNameEn === timetableItemName);
	if (!folder) {
		throw new Error(`No folder found with name '${timetableItemName}'`);
	}

	/** @type {FolderJSON[]} */
	const subfolders = await got
		.get(`https://${config.API_HOST}/applications/${caseID}/folders/${folder.id}/sub-folders`)
		.json();
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
	const response = await got.get(
		`https://${config.API_HOST}/applications/examination-timetable-items/case/${caseID}`
	);
	if (!response.ok) {
		return false;
	}

	/** @type {{ name: string, description: string }[]} */
	const timetableItems = JSON.parse(response.body);

	const timetableItem = timetableItems.find((item) => item.name === timetableItemName);
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

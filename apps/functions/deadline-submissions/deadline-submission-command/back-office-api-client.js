import got from 'got';
import config from './config';

/** @typedef {{ id: number, displayNameEn: string }} FolderJSON */

/**
 * @param {string} caseReference
 * @returns {Promise<number>}
 * */
async function getCaseID(caseReference) {
	const caseDetails = await got
		.get(`https://${config.API_HOST}/applications?=${caseReference}`)
		.json();
	return caseDetails.id;
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
		.post(`https://${config.API_HOST}/applications/${caseID}`, {
			json: {
				documentName,
				documentType,
				documentSize,
				folderId: folderID,
				username: userEmail
			}
		})
		.json();
}

/**
 *
 * @param {number} caseID
 * @param {string} caseName
 * @param {string} lineItem
 * @returns {Promise<number>}
 * */
async function getFolderID(caseID, caseName, lineItem) {
	/** @type {FolderJSON[]} */
	const folders = await got.get(`https://${config.API_HOST}/applications/${caseID}/folders`).json();

	const folder = folders.find((f) => f.displayNameEn === caseName);
	if (!folder) {
		throw new Error(`No folder found with name '${caseName}'`);
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

export default {
	getCaseID,
	getFolderID,
	submitDocument
};

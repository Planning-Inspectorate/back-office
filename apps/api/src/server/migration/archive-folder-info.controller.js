import {
	getDocumentsInFolder,
	getFolderByName,
	getFolderPath
} from '../applications/application/file-folders/folders.service.js';
import { getByRef as getCaseByRef } from '#repositories/case.repository.js';
import { getFoldersByParentId } from '#repositories/folder.repository.js';

const MAX_VALUE = 99999;

/**
 * @type {import("express").RequestHandler<{modelType: string}, ?, any[]>}
 */
export const getArchiveFolderInformation = async (req, res) => {
	if (!req.query.caseReferences || req.query.caseReferences.length === 0) {
		res.status(400).send({ message: 'caseReferences are required' });
		return;
	}

	const caseReferences = Array.isArray(req.query.caseReferences)
		? req.query.caseReferences
		: [req.query.caseReferences];

	const data = {};
	for (const caseReference of caseReferences) {
		const project = await getCaseByRef(caseReference);
		if (!project) {
			data[caseReference] = null;
			continue;
		}
		const caseId = project.id;
		const { id } = await getFolderByName(caseId, 'Archived documentation');
		data[caseReference] = await getAllFolderIdsWithDocCounts(caseId, id);
	}
	res.status(200).send(data);
};

const getAllFolderIdsWithDocCounts = async (caseId, folderId) => {
	const result = [];
	const childFolders = await getFoldersByParentId(folderId);
	const { itemCount: documentCount } = await getDocumentsInFolder(folderId, 1, MAX_VALUE);
	if (documentCount !== 0) {
		const folderPathDetails = await getFolderPath(caseId, folderId);
		const folderPath = folderPathDetails.reduce((accum, pathDetails) => {
			return `${accum}/${pathDetails.displayNameEn.trim()}`;
		}, '');
		result.push({ [folderPath]: documentCount });
	}

	for (const folder of childFolders) {
		const childResults = await getAllFolderIdsWithDocCounts(caseId, folder.id);
		result.push(...childResults);
	}
	return result;
};

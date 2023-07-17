/** @typedef {import('@pins/appeals/index.js').FileUploadInfo} FileUploadInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/** @typedef {import("../appeals.js").FolderInfo} FolderInfo */

/**
 *
 * @param {number} caseId
 * @param {string} blobStorageHost,
 * @param {string} blobStorageContainer,
 * @param {FileUploadInfo[]} documents
 * @returns {DocumentMetadata[]}
 */
export const mapDocumentsForDatabase = (
	caseId,
	blobStorageHost,
	blobStorageContainer,
	documents
) => {
	return documents?.map((document) => {
		return {
			name: document.documentName,
			caseId,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize,
			blobStorageContainer,
			blobStorageHost
		};
	});
};

/**
 * @param {(DocumentVersion|null)[]} documents
 * @param {string} caseReference
 * @param {number} versionId
 * @returns {(BlobInfo|null)[]}
 */
export const mapDocumentsForBlobStorage = (documents, caseReference, versionId = 1) => {
	return documents.map((document) => {
		if (document) {
			const fileName = document.fileName || document.documentGuid;
			return {
				caseType: 'appeal',
				caseReference,
				GUID: document.documentGuid,
				documentName: fileName,
				blobStoreUrl: mapBlobPath(document.documentGuid, caseReference, fileName, versionId)
			};
		}

		return null;
	});
};

/**
 * @type {(guid: string, caseReference: string, name: string, versionId: number) => string}
 */
export const mapBlobPath = (guid, caseReference, name, versionId = 1) => {
	return `appeal/${mapCaseReferenceForStorageUrl(caseReference)}/${guid}/v${versionId}/${name}`;
};

/**
 * @type {(caseReference: string) => string}
 */
export const mapCaseReferenceForStorageUrl = (caseReference) => {
	return caseReference.replace(/\//g, '-');
};

/**
 * @type {(sectionName: string, folderLayout: Object<string, Object>, folders: Folder[]) => void}
 */
export const mapFoldersLayoutForAppealSection = (sectionName, folderLayout, folders) => {
	for (const folderName of Object.keys(folderLayout)) {
		folderLayout[folderName] =
			mapFoldersLayoutForAppealFolder(folders, `${sectionName}/${folderName}`) || {};
	}
};

/**
 * @type {(folders: Folder[], path: string) => FolderInfo | void}
 */
const mapFoldersLayoutForAppealFolder = (folders, path) => {
	const folder = folders.find((f) => f.path === path);
	if (folder) {
		return {
			folderId: folder.id,
			path: folder.path,
			documents:
				folder.documents?.map((d) => {
					return {
						id: d.guid,
						name: d.name,
						folderId: d.folderId,
						caseId: folder.caseId
					};
				}) || []
		};
	}
};

/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{documents: DocumentUploadInfo[], blobStorageHost: string, blobStorageContainer: string, accessToken: AccessToken}} UploadInfo */

import { BlobServiceClient } from '@azure/storage-blob';
import { BlobStorageClient } from '@pins/blob-storage-client';

/**
 *
 * @param {HTMLElement} uploadForm
 * @returns {*}
 */
const serverActions = (uploadForm) => {
	/** @type {AnError[]} */
	const failedUploads = [];

	/**
	 *
	 * @param {FileWithRowId[]} fileList
	 * @returns {Promise<AnError[]>}
	 */
	const getUploadInfoFromInternalDB = async (fileList) => {
		const { folderId, caseId } = uploadForm.dataset;
		const payload = [...fileList].map((file) => ({
			documentName: file.name,
			documentSize: file.size,
			documentType: file.type,
			caseId,
			folderId,
			fileRowId: file.fileRowId
		}));

		return fetch(`/documents/${caseId}/upload/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((response) => response.json())
			.then((uploadsInfos) => {
				for (const documentUploadInfo of uploadsInfos.documents) {
					if (documentUploadInfo.failedReason) {
						failedUploads.push({
							message: 'GENERIC_SINGLE_FILE',
							fileRowId: documentUploadInfo.fileRowId,
							name: documentUploadInfo.documentName
						});
					}
				}

				return uploadsInfos;
			});
	};

	/**
	 *
	 * @param {FileWithRowId} file
	 * @returns {Promise<AnError[]>}
	 */
	const getVersionUploadInfoFromInternalDB = async (file) => {
		const { folderId, caseId, documentId } = uploadForm.dataset;
		const payload = {
			documentName: file.name,
			documentSize: file.size,
			documentType: file.type,
			caseId,
			folderId,
			fileRowId: file.fileRowId
		};

		return fetch(`/documents/${caseId}/upload/${documentId}/add-version`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((response) => response.json())
			.then((documentUploadInfo) => {
				if (documentUploadInfo.failedReason) {
					failedUploads.push({
						message: 'GENERIC_SINGLE_FILE',
						fileRowId: documentUploadInfo.fileRowId,
						name: documentUploadInfo.documentName
					});
				}

				return documentUploadInfo;
			});
	};

	/**
	 *
	 * @param {FileWithRowId[]} fileList
	 * @param {UploadInfo} uploadInfo
	 * @returns {Promise<AnError[]>}>}
	 */
	const uploadFiles = async (fileList, uploadInfo) => {
		const { documents, blobStorageHost, blobStorageContainer, accessToken } = uploadInfo;
		const blobEmulatorSasUrl = uploadForm.dataset.documentBlobEmulatorUrl ?? '';
		const blobStorageClient =
			blobEmulatorSasUrl && !accessToken
				? new BlobStorageClient(new BlobServiceClient(blobEmulatorSasUrl))
				: BlobStorageClient.fromUrlAndToken(blobStorageHost, accessToken);

		for (const documentUploadInfo of documents) {
			const fileToUpload = [...fileList].find(
				(file) => file.fileRowId === documentUploadInfo.fileRowId
			);
			const { blobStoreUrl } = documentUploadInfo;

			if (fileToUpload && blobStoreUrl) {
				const errorOutcome = await uploadOnBlobStorage(
					fileToUpload,
					blobStoreUrl,
					blobStorageClient,
					blobStorageContainer ?? 'document-service-uploads'
				);

				if (errorOutcome) {
					failedUploads.push(errorOutcome);
				}
			}
		}

		return failedUploads;
	};

	/**
	 *
	 * @param {FileWithRowId} fileToUpload
	 * @param {string} blobStoreUrl
	 * @param {import('@pins/blob-storage-client').BlobStorageClient} blobStorageClient
	 * @param {string} blobStorageContainer
	 * @returns {Promise<AnError | undefined>}
	 */
	const uploadOnBlobStorage = async (
		fileToUpload,
		blobStoreUrl,
		blobStorageClient,
		blobStorageContainer
	) => {
		let response;

		try {
			await blobStorageClient.uploadFile(
				blobStorageContainer,
				fileToUpload,
				blobStoreUrl,
				fileToUpload.type
			);
		} catch {
			response = {
				message: 'GENERIC_SINGLE_FILE',
				fileRowId: fileToUpload.fileRowId || '',
				name: fileToUpload.name
			};
		}

		return response;
	};

	return { getUploadInfoFromInternalDB, uploadFiles, getVersionUploadInfoFromInternalDB };
};

export default serverActions;

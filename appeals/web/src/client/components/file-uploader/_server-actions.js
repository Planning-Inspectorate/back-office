/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@pins/appeals/index.js').UploadRequest} UploadRequest */
/** @typedef {{folderId: string, documentId: string, caseId: string, blobStorageHost: string, blobStorageContainer: string, useBlobEmulator: string}} UploadForm */

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
		const { blobStorageHost, blobStorageContainer, folderId, caseId, documentType, documentStage } =
			uploadForm.dataset;
		const payload = {
			blobStorageHost: sanitiseStorageHost(blobStorageHost || ''),
			blobStorageContainer,
			documents: [...fileList].map((file) => ({
				documentName: file.name,
				documentSize: file.size,
				mimeType: file.type,
				documentType: documentType,
				stage: documentStage,
				caseId,
				folderId,
				fileRowId: file.fileRowId
			}))
		};

		return fetch(`/documents/${caseId}/upload/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((response) => {
				return response.json();
			})
			.then((responseJson) => {
				if ('error' in responseJson) {
					if (responseJson.error.code === 409) {
						const duplicateNameError = new Error('DUPLICATE_NAME_SINGLE_FILE');

						// @ts-ignore
						duplicateNameError.details = [
							{
								message: responseJson.error.body.fileName
							}
						];

						throw duplicateNameError;
					} else {
						throw new Error(responseJson.error?.message);
					}
				}

				for (const documentUploadInfo of responseJson.documents) {
					if (documentUploadInfo.failedReason) {
						failedUploads.push({
							message: documentUploadInfo.failedReason,
							fileRowId: documentUploadInfo.fileRowId,
							name: documentUploadInfo.documentName
						});
					}
				}

				return responseJson;
			});
	};

	/**
	 *
	 * @param {FileWithRowId} file
	 * @returns {Promise<AnError[]>}
	 */
	const getVersionUploadInfoFromInternalDB = async (file) => {
		const {
			blobStorageHost,
			blobStorageContainer,
			folderId,
			caseId,
			documentId,
			documentType,
			documentStage
		} = uploadForm.dataset;
		const payload = {
			blobStorageHost: sanitiseStorageHost(blobStorageHost || ''),
			blobStorageContainer,
			document: {
				documentName: file.name,
				documentSize: file.size,
				mimeType: file.type,
				documentType: documentType,
				stage: documentStage,
				caseId,
				folderId,
				fileRowId: file.fileRowId
			}
		};

		return fetch(`/documents/${caseId}/upload/${documentId}`, {
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
						message: documentUploadInfo.failedReason,
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
	 * @param {UploadRequest} uploadInfo
	 * @returns {Promise<AnError[]>}>}
	 */
	const uploadFiles = async (fileList, uploadInfo) => {
		const { documents, accessToken } = uploadInfo;
		const { blobStorageHost, blobStorageContainer, useBlobEmulator } =
			/** type: UploadForm **/ uploadForm.dataset;
		if (blobStorageHost == undefined || blobStorageContainer == undefined) {
			throw new Error('blobStorageHost or blobStorageContainer are undefined.');
		}
		const blobStorageClient =
			useBlobEmulator && !accessToken
				? new BlobStorageClient(new BlobServiceClient(blobStorageHost))
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
					blobStorageContainer
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

	/**
	 * @type {(host:string)  => string}
	 */
	const sanitiseStorageHost = (host) => {
		if (host.indexOf('?') > 0) {
			const urlParts = host.split('?');
			return urlParts[0];
		}

		return host;
	};

	return { getUploadInfoFromInternalDB, uploadFiles, getVersionUploadInfoFromInternalDB };
};

export default serverActions;

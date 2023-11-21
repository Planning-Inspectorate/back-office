/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, documentType: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{documents: DocumentUploadInfo[], blobStorageHost: string, privateBlobContainer: string, accessToken: AccessToken}} UploadInfo */
/** @typedef {{fileRowId: string, document: DocumentUploadInfo, blobStorageHost: string, privateBlobContainer: string, accessToken: AccessToken}} UploadFileInfo */

import { BlobStorageClient } from '@pins/blob-storage-client';
import sanitizeHtml from 'sanitize-html';

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
	 * @returns {Promise<{response: UploadInfo, errors: AnError[]}>}
	 */
	const getUploadInfoFromInternalDB = async (fileList) => {
		const { folderId, caseId, adviceId } = uploadForm.dataset;
		const payload = [...fileList].map((file) => ({
			documentName: file.name,
			documentSize: file.size,
			documentType: file.type,
			caseId,
			folderId,
			fileRowId: file.fileRowId
		}));

		let documentUploadUrl = `/documents/${caseId}/upload/`;
		if (adviceId) {
			documentUploadUrl = `/documents/${caseId}/s51-advice/${adviceId}/upload/`;
		}

		return fetch(documentUploadUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
			.then((response) => response.json())
			.then((uploadsInfos) => {
				if (uploadsInfos.failedDocuments || uploadsInfos.duplicates) {
					const failedDocuments = /** @type {string[]} */ (uploadsInfos.failedDocuments);
					const duplicates = /** @type {string[]} */ (uploadsInfos.duplicates);

					failedUploads.push(
						...failedDocuments.map((name, idx) => ({
							message: 'CONFLICT',
							name,
							fileRowId: `failedUpload${idx}`
						})),
						...duplicates.map((name, idx) => ({
							message: 'CONFLICT',
							name,
							fileRowId: `failedUpload${idx}`
						}))
					);
				}

				return { response: uploadsInfos, errors: failedUploads };
			});
	};

	/**
	 *
	 * @param {FileWithRowId} file
	 * @returns {Promise<{ response: DocumentUploadInfo[] }>}
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
	 * @param {File} file
	 * @returns {Promise<{ file: File | null, errors: AnError[] }>}
	 * */
	const processHTMLForYouTube = async (file) => {
		const readerPromise = new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = () => resolve(fr);
			fr.onerror = reject;
			fr.readAsText(file);
		});

		try {
			const reader = await readerPromise;
			const html = sanitizeHtml(reader.result, {
				allowedTags: ['iframe'],
				allowedAttributes: {
					iframe: ['src']
				}
			});

			const response = await fetch('/documents/process-html', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ html })
			});

			const result = await response.json();
			if (result.errors) {
				return {
					file: null,
					errors: [
						{
							message: result.errors,
							name: file.name,
							fileRowId: `file_row_${file.lastModified}_${file.size}`
						}
					]
				};
			}

			const newFile = new File([result.html], file.name, {
				type: 'text/html'
			});

			return { file: newFile, errors: [] };
		} catch (/** @type {*} */ error) {
			console.error(error);
			return {
				file: null,
				errors: [
					{
						message: error.message,
						name: file.name,
						fileRowId: `file_row_${file.lastModified}_${file.size}`
					}
				]
			};
		}
	};

	/**
	 *
	 * @param {FileWithRowId[]} fileList
	 * @param {UploadInfo} uploadInfo
	 * @returns {Promise<AnError[]>}>}
	 */
	const uploadFiles = async (fileList, uploadInfo) => {
		const { documents, blobStorageHost, privateBlobContainer, accessToken } = uploadInfo;

		const blobStorageClient = BlobStorageClient.fromUrlAndToken(blobStorageHost, accessToken);

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
					privateBlobContainer
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
	 * @param {FileWithRowId[]} fileList
	 * @param {UploadFileInfo} uploadInfo
	 * @returns {Promise<AnError[]>}>}
	 */
	const uploadFile = async (fileList, uploadInfo) => {
		const { fileRowId, blobStorageHost, privateBlobContainer, accessToken } = uploadInfo;

		const { blobStoreUrl } = uploadInfo.document;

		const blobStorageClient = BlobStorageClient.fromUrlAndToken(blobStorageHost, accessToken);

		const fileToUpload = [...fileList].find((file) => file.fileRowId === fileRowId);

		if (fileToUpload && blobStoreUrl) {
			const errorOutcome = await uploadOnBlobStorage(
				fileToUpload,
				blobStoreUrl,
				blobStorageClient,
				privateBlobContainer
			);

			if (errorOutcome) {
				failedUploads.push(errorOutcome);
			}
		}

		return failedUploads;
	};

	/**
	 *
	 * @param {FileWithRowId} fileToUpload
	 * @param {string} blobStoreUrl
	 * @param {import('@pins/blob-storage-client').BlobStorageClient} blobStorageClient
	 * @param {string} privateBlobContainer
	 * @returns {Promise<AnError | undefined>}
	 */
	const uploadOnBlobStorage = async (
		fileToUpload,
		blobStoreUrl,
		blobStorageClient,
		privateBlobContainer
	) => {
		let response;

		try {
			// todo: remove the initial / from backend
			await blobStorageClient.uploadFile(
				privateBlobContainer,
				fileToUpload,
				blobStoreUrl.slice(1),
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

	return {
		getUploadInfoFromInternalDB,
		uploadFiles,
		uploadFile,
		getVersionUploadInfoFromInternalDB,
		processHTMLForYouTube
	};
};

export default serverActions;

import { BlobServiceClient } from '@azure/storage-blob';

/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */
/** @typedef {{documentName: string, blobStoreURL?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{documents: DocumentUploadInfo[], blobStorageHost: string, blobStorageContainer: string, sasToken: string}} UploadInfo */

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
							// TODO: handle actual error message from api
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
	 * @param {FileWithRowId[]} fileList
	 * @param {UploadInfo} uploadInfo
	 * @returns {Promise<AnError[]>}>}
	 */
	const uploadFiles = async (fileList, uploadInfo) => {
		const { documents, blobStorageHost, blobStorageContainer, sasToken } = uploadInfo;
		const blobServiceClient = new BlobServiceClient(`${blobStorageHost}/?${sasToken}`);
		const containerClient = blobServiceClient.getContainerClient(blobStorageContainer);

		for (const documentUploadInfo of documents) {
			const fileToUpload = [...fileList].find(
				(file) => file.name === documentUploadInfo.documentName
			);
			const { blobStoreURL } = documentUploadInfo;

			if (fileToUpload && blobStoreURL) {
				const errorOutcome = await uploadOnBlobStorage(fileToUpload, blobStoreURL, containerClient);

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
	 * @param {string} blobStoreURL
	 * @param {import('@azure/storage-blob').ContainerClient} containerClient
	 * @returns {Promise<AnError | undefined>}
	 */
	const uploadOnBlobStorage = async (fileToUpload, blobStoreURL, containerClient) => {
		let response;

		try {
			const blobClient = containerClient.getBlockBlobClient(blobStoreURL);
			const options = { blobHTTPHeaders: { blobContentType: fileToUpload.type } };

			await blobClient.uploadData(fileToUpload, options);
		} catch {
			response = {
				message: 'GENERIC_SINGLE_FILE',
				fileRowId: fileToUpload.fileRowId || '',
				name: fileToUpload.name
			};
		}

		return response;
	};

	return { getUploadInfoFromInternalDB, uploadFiles };
};

export default serverActions;

import { BlobServiceClient } from '@azure/storage-blob';

/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{documents: DocumentUploadInfo[], blobStorageHost: string, blobStorageContainer: string, accessToken: AccessToken}} UploadInfo */

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
		const { documents, blobStorageHost, blobStorageContainer, accessToken } = uploadInfo;

		const blobServiceClient = new BlobServiceClient(blobStorageHost, {
			getToken: async () => accessToken
		});

		const containerClient = blobServiceClient.getContainerClient(blobStorageContainer);

		for (const documentUploadInfo of documents) {
			const fileToUpload = [...fileList].find(
				(file) => file.fileRowId === documentUploadInfo.fileRowId
			);
			const { blobStoreUrl } = documentUploadInfo;

			if (fileToUpload && blobStoreUrl) {
				const errorOutcome = await uploadOnBlobStorage(fileToUpload, blobStoreUrl, containerClient);

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
	 * @param {import('@azure/storage-blob').ContainerClient} containerClient
	 * @returns {Promise<AnError | undefined>}
	 */
	const uploadOnBlobStorage = async (fileToUpload, blobStoreUrl, containerClient) => {
		let response;

		try {
			const blobClient = containerClient.getBlockBlobClient(blobStoreUrl.slice(1));
			const options = { blobHTTPHeaders: { blobContentType: fileToUpload.type } };

			await blobClient.uploadData(fileToUpload, options);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error);
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

// TODO: all of this is just a mock meant to define the general structure

/**
 *
 * @param {Element} uploadForm
 * @returns {*}
 */
const serverActions = (uploadForm) => {
	/** @type {*} */
	const caseIdInput = uploadForm.querySelector('input[name="case-id"]');
	/** @type {*} */
	const folderIdInput = uploadForm.querySelector('input[name="folder-id"]');
	/** @type {*} */
	const nextPageUrlInput = uploadForm.querySelector('input[name="next-page-url"]');

	if (!nextPageUrlInput || !caseIdInput || !folderIdInput) return;

	const nextPageUrl = nextPageUrlInput.value;
	const caseId = caseIdInput.value;
	const folderId = folderIdInput.value;

	// TODO: change this name
	/**
	 *
	 * @param {FileList} fileList
	 * @returns {Promise<Response>}
	 */
	const preBlobStorage = async (fileList) => {
		const payload = [...fileList].map((file) => ({
			// fileRowId: `file_row_${file.lastModified}_${file.size}`,
			documentName: file.name,
			caseId,
			folderId
		}));

		return fetch(`/documents/${caseId}/upload/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		}).then((response) => {
			if (response.ok) return response.json();
		});
	};

	// TODO: change this name
	/**
	 *
	 * @param {FileList} fileList
	 * @param {Array<*>} filesUploadInfos
	 * @returns {Promise<boolean>}
	 */
	const blobStorage = async (fileList, filesUploadInfos) => {
		const failedUploads = [];

		for (const uploadInfo of filesUploadInfos) {
			const fileToUpload = [...fileList].find((file) => file.name === uploadInfo.documentName);

			if (fileToUpload) {
				const fileRowId = `file_row_${fileToUpload.lastModified}_${fileToUpload.size}`;

				if (uploadInfo.blobStoreURL) {
					const uploadOutcome = await uploadOnBlobStorageUpload(fileToUpload, uploadInfo);

					if (!uploadOutcome.outcome) {
						failedUploads.push(uploadOutcome);
					}
				} else {
					failedUploads.push({
						message: 'GENERIC_SINGLE_FILE',
						fileRowId,
						name: uploadInfo.documentName
					});
				}
			}
		}

		if (failedUploads.length > 0) {
			// eslint-disable-next-line no-throw-literal
			throw { message: 'FILE_SPECIFIC_ERRORS', details: failedUploads };
		}

		return nextPageUrl;
	};

	// this is mocking the fetch to the blob storage link
	/**
	 *
	 * @param {File} fileToUpload
	 * @param {{failedReason: string, documentName: string}} uploadInfo
	 * @returns {Promise<*>}
	 */
	const uploadOnBlobStorageUpload = async (fileToUpload, uploadInfo) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ outcome: true, fileToUpload, uploadInfo });
			}, 500);
		});
	};

	return { preBlobStorage, blobStorage };
};

export default serverActions;

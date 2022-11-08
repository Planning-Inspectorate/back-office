/**
 *
 * @param {HTMLElement} uploadForm
 * @returns {*}
 */
const serverActions = (uploadForm) => {
	/**
	 *
	 * @param {FileList} fileList
	 * @returns {Promise<Response>}
	 */
	const getUploadInfoFromInternalDB = async (fileList) => {
		const { folderId, caseId } = uploadForm.dataset;
		const payload = [...fileList].map((file) => ({
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
	 * @returns {Promise<Array<{message: string, fileRowId: string, name: string}>>}>}
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

		return failedUploads;
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
				// console.log('SUCCESSFUL UPLOAD OF', fileToUpload.name)
				resolve({ outcome: true, fileToUpload, uploadInfo });
			}, 500);
		});
	};

	return { getUploadInfoFromInternalDB, blobStorage };
};

export default serverActions;

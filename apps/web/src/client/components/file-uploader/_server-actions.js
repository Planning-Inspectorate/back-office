// TODO: all of this is just a mock meant to define the general structure

/**
 *
 * @param {Element} uploadForm
 * @returns {*}
 */
const serverActions = (uploadForm) => {
	/** @type {*} */
	const uploadUrlInput = uploadForm.querySelector('input[name="upload-url"]');
	/** @type {*} */
	const nextPageUrlInput = uploadForm.querySelector('input[name="next-page-url"]');

	if (!uploadUrlInput || !nextPageUrlInput) return;

	const uploadUrl = uploadUrlInput.value;
	const nextPageUrl = nextPageUrlInput.value;

	// TODO: change this name
	/**
	 *
	 * @param {FileList} fileList
	 * @returns {Promise<Response>}
	 */
	const preBlobStorage = async (fileList) => {
		const payload = [...fileList].map((file) => ({
			fileRowId: `file_row_${file.lastModified}_${file.size}`,
			documentName: file.name
		}));

		return fetch(uploadUrl, {
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
	 * @param {Array<*>} filesUploadInfos
	 * @returns {Promise<boolean>}
	 */
	const blobStorage = async (filesUploadInfos) => {
		const failedUploads = [];

		for (const uploadInfo of filesUploadInfos) {
			const uploadOutcome = await uploadOnBlobStorageUpload(uploadInfo);

			if (!uploadOutcome.outcome) {
				failedUploads.push(uploadOutcome);
			}
		}

		if (failedUploads.length > 0) {
			// eslint-disable-next-line no-throw-literal
			throw { message: 'FILE_SPECIFIC_ERRORS', details: failedUploads };
		}

		return nextPageUrl;
	};

	// this is mocking the fetch to the blob storage link
	// one hardcoded filerowid is mocking the fail for one single file
	// another hardcoded filerowid is mocking the timeout
	// the real way this will be handled depends on the blob storage response but for the moment
	// it's useful for testing the error handling on the UI
	/**
	 *
	 * @param {{fileRowId: string, documentName: string}} uploadInfo
	 * @returns {Promise<*>}
	 */
	const uploadOnBlobStorageUpload = async (uploadInfo) => {
		return new Promise((resolve, reject) => {
			const { fileRowId, documentName } = uploadInfo;

			setTimeout(() => {
				if (fileRowId !== 'file_row_1663752620328_1643900') {
					if (fileRowId === 'file_row_1666618034112_361918') {
						resolve({
							message: 'GENERIC_SINGLE_FILE',
							fileRowId,
							name: documentName,
							outcome: false
						});
					} else {
						resolve({ outcome: true });
					}
				}

				reject(new Error('TIMEOUT'));
			}, 500);
		});
	};

	return { preBlobStorage, blobStorage };
};

export default serverActions;

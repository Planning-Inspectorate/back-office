import { errorMessage, showErrors } from './_errors.js';
import serverActions from './_server-actions.js';

/**
 *
 * @param {number} sizesInBytes
 * @returns {string}
 */
const renderSizeInMainUnit = (sizesInBytes) => {
	// TODO: not totally clear, for now always returns the size in MB

	return `${Math.round(sizesInBytes * 1e-5) / 10} MB`;
};

/**
 * @param {File} uploadedFile
 * @returns {string}
 */
const buildRegularListItem = (uploadedFile) => {
	const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;

	return `<li class="pins-file-upload--file-row" id="${fileRowId}">
				<p class="govuk-heading-s" aria-details="File name">${uploadedFile.name} (${renderSizeInMainUnit(
		uploadedFile.size
	)})</p>
				<button
				id="button-remove-${fileRowId}"
				type="button" class="govuk-link pins-file-upload--remove" aria-details="Remove added file from list">
					Remove
				</button>
			</li>`;
};

/**
 * @param {File} uploadedFile
 * @param {string} message
 * @returns {string}
 */
const buildErrorListItem = (uploadedFile, message) => {
	const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;

	return `<li class="pins-file-upload--file-row" id="${fileRowId}">
				<p class="govuk-heading-s colour--red" aria-details="File name">${message}</p>
				</li>`;
};

/**
 *
 * @param {{show: boolean}} options
 * @param {Element} uploadForm
 */
export const buildProgressMessage = ({ show }, uploadForm) => {
	// TODO: do this
	const progressHook = uploadForm.querySelector('.progress-hook');

	if (progressHook) {
		progressHook.textContent = show ? 'Upload in progress...' : '';
	}
};

/**
 * UI features (file list and choose files button)
 *
 * @param {Element} uploadForm
 * @returns {*}
 */
const clientActions = (uploadForm) => {
	/** @type {HTMLElement | null} */
	const uploadButton = uploadForm.querySelector('.pins-file-upload--button');
	/** @type {HTMLElement | null} */
	const uploadCounter = uploadForm.querySelector('.pins-file-upload--counter');
	/** @type {HTMLElement | null} */
	const filesRows = uploadForm.querySelector('.pins-file-upload--files-rows');
	/** @type {*} */
	const uploadInput = uploadForm.querySelector('input[name="files"]');
	/** @type {HTMLElement | null} */
	const submitButton = uploadForm.querySelector('.pins-file-upload--submit');

	if (!uploadButton || !uploadInput || !filesRows || !uploadCounter || !submitButton) return;

	let globalDataTransfer = new DataTransfer();

	/**
	 * Execute actions after selecting the files to upload
	 *
	 * @param {*} event
	 */
	const onFileSelect = (event) => {
		const { target } = event;
		const { files: newFiles } = target;

		updateFilesRows(newFiles);
		updateButtonText();
	};

	/**
	 * Update button text and files counter
	 *
	 */
	const updateButtonText = () => {
		const filesRowsNumber = globalDataTransfer.files.length;

		uploadButton.innerHTML = filesRowsNumber > 0 ? 'Add more files' : 'Choose file';
		uploadButton.blur();
		uploadCounter.textContent = filesRowsNumber > 0 ? `${filesRowsNumber} files` : 'No file chosen';
	};

	/**
	 *	Add rows in the files list
	 *
	 * @param {FileList} newFiles
	 */
	const updateFilesRows = (newFiles) => {
		const allowedMimeTypes = uploadInput.accept.split(',');
		const wrongFiles = [];

		for (const uploadedFile of newFiles) {
			const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;
			const fileRow = uploadForm.querySelector(`#${fileRowId}`);

			if (!fileRow) {
				let listItem = '';

				if (uploadedFile.name.length > 255) {
					// TODO: add check for special characters
					listItem = buildErrorListItem(
						uploadedFile,
						errorMessage('NAME_SINGLE_FILE', uploadedFile.name)
					);
					wrongFiles.push({ message: 'NAME_SINGLE_FILE', name: uploadedFile.name, fileRowId });
				} else if (!allowedMimeTypes.includes(uploadedFile.type)) {
					// edge case: the accept attribute should prevent this
					listItem = buildErrorListItem(
						uploadedFile,
						errorMessage('TYPE_SINGLE_FILE', uploadedFile.name)
					);
					wrongFiles.push({ message: 'TYPE_SINGLE_FILE', name: uploadedFile.name, fileRowId });
				} else {
					globalDataTransfer.items.add(uploadedFile);
					listItem = buildRegularListItem(uploadedFile);
				}

				if (wrongFiles.length > 0) {
					showErrors({ message: 'FILE_SPECIFIC_ERRORS', details: wrongFiles }, uploadForm);
				}
				filesRows.innerHTML += listItem;
			}
		}

		for (const uploadedFile of newFiles) {
			const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;
			const removeButton = filesRows.querySelector(`#button-remove-${fileRowId}`);

			if (removeButton) {
				removeButton.addEventListener('click', () => removeFileRow(fileRowId));
			}
		}
	};

	/**
	 * Remove one specific row from the files list
	 *
	 * @param {string} fileRowId
	 */
	const removeFileRow = (fileRowId) => {
		const rowToRemove = uploadForm.querySelector(`#${fileRowId}`);

		if (rowToRemove) {
			const newDataTransfer = new DataTransfer();

			for (const currentFile of globalDataTransfer.files) {
				const size = fileRowId.split('_')[3];
				const lastModified = fileRowId.split('_')[2];

				if (`${currentFile.size}` !== size && `${currentFile.lastModified}` !== lastModified) {
					newDataTransfer.items.add(currentFile);
				}
			}

			globalDataTransfer = newDataTransfer;
			rowToRemove.remove();
			updateButtonText();
		}
	};

	const onSubmitValidation = async () => {
		const filesToUpload = globalDataTransfer.files;

		return new Promise((resolve, reject) => {
			const filesSize = [...filesToUpload].reduce((total, file) => total + file.size, 0);
			const filesNumber = filesToUpload.length;

			if (filesNumber === 0) {
				reject(new Error('NO_FILE'));
			}

			// i.e. 1GB in bytes
			if (filesSize > 1_073_741_824) {
				const sizeInGb = `${Math.round(filesSize * 1e-8) / 10} GB`;

				// eslint-disable-next-line no-throw-literal
				throw { message: 'SIZE_EXCEEDED', details: [{ message: sizeInGb }] };
			}
			resolve(filesToUpload);
		});
	};

	/**
		@param {Event} clickEvent
	 */
	const onSubmit = async (clickEvent) => {
		clickEvent.preventDefault();

		const { getUploadInfoFromInternalDB, blobStorage } = serverActions(uploadForm);

		try {
			const fileList = await onSubmitValidation();

			buildProgressMessage({ show: true }, uploadForm);

			const uploadInfo = await getUploadInfoFromInternalDB(fileList);
			const { error, nextPageUrl } = await blobStorage(fileList, uploadInfo);

			if (nextPageUrl) {
				window.location.href = nextPageUrl;
			} else {
				throw error;
			}
		} catch (/** @type {*} */ error) {
			showErrors(error, uploadForm);
		}
	};

	const registerEvents = () => {
		uploadButton.addEventListener('click', (clickEvent) => {
			clickEvent.preventDefault();
			uploadInput.click();
		});
		uploadInput.addEventListener('change', onFileSelect, false);

		submitButton.addEventListener('click', onSubmit);
	};

	return { onFileSelect, onSubmitValidation, registerEvents };
};

export default clientActions;

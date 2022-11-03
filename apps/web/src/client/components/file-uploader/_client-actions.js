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

	if (!uploadButton || !uploadInput || !filesRows || !uploadCounter) return;

	let globalDataTransfer = new DataTransfer();

	/**
	 * Execute actions after selecting the files to upload
	 *
	 * @param {*} event
	 */
	const onFileSelect = (event) => {
		const { target } = event;
		const { files: newFiles } = target;

		for (const newFile of newFiles) {
			globalDataTransfer.items.add(newFile);
		}

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
		for (const uploadedFile of newFiles) {
			const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;
			const newFileRow = `<li role="listitem" class="pins-file-upload--file-row" id="${fileRowId}">
				<p class="govuk-heading-s" aria-details="File name">${uploadedFile.name}</p>
				<button
				id="button-remove-${fileRowId}"
				type="button" role="button" class="govuk-link pins-file-upload--remove" aria-details="Remove added file from list">
					Remove
				</button>
			</li>`;

			filesRows.innerHTML += newFileRow;
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

	const preValidation = async () => {
		const filesToUpload = globalDataTransfer.files;

		return new Promise((resolve, reject) => {
			const filesSize = [...filesToUpload].reduce((total, file) => total + file.size, 0);
			const filesNumber = filesToUpload.length;
			const allowedMimeTypes = uploadInput.accept.split(',');
			const wrongFiles = [];

			if (filesNumber === 0) {
				reject(new Error('NO_FILE'));
			}

			// i.e. 1GB in bytes
			if (filesSize > 1_073_741_824) {
				reject(new Error('SIZE_EXCEEDED'));
			}

			for (const file of filesToUpload) {
				const fileRowId = `file_row_${file.lastModified}_${file.size}`;

				// TODO: add check for special characters
				if (file.name.length < 255) {
					wrongFiles.push({ message: 'NAME_SINGLE_FILE', name: file.name, fileRowId });
				}
				if (!allowedMimeTypes.includes(file.type)) {
					// edge case: the accept attribute should prevent this
					wrongFiles.push({ message: 'TYPE_SINGLE_FILE', name: file.name, fileRowId });
				}
			}

			if (wrongFiles.length > 0) {
				const message = 'FILE_SPECIFIC_ERRORS';
				const details = wrongFiles;

				// eslint-disable-next-line prefer-promise-reject-errors
				reject({ message, details });
			}

			resolve(1);
		});
	};

	return { onFileSelect, preValidation };
};

export default clientActions;

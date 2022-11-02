/**
 * UI features (file list and choose files button)
 *
 * @param {Element} uploadForm
 */
const ui = (uploadForm) => {
	if (!uploadForm) return;

const registerUIEvents = (uploadForm) => {
	/** @type {HTMLElement | null} */
	const uploadButton = uploadForm.querySelector('.pins-file-upload--button');
	/** @type {HTMLElement | null} */
	const uploadCounter = uploadForm.querySelector('.pins-file-upload--counter');
	/** @type {HTMLElement | null} */
	const filesRows = uploadForm.querySelector('.pins-file-upload--files-rows');

	if (!uploadButton || !filesRows || !uploadCounter) return;

	/**
	 * Execute actions after selecting the files to upload
	 *
	 * @param {*} event
	 */
	const handleFileSelect = (event) => {
		const reader = new FileReader();
		const { target } = event;
		const { files } = target;

		reader.addEventListener('load', () => {
			updateFilesRows(files);
			updateButtonText();
		});
		reader.readAsText(files[0]);
	};

	/**
	 * Update button text and files counter
	 *
	 */
	const updateButtonText = () => {
		setTimeout(() => {
			const filesRowsNumber = filesRows.children.length - 1;

			uploadButton.innerHTML = filesRowsNumber > 0 ? 'Add more files' : 'Choose file';
			uploadButton.blur();
			uploadCounter.textContent =
				filesRowsNumber > 0 ? `${filesRowsNumber} files` : 'No file chosen';
		}, 5);
	};

	/**
	 *	Add rows in the files list
	 *
	 * @param {FileList} files
	 */
	const updateFilesRows = (files) => {
		for (const uploadedFile of files) {
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

		for (const uploadedFile of files) {
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
		const rowToRemove = document.querySelector(`#${fileRowId}`);

		if (rowToRemove) {
			rowToRemove.remove();
			updateButtonText();
		}
	};

	init();
};

export default ui;

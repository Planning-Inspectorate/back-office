/**
 * UI features (file list and choose files button)
 *
 * @param {Element | null} uploadForm
 */
const registerUIEvents = (uploadForm) => {
	if (!uploadForm) return;

	/** @type {HTMLElement | null} */
	const uploadButton = uploadForm.querySelector('.pins-file-upload--button');
	/** @type {HTMLElement | null} */
	const uploadInput = uploadForm.querySelector('input[name="files"]');
	/** @type {HTMLElement | null} */
	const uploadCounter = uploadForm.querySelector('.pins-file-upload--counter');
	/** @type {HTMLElement | null} */
	const filesRows = uploadForm.querySelector('.pins-file-upload--files-rows');

	if (!uploadButton || !uploadInput || !filesRows || !uploadCounter) return;

	const init = () => {
		uploadButton.addEventListener('click', (clickEvent) => {
			clickEvent.preventDefault();
			uploadInput.click();
		});
		uploadInput.addEventListener('change', handleFileSelect, false);
	};

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
		const emptyFileRow = filesRows.children[0];

		for (const uploadedFile of files) {
			const newFileRow = clone(emptyFileRow);
			const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;

			newFileRow.classList.remove('display--none');
			newFileRow.dataset.fileRowId = fileRowId;
			newFileRow.children[0].textContent = uploadedFile.name;
			newFileRow.children[1].addEventListener('click', () => removeFileRow(fileRowId));

			filesRows.append(newFileRow);
		}
	};

	/**
	 * Remove one specific row from the files list
	 *
	 * @param {string} fileRowId
	 */
	const removeFileRow = (fileRowId) => {
		const rowToRemove = document.querySelector(`[data-file-row-id="${fileRowId}"]`);

		if (rowToRemove) {
			rowToRemove.remove();
			updateButtonText();
		}
	};

	/**
	 * Returns cloned node with HTMLElement type
	 *
	 * @param {Element} existingNode
	 * @returns {HTMLElement}
	 */
	const clone = (existingNode) => {
		/** @type {*} */
		const newNode = existingNode.cloneNode(true);

		return newNode;
	};

	init();
};

export default registerUIEvents;

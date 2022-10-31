/** @type {HTMLElement | null} */
const uploadButton = document.querySelector('#upload-button');
/** @type {HTMLElement | null} */
const uploadInput = document.querySelector('#upload-input');
/** @type {HTMLElement | null} */
const uploadCounter = document.querySelector('#upload-counter');
/** @type {*} */
const filesRows = document.querySelector('.pins-file-upload--files-rows');

const initFileUploaderModule = () => {
	if (uploadButton && uploadInput) {
		uploadButton.addEventListener('click', () => {
			uploadInput.click();
		});
		uploadInput.addEventListener('change', handleFileSelect, false);
	}
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
	if (filesRows && uploadButton && uploadCounter) {
		setTimeout(() => {
			const filesRowsNumber = filesRows.children.length - 1;

			uploadButton.innerHTML = filesRowsNumber > 0 ? 'Add more files' : 'Choose file';
			uploadButton.blur();
			uploadCounter.textContent =
				filesRowsNumber > 0 ? `${filesRowsNumber} files` : 'No file chosen';
		}, 5);
	}
};

/**
 *	Add rows in the files list
 *
 * @param {FileList} files
 */
const updateFilesRows = (files) => {
	if (filesRows) {
		const emptyFileRow = filesRows.children[0];

		for (const uploadedFile of files) {
			const newFileRow = emptyFileRow.cloneNode(true);
			const fileRowId = `file_row_${uploadedFile.lastModified}_${uploadedFile.size}`;

			newFileRow.classList.remove('display--none');
			newFileRow.dataset.fileRowId = fileRowId;
			newFileRow.children[0].textContent = uploadedFile.name;
			newFileRow.children[1].addEventListener('click', () => removeFileRow(fileRowId));

			filesRows.append(newFileRow);
		}
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

export default initFileUploaderModule;

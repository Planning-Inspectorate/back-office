import { hideErrors, showErrors } from './_errors.js';
import serverActions from './_server-actions.js';
import { buildErrorListItem, buildProgressMessage, buildRegularListItem } from './_html.js';
import { relevantRepresentationsAttachmentUpload } from './_relevant_representations_attachment.js';

/** @typedef {import('./_html.js').AnError} AnError */
/** @typedef {import('./_html.js').FileWithRowId} FileWithRowId */

/**
 * Actions on the client for the file upload process
 *
 * @param {HTMLElement} uploadForm
 * @returns {*}
 */
const clientActions = (uploadForm) => {
	/** @type {NodeListOf<HTMLElement> | null} */
	const uploadDescriptions = uploadForm.querySelectorAll('.pins-file-upload--text');
	/** @type {HTMLElement | null} */
	const uploadButton = uploadForm.querySelector('.pins-file-upload--button');
	/** @type {HTMLElement | null} */
	const uploadCounter = uploadForm.querySelector('.pins-file-upload--counter');
	/** @type {HTMLElement | null} */
	const filesRows = uploadForm.querySelector('.pins-file-upload--files-rows');
	/** @type {HTMLElement | null} */
	const uploadInput = uploadForm.querySelector('input[name="files"]');
	/** @type {HTMLElement | null} */
	const submitButton = uploadForm.querySelector('.pins-file-upload--submit');

	if (
		!uploadDescriptions ||
		!uploadButton ||
		!uploadInput ||
		!filesRows ||
		!uploadCounter ||
		!submitButton
	)
		return;

	let globalDataTransfer = new DataTransfer();

	/**
	 * Execute actions after selecting the files to upload
	 *
	 * @param {*} selectEvent
	 */
	const onFileSelect = async (selectEvent) => {
		const { target } = selectEvent;

		await updateFilesRows(target);
		updateButtonText();
	};

	/**
	 * Update button text and files counter
	 *
	 */
	const updateButtonText = () => {
		const isMultipleUploadAllowed = uploadForm.dataset.multiple || false;
		const filesRowsNumber = globalDataTransfer.files.length;

		if (isMultipleUploadAllowed) {
			uploadButton.innerHTML = filesRowsNumber > 0 ? 'Add more files' : 'Choose file';
			uploadButton.blur();
			uploadCounter.textContent =
				filesRowsNumber > 0 ? `${filesRowsNumber} files` : 'No file chosen';
		} else {
			for (const uploadDescription of [...uploadDescriptions]) {
				uploadDescription.style.display = filesRowsNumber > 0 ? 'none' : 'block';
			}
			uploadButton.style.display = filesRowsNumber > 0 ? 'none' : 'block';
			uploadCounter.style.display = filesRowsNumber > 0 ? 'none' : 'block';
		}
	};

	/**
	 * @param {FileWithRowId} selectedFile
	 * @returns {{message: string} | null}
	 */
	const checkSelectedFile = (selectedFile) => {
		const allowedMimeTypes = (uploadForm.dataset.allowedTypes || '').split(',');

		if (selectedFile.name.length > 255) {
			return { message: 'NAME_SINGLE_FILE' };
		}

		//disallow en dash and em dash in file names
		if (selectedFile.name.includes('–') || selectedFile.name.includes('—')) {
			return { message: 'NAME_DASH_SINGLE_FILE' };
		}

		const type =
			selectedFile.type ||
			(() => {
				const extensionMatch = selectedFile.name.match(/.+(\..+?)$/);
				if (!extensionMatch) {
					return null;
				}

				return extensionMatch[1];
			})();

		if (!(type && allowedMimeTypes.includes(type))) {
			return { message: 'TYPE_SINGLE_FILE' };
		}

		return null;
	};

	/**
	 * Creates a hexadecimal string as a hash of some text
	 *
	 * @param {String} text
	 * @returns {Promise<String>}
	 */
	const createHash = async (text) => {
		const encodedText = new TextEncoder().encode(text); // encode as (utf-8) Uint8Array
		const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText); // hash the encoded text
		const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
		// convert bytes to hex string
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	};

	/**
	 *	Add rows in the files list
	 *
	 * @param {*} target
	 */
	const updateFilesRows = async (target) => {
		const { files: newFiles } = target;

		hideErrors(uploadForm);

		const wrongFiles = [];

		for (const selectedFile of newFiles) {
			const filenameHash = await createHash(selectedFile.name);
			const fileRowId = `file_row_${selectedFile.lastModified}_${selectedFile.size}_${filenameHash}`;
			const fileCannotBeAdded = checkSelectedFile(selectedFile);
			const fileRow = uploadForm.querySelector(`#${fileRowId}`);

			if (fileCannotBeAdded) {
				const error = {
					message: fileCannotBeAdded.message || '',
					name: selectedFile.name,
					fileRowId
				};

				filesRows.innerHTML += buildErrorListItem(error);
				wrongFiles.push(error);
			} else if (!fileRow) {
				selectedFile.fileRowId = fileRowId;
				globalDataTransfer.items.add(selectedFile);
				filesRows.append(buildRegularListItem(selectedFile));

				const removeButton = [...filesRows.querySelectorAll(`.pins-file-upload--remove`)].pop();

				if (removeButton) {
					removeButton.addEventListener('click', removeFileRow);
				}
			}
		}
		if (wrongFiles.length > 0) {
			showErrors({ message: 'FILE_SPECIFIC_ERRORS', details: wrongFiles }, uploadForm);
		}
		// reset the INPUT value to be able to re-uploade deleted files
		target.value = '';
	};

	/**
	 * Remove one specific row from the files list
	 *
	 * @param {*} clickEvent
	 */
	const removeFileRow = (clickEvent) => {
		/** @type {FileWithRowId[]} */
		const filesWithIds = [...globalDataTransfer.files];
		const rowToRemove = clickEvent.target?.parentElement;
		const fileToRemove = filesWithIds.find((file) => file.fileRowId === rowToRemove?.id);

		if (rowToRemove && fileToRemove) {
			const rowToRemoveIndex = filesWithIds.indexOf(fileToRemove);

			globalDataTransfer.items.remove(rowToRemoveIndex);
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
	 *
	 * @param {AnError[]} errors
	 */
	const finalizeUpload = (errors) => {
		globalDataTransfer = new DataTransfer();
		updateButtonText();

		if (errors.length > 0) {
			const failedRowIds = new Set(errors.map((error) => error.fileRowId));
			const allRowsId = [...filesRows.children].map((row) => row.id);

			for (const rowId of allRowsId) {
				const fileRow = uploadForm.querySelector(`#${rowId}`);

				if (!failedRowIds.has(rowId) && fileRow) {
					fileRow.remove();
				}
			}

			// eslint-disable-next-line no-throw-literal
			throw { message: 'FILE_SPECIFIC_ERRORS', details: errors };
		} else {
			window.location.href = uploadForm.dataset.nextPageUrl || '';
		}
	};

	/**
	 * @param {FileWithRowId[]} files
	 * @returns {Promise<{ files: FileWithRowId[], errors: AnError[] }>}
	 * */
	const prepareFilesForUpload = async (files) => {
		const { processHTMLForYouTube, validateFileSignatures } = serverActions(uploadForm);

		/** @type {FileWithRowId[]} */
		let processedList = [];

		/** @type {AnError[]} */
		let errors = [];

		const { invalidSignatures = [] } = await validateFileSignatures(files);

		let idx = 0;

		for (const f of files) {
			idx++;
			if (invalidSignatures.find((/** @type {string} */ fileRowId) => fileRowId === f.fileRowId)) {
				errors.push({
					message: 'TYPE_INVALID_FILE_CONTENT',
					name: f.name,
					fileRowId: `failedUpload${idx - 1}`
				});
				continue;
			}

			if (f.type !== 'text/html') {
				processedList.push(f);
				continue;
			}

			const { file: newFile, errors: _errors } = await processHTMLForYouTube(f);
			if (_errors.length > 0) {
				errors.push(..._errors);
				continue;
			}

			processedList.push(newFile);
		}

		return { files: processedList, errors };
	};

	/**
		@param {Event} clickEvent
	 */
	const onSubmit = async (clickEvent) => {
		clickEvent.preventDefault();

		const {
			getUploadInfoFromInternalDB,
			uploadFiles,
			getVersionUploadInfoFromInternalDB,
			uploadFile
		} = serverActions(uploadForm);

		try {
			const fileList = await onSubmitValidation();

			buildProgressMessage({ show: true }, uploadForm);

			const errors = [];
			let uploadInfo;

			const { files: processedList, errors: _errors } = await prepareFilesForUpload(fileList);
			errors.push(..._errors);

			if (processedList.length === 0) {
				finalizeUpload(errors);
				return;
			} else if (processedList.length === 1 && uploadForm.dataset?.documentId) {
				uploadInfo = await getVersionUploadInfoFromInternalDB(processedList[0]);
				await relevantRepresentationsAttachmentUpload(uploadInfo?.response, uploadForm);
				const uploadErrors = await uploadFile(processedList, uploadInfo);
				errors.push(...uploadErrors);
			} else {
				uploadInfo = await getUploadInfoFromInternalDB(processedList);
				errors.push(...uploadInfo.errors);
			}

			if (uploadInfo?.response?.documents) {
				await relevantRepresentationsAttachmentUpload(uploadInfo?.response, uploadForm);
				const uploadErrors = await uploadFiles(processedList, uploadInfo?.response);
				errors.push(...uploadErrors);
			}

			finalizeUpload(errors);
		} catch (/** @type {*} */ error) {
			showErrors(error, uploadForm);

			throw error;
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

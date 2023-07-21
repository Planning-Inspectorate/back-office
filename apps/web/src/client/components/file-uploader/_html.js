/** @typedef {{message: string, fileRowId: string, name: string}} AnError */
/** @typedef {File & {fileRowId?: string}} FileWithRowId */

/**
 * @param {string} type
 * @param {string?} replaceValue
 * @returns {string}
 */
export const errorMessage = (type, replaceValue) => {
	/** @type {Record<string,string>} */
	const index = {
		GENERIC: 'Something went wrong, please try again',
		SIZE_EXCEEDED:
			'The total of your uploaded files is {REPLACE_VALUE}, it must be smaller than 1 GB',
		TIMEOUT: 'There was a timeout and your files could not be uploaded, try again',
		NO_FILE: 'Select a file',
		GENERIC_SINGLE_FILE: `{REPLACE_VALUE} could not be added, try again`,
		NAME_SINGLE_FILE: `{REPLACE_VALUE} could not be added because the file name is too long or contains special characters. Rename the file and try and upload again.`,
		TYPE_SINGLE_FILE: `{REPLACE_VALUE} could not be added because it is not an allowed file type`,
		CONFLICT: '{REPLACE_VALUE} could not be added because this file name is already taken.'
	};

	return index[type] ? index[type].replace('{REPLACE_VALUE}', replaceValue || '') : index.GENERIC;
};

/**
 *
 * @param {number} sizesInBytes
 * @returns {string}
 */
const renderSizeInMainUnit = (sizesInBytes) => {
	const unit = sizesInBytes > 99_999 ? 'MB' : 'KB';
	const power = sizesInBytes > 99_999 ? 1e-5 : 1e-2;

	return `${Math.round(sizesInBytes * power) / 10} ${unit}`;
};

/**
 * @param {FileWithRowId} uploadedFile
 * @returns {HTMLElement}
 */
export const buildRegularListItem = (uploadedFile) => {
	const li = document.createElement('li');

	li.classList.add('pins-file-upload--file-row');
	li.id = uploadedFile.fileRowId || '';
	li.innerHTML = `<p class="govuk-heading-s">
		<span class="govuk-visually-hidden">File name: </span>
		${uploadedFile.name} (${renderSizeInMainUnit(uploadedFile.size)})
		</p>
				<button
				id="button-remove-${uploadedFile.fileRowId}"
				type="button" class="govuk-link pins-file-upload--remove" aria-label="Remove added file from list">
					Remove
				</button>`;

	return li;
};

/**
 * @param {AnError} error
 * @returns {string}
 */
export const buildErrorListItem = (error) => {
	return `<li class="pins-file-upload--file-row error-row" id="${error.fileRowId}">
				<p class="govuk-heading-s colour--red">${errorMessage(error.message, error.name)}</p>
				</li>`;
};

/**
 *
 * @param {{show: boolean}} options
 * @param {Element} uploadForm
 */
export const buildProgressMessage = ({ show }, uploadForm) => {
	const progressHook = uploadForm.querySelector('.progress-hook');
	/** @type {HTMLButtonElement | null} */
	const submitButton = uploadForm.querySelector('.pins-file-upload--submit');

	if (progressHook && submitButton) {
		submitButton.disabled = show;
		progressHook.innerHTML = show
			? '<p class="govuk-body pins-file-upload--progress" role="alert">Uploading files</p>'
			: '';
	}
};

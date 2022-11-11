import { errorMessage } from './_errors.js';

/** @typedef {{message: string, fileRowId: string, name: string}} AnError */
/** @typedef {File & {fileRowId?: string}} FileWithRowId */

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
	li.innerHTML = `<p class="govuk-heading-s" aria-details="File name">
		${uploadedFile.name} (${renderSizeInMainUnit(uploadedFile.size)})
		</p>
				<button
				id="button-remove-${uploadedFile.fileRowId}"
				type="button" class="govuk-link pins-file-upload--remove" aria-details="Remove added file from list">
					Remove
				</button>`;

	return li;
};

/**
 * @param {AnError} error
 * @returns {string}
 */
export const buildErrorListItem = (error) => {
	return `<li class="pins-file-upload--file-row" id="${error.fileRowId}">
				<p class="govuk-heading-s colour--red" aria-details="File name">${errorMessage(
					error.message,
					error.name
				)}</p>
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

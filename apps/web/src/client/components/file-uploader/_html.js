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
export const buildRegularListItem = (uploadedFile) => {
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
export const buildErrorListItem = (uploadedFile, message) => {
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

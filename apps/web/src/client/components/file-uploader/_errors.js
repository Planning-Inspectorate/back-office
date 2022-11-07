/**
 * @param {string} type
 * @returns {string}
 */
export const errorMessage = (type) => {
	/** @type {Record<string,string>} */
	const index = {
		GENERIC: 'Something went wrong, please try again',
		SIZE_EXCEEDED: 'The total of your uploaded files must be smaller than 1 GB',
		TIMEOUT: 'There was a timeout and your files could not be uploaded, try again',
		NO_FILE: 'Select a file',
		GENERIC_SINGLE_FILE: `could not be added, try again`,
		NAME_SINGLE_FILE: `could not be added because the file name is too long or contains special characters. Rename the file and try and upload again.`,
		TYPE_SINGLE_FILE: ` could not be added because it is not an allowed file type`
	};

	return index[type] ?? index.GENERIC;
};

/**
 * @param {string[]} messages
 * @returns {string}
 */
const buildTopErrorsMarkup = (messages) => {
	const errorsTopOpen = `<div class="govuk-error-summary pins-file-upload--errors-top" aria-labelledby="error-summary-title-{{ params.formId }}" role="alert" data-module="govuk-error-summary">
		<h2 class="govuk-error-summary__title" id="error-summary-title-{{ params.formId }}">
			There is a problem
		</h2>
		<div class="govuk-error-summary__body ">
			<ul class="govuk-list govuk-error-summary__list">`;

	const errorTopClose = `</ul></div></div>`;

	let errorsLists = '';

	for (const message of messages) {
		errorsLists += `<li><a href="#">${message}</a></li>`;
	}

	return errorsTopOpen + errorsLists + errorTopClose;
};

/**
 * @param {string} message
 * @returns {string}
 */
const buildMiddleErrorsMarkup = (message) => {
	return `<p class='font-weight--700 colour--red'>${message}</p>`;
};

/**
 *
 * @param {{details?: Array<{name: string, message: string, fileRowId: string}>, message: string}} error
 * @param {Element} uploadForm
 */
export const showErrors = (error, uploadForm) => {
	const formContainer = uploadForm.querySelector('.pins-file-upload--container');
	const topHook = uploadForm.querySelector('.top-errors-hook');
	const middleHook = uploadForm.querySelector('.middle-errors-hook');

	if (!formContainer || !topHook || !middleHook) return;

	formContainer.classList.remove('error');

	let topErrorsMarkup = '';
	let middleErrorsMarkup = '';

	if (error.message === 'FILE_SPECIFIC_ERRORS' && error.details) {
		const messages = error.details.map(
			(wrongFile) => `${wrongFile.name} ${errorMessage(wrongFile.message || '')}`
		);

		for (const wrongFile of error.details) {
			const fileRow = uploadForm.querySelector(`#${wrongFile.fileRowId}`);

			if (fileRow && fileRow.children.length === 2) {
				// TODO: change the style of the <li> to be red, with no button and with an error msg
				fileRow.children[0].classList.add('colour--red');
			}
		}

		topErrorsMarkup = buildTopErrorsMarkup(messages);
	} else {
		formContainer.classList.add('error');
		topErrorsMarkup = buildTopErrorsMarkup([errorMessage(error.message)]);
		middleErrorsMarkup = buildMiddleErrorsMarkup(errorMessage(error.message));
	}

	topHook.innerHTML = topErrorsMarkup;
	middleHook.innerHTML = middleErrorsMarkup;
};

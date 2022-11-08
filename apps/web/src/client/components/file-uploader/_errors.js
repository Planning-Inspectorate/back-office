import { buildProgressMessage } from './_html.js';

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
		TYPE_SINGLE_FILE: `{REPLACE_VALUE} could not be added because it is not an allowed file type`
	};

	return index[type] ? index[type].replace('{REPLACE_VALUE}', replaceValue || '') : index.GENERIC;
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

	buildProgressMessage({ show: false }, uploadForm);
	formContainer.classList.remove('error');

	let topErrorsMarkup = '';
	let middleErrorsMarkup = '';

	if (error.message === 'FILE_SPECIFIC_ERRORS' && error.details) {
		const messages = error.details.map((wrongFile) =>
			errorMessage(wrongFile.message || '', wrongFile.name)
		);

		for (const wrongFile of error.details) {
			const fileRow = uploadForm.querySelector(`#${wrongFile.fileRowId}`);

			if (fileRow && fileRow.children.length === 2) {
				fileRow.children[0].classList.add('colour--red');
				fileRow.children[0].textContent = errorMessage(wrongFile.message || '', wrongFile.name);
				fileRow.children[1].remove();
			}
		}
		topErrorsMarkup = buildTopErrorsMarkup(messages);
	} else {
		formContainer.classList.add('error');

		const replaceValue = error.details ? error.details[0].message : null;

		topErrorsMarkup = buildTopErrorsMarkup([errorMessage(error.message, replaceValue)]);
		middleErrorsMarkup = buildMiddleErrorsMarkup(errorMessage(error.message, replaceValue));
	}

	topHook.innerHTML = topErrorsMarkup;
	middleHook.innerHTML = middleErrorsMarkup;
};

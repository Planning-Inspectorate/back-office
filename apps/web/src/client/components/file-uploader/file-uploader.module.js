import clientActions from './_client-actions.js';
import { showErrors } from './_errors.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

/**
 * @param {Element} uploadForm
 * @param {*} onSubmit
 * @param {*} onFileSelect
 */
const registerEvents = (uploadForm, onSubmit, onFileSelect) => {
	/** @type {HTMLElement | null} */
	const uploadButton = uploadForm.querySelector('.pins-file-upload--button');
	/** @type {HTMLElement | null} */
	const submitButton = uploadForm.querySelector('button[role="submit"]');
	/** @type {HTMLElement | null} */
	const uploadInput = uploadForm.querySelector('input[name="files"]');

	if (!uploadButton || !uploadInput || !submitButton) return;

	uploadButton.addEventListener('click', (clickEvent) => {
		clickEvent.preventDefault();
		uploadInput.click();
	});
	uploadInput.addEventListener('change', onFileSelect, false);

	submitButton.addEventListener('click', onSubmit);
};

const initFileUploaderModule = () => {
	if (allUploadForms.length === 0) return;

	const { onFileSelect, onSubmitValidation } = clientActions(allUploadForms[0]);
	// const {preBlobStorage, blobStorage} = serverActions(allUploadForms[0]);

	/**
		@param {Event} clickEvent
	 */
	const onSubmit = async (clickEvent) => {
		clickEvent.preventDefault();
		try {
			await onSubmitValidation(allUploadForms[0]);
			// await preBlobStorage();
			// await blobStorage()
		} catch (/** @type {*} */ error) {
			showErrors(error, allUploadForms[0]);
		}
	};

	registerEvents(allUploadForms[0], onSubmit, onFileSelect);
};

export default initFileUploaderModule;

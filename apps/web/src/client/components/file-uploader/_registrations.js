/**
 * @param {*} uploadForm
 * @param {*} onSubmit
 * @param {*} onFileSelect
 */
const registerEvents = (uploadForm, onSubmit, onFileSelect) => {
	if (!uploadForm) return;

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

export default registerEvents;

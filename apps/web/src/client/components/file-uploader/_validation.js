/**
 * Form validations
 *
 * @param {Element | null} uploadForm
 */
const registerValidation = (uploadForm) => {
	if (!uploadForm) return;

	/** @type {HTMLElement | null} */
	const submitButton = uploadForm.querySelector('button[role="submit"]');
	/** @type {*} */
	const uploadInput = uploadForm.querySelector('input[name="files"]');

	/** @type {string[]} */
	const errors = [];

	if (!submitButton || !uploadInput) return;

	const init = () => {
		submitButton.addEventListener('click', (clickEvent) => {
			clickEvent.preventDefault();
			validate();
		});
	};

	const validate = () => {
		const filesToUpload = uploadInput.files;

		for (const file of filesToUpload) {
			if (file.size > 10_000) {
				errors.push(`${file.name} is bigger than 1000mb`);
			}
			if (file.type !== 'image/png') {
				errors.push(`${file.name} is not a png`);
			}
		}
	};

	init();
};

export default registerValidation;

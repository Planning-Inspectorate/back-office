import registerEvents from './_registrations.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

const initFileUploaderModule = () => {
	if (allUploadForms.length === 0) return;

	/**
		@param {Event} clickEvent
	 */
	const onSubmit = async (clickEvent) => {
		clickEvent.preventDefault();
		try {
			// await preValidation();
			// await preBlobStorage();
			// await blobStorage()
		} catch (error) {
			return error;
		}
	};

	registerEvents(allUploadForms[0], onSubmit, () => {});
};

export default initFileUploaderModule;

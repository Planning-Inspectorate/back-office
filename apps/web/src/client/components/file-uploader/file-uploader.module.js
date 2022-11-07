import clientActions from './_client-actions.js';
import serverActions from './_server-actions.js';
import { showErrors } from './_errors.js';
import { registerEvents } from './_registrations.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

const initFileUploaderModule = () => {
	if (allUploadForms.length === 0) return;

	const { onFileSelect, onSubmitValidation } = clientActions(allUploadForms[0]);
	const { preBlobStorage, blobStorage } = serverActions(allUploadForms[0]);

	/**
		@param {Event} clickEvent
	 */
	const onSubmit = async (clickEvent) => {
		clickEvent.preventDefault();
		try {
			const fileList = await onSubmitValidation(allUploadForms[0]);
			const uploadInfo = await preBlobStorage(fileList);
			const nextPageUrl = await blobStorage(uploadInfo);

			if (nextPageUrl) {
				window.location.href = nextPageUrl;
			}
		} catch (/** @type {*} */ error) {
			showErrors(error, allUploadForms[0]);
		}
	};

	registerEvents(allUploadForms[0], onSubmit, onFileSelect);
};

export default initFileUploaderModule;

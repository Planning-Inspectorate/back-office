import registerUIEvents from './_ui.js';
import registerValidation from './_validation.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

const initFileUploaderModule = () => {
	if (allUploadForms.length === 0) return;
	registerUIEvents(allUploadForms[0]);
	registerValidation(allUploadForms[0]);
};

export default initFileUploaderModule;

import registerUIEvents from './_ui.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

const initFileUploaderModule = () => {
	if (allUploadForms.length === 0) return;
	registerUIEvents(allUploadForms[0]);
};

export default initFileUploaderModule;

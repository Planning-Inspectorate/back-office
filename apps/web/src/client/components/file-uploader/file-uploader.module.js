import registerUIEvents from './_ui.js';

const allUploadForms = document.querySelectorAll('.pins-file-upload');

const initFileUploaderModule = () => {
	registerUIEvents(allUploadForms[0]);
};

export default initFileUploaderModule;

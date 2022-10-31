// Import default components for all pages
//* This will be updated based on a router -> loader flow.

import './pages/default';
import { initAll as initGovUKScripts } from 'govuk-frontend';
import initFileUploaderModule from './modules/file-uploader.module.js';

const init = () => {
	initGovUKScripts();
	initFileUploaderModule();
};

init();

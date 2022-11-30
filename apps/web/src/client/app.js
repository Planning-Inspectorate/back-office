// Import default components for all pages
//* This will be updated based on a router -> loader flow.

import './pages/default';
import { initAll as initGovUKScripts } from 'govuk-frontend';
import initFileUploaderModule from './components/file-uploader/file-uploader.module.js';
import initFilesListModule from './components/files-list/files-list.module.js';

const initAll = () => {
	initGovUKScripts();
	initFileUploaderModule();
	initFilesListModule();
};

initAll();

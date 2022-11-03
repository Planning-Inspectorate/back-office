// Import default components for all pages
//* This will be updated based on a router -> loader flow.

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime';
import './pages/default';
import { initAll as initGovUKScripts } from 'govuk-frontend';
import initFileUploaderModule from './components/file-uploader/file-uploader.module.js';

const initAll = () => {
	initGovUKScripts();
	initFileUploaderModule();
};

initAll();

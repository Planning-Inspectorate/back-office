// Import default components for all pages
//* This will be updated based on a router -> loader flow.

import './pages/default';
import { initAll as initGovUKScripts } from 'govuk-frontend';
import initExcerpt from './components/excerpts/excerpt.js';
import initFilesListModule from './components/files-list/files-list.module.js';
import initSelectAllCheckbox from './components/select-all-checkbox/select-all-checkbox.js';

const initAll = () => {
	initGovUKScripts();
	initExcerpt();
	initFilesListModule();
	initSelectAllCheckbox();
};

initAll();

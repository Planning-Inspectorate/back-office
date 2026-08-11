// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const { applications: applicationUsers } = users;

describe('Search Documents for various file types', () => {
	let projectInfo;

	beforeEach(() => {
		projectInfo = projectInformation();
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project documentation');
	});

	function fileUpload(filename) {
		return fileUploadPage.fileUpload(filename, 1);
	}

	it('As a user able to search and verify the documents count after uploading the .dbf file type to case', () => {
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('dmap.dbf');
		fileUploadPage.backToProjectDocumentationPage();
		searchResultsPage.verifyDocumentSearchResults('dmap');
		searchResultsPage.clickButtonByText('Search');
		searchResultsPage.verifyDocumentsCount();
	});

	it('As a user able to search and verify the documents count after uploading the .shp file type to case', () => {
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('smap.shp');
		fileUploadPage.backToProjectDocumentationPage();
		searchResultsPage.verifyDocumentSearchResults('smap');
		searchResultsPage.clickButtonByText('Search');
		searchResultsPage.verifyDocumentsCount();
	});
	it('As a user able to search and verify the documents count after uploading the .prj file type to case', () => {
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('ptest-prj.prj');
		fileUploadPage.backToProjectDocumentationPage();
		searchResultsPage.verifyDocumentSearchResults('ptest');
		searchResultsPage.clickButtonByText('Search');
		searchResultsPage.verifyDocumentsCount();
	});

	it('As a user able to verify documents search page contains view link next to document filename', () => {
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('dmap.dbf');
		fileUploadPage.backToProjectDocumentationPage();
		searchResultsPage.verifyDocumentSearchResults('dmap');
		searchResultsPage.clickButtonByText('Search');
		searchResultsPage.clickDocumentViewLink();
		documentPropertiesPage.verifyDocumentPropertiesHeading();
	});

	it('As a user able to verify invalid document search result count', () => {
		searchResultsPage.verifyDocumentSearchResults('abc');
		searchResultsPage.clickButtonByText('Search');
		searchResultsPage.verifyInvalidSearchResultsCount();
	});
});

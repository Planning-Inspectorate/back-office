// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { validateProjectOverview } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const { applications: applicationsUsers } = users;
let projectInfo;

describe('Document Download', () => {
	beforeEach(() => {
		cy.deleteDownloads();
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	afterEach(() => {
		cy.deleteDownloads();
	});

	it('Case Team Admin user should be able to download a document', () => {
		const fileName = 'sample-doc.pdf';
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile(fileName);
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.downloadFile(1);
		cy.validateDownloadedFile(fileName);
	});

	it('Case Team Admin user should be able to download a document from document properties page', () => {
		const fileName = 'sample-file.doc';
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile(fileName);
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		const useButton = true;
		fileUploadPage.downloadFile(1, useButton);
		cy.validateDownloadedFile(fileName);
	});
});

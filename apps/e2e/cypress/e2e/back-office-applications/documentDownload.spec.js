// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { validateSummaryPage, validateSummaryPageInfo } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { isCI } from '../../support/utils/isCI';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
let projectInfo;

describe('Document Download', () => {
	beforeEach(() => {
		cy.deleteDownloads();
		projectInfo = projectInformation();
		cy.login(users.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	afterEach(() => {
		cy.deleteDownloads();
	});

	if (!isCI()) {
		it('Case Team Admin user should be able to download a document', () => {
			cy.login(users.caseAdmin);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateSummaryPageInfo(projectInfo, 'complete');
			searchResultsPage.clickLinkByText('Update project information');
			searchResultsPage.clickLinkByText('Project documentation');
			searchResultsPage.clickLinkByText('Project management');
			fileUploadPage.verifyUploadButtonIsVisible();
			fileUploadPage.uploadFile();
			searchResultsPage.clickButtonByText('Save and continue');
			fileUploadPage.verifyFolderDocuments(1);
			fileUploadPage.verifyUploadIsComplete();
			fileUploadPage.downloadFile(1);
			cy.validateDownloadedFile('sample-doc');
		});
	}

	it('Case Team user should be able to download a document', () => {
		cy.login(users.caseTeam);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateSummaryPageInfo(projectInfo, 'complete');
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile();
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		fileUploadPage.clickButtonByText('Download');
		cy.validateDownloadedFile('sample-doc');
	});
});

// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { validateSummaryPageInfo } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();

describe('Document Upload', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(users.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('Case Team Admin user should be able to upload a document to a case', () => {
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
		fileUploadPage.verifyDocumentUploaded('sample-doc');
		fileUploadPage.verifyUploadIsComplete();
	});

	it('Inspector user should not be able to upload a document to a case', () => {
		cy.login(users.inspector);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateSummaryPageInfo(projectInfo, 'complete');
		fileUploadPage.verifyUploadButtonIsVisible(true);
	});
});

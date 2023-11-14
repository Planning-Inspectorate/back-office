// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { validateProjectOverview } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage.js';


const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const { applications: applicationsUsers } = users;

describe('Upload MP3 File', () => {
	let projectInfo;
	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('Case Team Admin user should be able to upload MP3 file to a case', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('Sample.mp3');
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyDocumentUploaded('Sample');
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		cy.wrap(documentPropertiesPage.getDocumentRefNumber()).then(()=>{
		cy.log("Printing the cypress env value: " + Cypress.env("DocRef"));
		const docRefer=Cypress.env("DocRef")
		var splitRef=docRefer.split(' ')[3]
		documentPropertiesPage.enterDocumentRefNumber(splitRef);
		})
		documentPropertiesPage.validateTranscriptValue();


	});

	it('Case Team Admin user enters incorrect document reference number then error will displayed ', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.clickLinkByText('View/Edit properties')
		documentPropertiesPage.enterIncorrectDocumentRefNumber(caseRef);
		documentPropertiesPage.validateDocumentErrorMessage();
	});


	it('Inspector user should not be able to upload a html document to a case', () => {
		cy.login(applicationsUsers.inspector);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		fileUploadPage.verifyUploadButtonIsVisible(true);
	});
});

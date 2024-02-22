// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { validateProjectOverview } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const { applications: applicationsUsers } = users;

describe('Upload different types of document and validate the transcript value', () => {
	let projectInfo;

	beforeEach(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	 function fileUpload(filename) {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile(filename);
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
      }

	  function enterDocRefandValidateTranscriptValue(){
		cy.wrap(documentPropertiesPage.getDocumentRefNumber()).then(()=>{
		cy.log("Printing the cypress env value: " + Cypress.env("DocRef"));
		const docRefer=Cypress.env("DocRef")
		var splitRef=docRefer.split(' ')[3]
		documentPropertiesPage.enterDocumentRefNumber(splitRef);
		documentPropertiesPage.validateTranscriptValue();
		})
	  }

	it('Case Team Admin user should be able to upload a document to a case', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('sample-doc.pdf');
	});
	it('Case Team Admin user should be able to upload a html file to a case and validate the transcript value', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('NI_Video_Template_2.html');
		fileUploadPage.clickLinkByText('View/Edit properties');
		enterDocRefandValidateTranscriptValue();
	});

	it('Case Team Admin user should be able to upload MP3 file to a case and validate the transcript value', () => {
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
		fileUpload('Sample.mp3');
		fileUploadPage.clickLinkByText('View/Edit properties');
		enterDocRefandValidateTranscriptValue();
	});
	it('Case Team Admin user should be able to upload a video file to a case and validate the transcript value', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUpload('sample-video.mp4');
		fileUploadPage.clickLinkByText('View/Edit properties');
		enterDocRefandValidateTranscriptValue();
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
		fileUpload('NI_Template_2.html');
		fileUploadPage.clickLinkByText('View/Edit properties')
		documentPropertiesPage.enterIncorrectDocumentRefNumber(caseRef);
		documentPropertiesPage.validateDocumentErrorMessage();
	});

});

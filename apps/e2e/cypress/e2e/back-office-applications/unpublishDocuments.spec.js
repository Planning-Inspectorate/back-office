// @ts-nocheck
/// <reference types="cypress"/>
import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage';
import { FolderDocumentsPage } from '../../page_objects/folderDocumentsPage';


const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const folderPage = new FolderDocumentsPage();
const folderDocumentsPage = new FolderDocumentsPage();
const { applications: applicationUsers } = users;


describe('Document Upload', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});


	it('Case Team Admin user should be able to upload, publish and unpublish the document to a case', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('sample-doc.pdf');
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyDocumentUploaded('sample-doc');
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateAllProperties('Redacted');
		folderPage.markAllReadyToPublish();
		folderPage.clickLinkByText('View publishing queue');
		folderPage.validatePublishingQueueCase(projectInfo, caseRef);
		folderPage.publishAllDocumentsInList();
		folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
        folderPage.navigateToProjectFolder();
		searchResultsPage.clickLinkByText('View/Edit properties')
		folderDocumentsPage.unpublishDocument();
	});

	it('Case Team Admin should not see the unpublish button after unpublishing the document', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.verifyUnpublishButtonIsNotVisible();
	});

	it('Case Team Admin should see unpublish status in document history tab after unpublishing the document', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
        documentPropertiesPage.verifyUnpublishStatus();
	});
	it('Case Team Admin should see delete button on document properties page after publishing the document', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
		folderPage.verifyDeleteButtonIsVisible();
	});

});

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
import { PublishingQueuePage } from '../../page_objects/publishingQueue';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const folderPage = new FolderDocumentsPage();
const publishingQueuePage = new PublishingQueuePage();
const { applications: applicationsUsers } = users;

describe('Document Properties', () => {
	let projectInfo;
	let caseRef;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it.only('Case admin should not be able to set "Ready to publish" before setting all mandatory properties for document', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('sample-doc.pdf');
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		folderPage.markAllReadyToPublish();
		folderPage.validateErrorMessageIsInSummary(
			'You must fill in all mandatory document properties to publish a document'
		);
	});

	it('Case admin be able to set document for "Ready to publish" and see it in the publishing queue', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateAllProperties('Redacted');
		folderPage.markAllReadyToPublish();
		folderPage.clickLinkByText('View publishing queue');
		folderPage.validatePublishingQueueCase(projectInfo, caseRef);
		publishingQueuePage.validateDocumentCountInList(1);
	});

	it('Case admin should be able to set "Ready to publish" after setting all mandatory properties for document', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateAllProperties('Redacted');
		folderPage.markAllReadyToPublish();
		folderPage.clickLinkByText('View publishing queue');
		folderPage.validatePublishingQueueCase(projectInfo, caseRef);
		folderPage.publishAllDocumentsInList();
		folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
	});
});

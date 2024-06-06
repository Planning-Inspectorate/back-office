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

describe('Publish Documents', () => {
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
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it('As a user able to set "Ready to publish" before setting all mandatory properties for document', () => {
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

	it('As a user able to set document for "Ready to publish" and see it in the publishing queue', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		cy.get('div.govuk-summary-list__row:nth-child(3) > dt').then(($elem) => {
			const text = $elem.text().trim();
			if (text === 'Description in Welsh') {
				documentPropertiesPage.updateAllPropertiesIncludingWelsh('Redacted');
				folderPage.markAllReadyToPublish();
				folderPage.clickLinkByText('View publishing queue');
				folderPage.validatePublishingQueueCase(projectInfo, caseRef);
				publishingQueuePage.validateDocumentCountList(1);
				folderPage.publishAllDocumentsInList();
				folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
			} else {
				documentPropertiesPage.updateAllProperties('Redacted');
				folderPage.markAllReadyToPublish();
				folderPage.clickLinkByText('View publishing queue');
				folderPage.validatePublishingQueueCase(projectInfo, caseRef);
				publishingQueuePage.validateDocumentCountList(1);
				folderPage.publishAllDocumentsInList();
				folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
			}
		});
	});
});

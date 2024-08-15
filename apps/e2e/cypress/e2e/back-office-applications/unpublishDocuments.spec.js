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

describe('Unpublish Documents', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it('As a user able to upload, publish and unpublish the document to a case', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('sample-doc.pdf');
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyDocumentUploaded('sample-doc');
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		cy.get('div.govuk-summary-list__row:nth-child(3) > dt').then(($elem) => {
			const text = $elem.text().trim();
			if (text === 'Description in Welsh') {
				cy.log('waiting for dev code');
			} else {
				const caseRef = Cypress.env('currentCreatedCase');
				documentPropertiesPage.updateAllProperties('Redacted');
				folderPage.markAllReadyToPublish();
				folderPage.clickLinkByText('View publishing queue');
				folderPage.validatePublishingQueueCase(projectInfo, caseRef);
				folderPage.publishAllDocumentsInList();
				folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
				folderPage.navigateToProjectFolder();
				searchResultsPage.clickLinkByText('View/Edit properties');
				documentPropertiesPage.verifyPublishStatus();
				folderDocumentsPage.unpublishDocument();
			}
		});
	});

	it('As a user should not see the unpublish button after unpublishing the document', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
		if (
			!Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
			projectInformation.caseIsWelsh
		) {
			documentPropertiesPage.verifyUnpublishButtonIsNotVisible();
		}
	});

	it('As a user should see unpublish status in document history tab after unpublishing the document', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
		if (
			!Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
			projectInformation.caseIsWelsh
		) {
			documentPropertiesPage.verifyUnpublishStatus();
		}
	});
	it('As a user should see delete button on document properties page after publishing the document', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.clickLinkByText('View/Edit properties');
		if (
			!Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
			projectInformation.caseIsWelsh
		) {
			folderPage.verifyDeleteButtonIsVisible();
		}
	});

	it('As a user trying to apply changes without selecting the document', () => {
		folderDocumentsPage.applyChangesWithoutSelectingDocument();
		fileUploadPage.verifyDocumentSelectError();
	});
	it('As a user trying to click on publish document button without selecting the document', () => {
		if (
			!Cypress.env('featureFlags')['applic-55-welsh-translation'] &&
			projectInformation.caseIsWelsh
		) {
			folderDocumentsPage.applyChanges();
			folderPage.clickLinkByText('View publishing queue');
			folderDocumentsPage.clickOnPublishButton();
		}
	});

	it('As a user able to navigate back from delete the document page', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.verifyNaviagtedBackToDocPropertiesPage();
	});

	it('As a user able to delete the document', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.verifyDocumentIsDeleted();
	});
});

// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage';
import { faker } from '@faker-js/faker';
import { FolderDocumentsPage } from '../../page_objects/folderDocumentsPage';
import { PublishingQueuePage } from '../../page_objects/publishingQueue';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const folderPage = new FolderDocumentsPage();
const publishingQueuePage = new PublishingQueuePage();

const fileName = () => faker.lorem.word();
const description = () => faker.lorem.sentence();
const from = () => faker.lorem.word();
const agent = () => faker.lorem.word();
const webfilter = () => faker.lorem.word();

describe('Document Properties', () => {
	let projectInfo;
	let caseRef;

	const getDate = (received) => {
		const today = new Date();
		const day = today.getDate().toString().padStart(2, '0');
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${received ? year - 1 : year}`;
	};

	before(() => {
		projectInfo = projectInformation();
		cy.login(users.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.login(users.caseAdmin);
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it('Case admin should not be able to set "Ready to publish" before setting all mandatory properties for document', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile();
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		folderPage.setRedactionStatus(true);
		folderPage.setOverallStatus('Ready to publish');
		folderPage.selectAllDocuments();
		folderPage.clickButtonByText('Apply changes');
		folderPage.validateErrorMessageIsInSummary(
			'You must fill in all mandatory document properties to publish a document'
		);
	});

	it('Case admin be able to set document for "Ready to publish" and see it in the publishing queue', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateDocumentProperty('File name', fileName());
		documentPropertiesPage.updateDocumentProperty('Description', description());
		documentPropertiesPage.updateDocumentProperty('From', from());
		documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
		documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter());
		documentPropertiesPage.updateDocumentType('No document type');
		documentPropertiesPage.updateDate('Date received', getDate(true));
		documentPropertiesPage.updateRedactionStatus('Redacted');
		documentPropertiesPage.clickBackLink();
		folderPage.setRedactionStatus(true);
		folderPage.setOverallStatus('Ready to publish');
		folderPage.selectAllDocuments();
		folderPage.clickButtonByText('Apply changes');
		folderPage.clickLinkByText('View publishing queue');
		cy.contains(projectInfo.projectName).should('exist');
		cy.contains(caseRef).should('exist');
		publishingQueuePage.validateDocumentCountOnList(1);
	});

	it('Case admin be able to set "Ready to publish" after setting all mandatory properties for document', () => {
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateDocumentProperty('File name', fileName());
		documentPropertiesPage.updateDocumentProperty('Description', description());
		documentPropertiesPage.updateDocumentProperty('From', from());
		documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
		documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter());
		documentPropertiesPage.updateDocumentType('No document type');
		documentPropertiesPage.updateDate('Date received', getDate(true));
		documentPropertiesPage.updateRedactionStatus('Redacted');
		documentPropertiesPage.clickBackLink();
		folderPage.setRedactionStatus(true);
		folderPage.setOverallStatus('Ready to publish');
		folderPage.selectAllDocuments();
		folderPage.clickButtonByText('Apply changes');
		folderPage.clickLinkByText('View publishing queue');
		cy.contains(projectInfo.projectName).should('exist');
		cy.contains(caseRef).should('exist');
		folderPage.selectAllDocuments();
		folderPage.clickButtonByText('Publish documents');
		folderPage.validateSuccessPanelTitle('Document/s successfully published');
		folderPage.validateSuccessPanelBody('1 documents published to the NI website');
		folderPage.validateSuccessPanelBody(projectInfo.projectName);
		folderPage.validateSuccessPanelBody(caseRef);
	});
});

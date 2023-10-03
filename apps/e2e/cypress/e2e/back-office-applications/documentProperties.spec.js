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
import { faker } from '@faker-js/faker';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const { applications: applicationsUsers } = users;

const fileName = () => faker.lorem.word();
const description = () => faker.lorem.sentence();
const from = () => faker.lorem.word();
const agent = () => faker.lorem.word();
const webfilter = () => faker.lorem.word();

describe('Document Properties', () => {
	let projectInfo;

	const getDate = (received) => {
		const today = new Date();
		const day = today.getDate().toString().padStart(2, '0');
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${received ? year - 1 : year}`;
	};

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

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
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('sample-doc.pdf');
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateDocumentProperty('File name', fileName());
		documentPropertiesPage.updateDocumentProperty('Description', description());
		documentPropertiesPage.updateDocumentProperty('From', from());
		documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
		documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter());
		documentPropertiesPage.updateDocumentType('No document type');
		documentPropertiesPage.updateDate('Date received', getDate(true));
		documentPropertiesPage.updateRedactionStatus('Redacted');
	});

	it('Inspector user should not be able to upload a document to a case', () => {
		cy.login(applicationsUsers.inspector);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		fileUploadPage.verifyUploadButtonIsVisible(true);
	});
});

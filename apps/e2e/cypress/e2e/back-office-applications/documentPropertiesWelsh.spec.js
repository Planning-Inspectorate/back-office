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

const fileName = () => 'filename';
const description = () => 'description';
const descriptionforWelsh = () => 'description for welsh';
const from = () => 'from';
const documentfromWelsh = () => 'document from welsh';
const agent = () => 'agent';
const webfilter = () => 'webfilter';
const webfilterforWelsh = () => 'webfilter for welsh';

describe('Document Properties including welsh fields', () => {
	let projectInfo = projectInformation();
	let projectInfoNew = projectInformation();

	const getDate = (received) => {
		const today = new Date();
		let day = today.getDate().toString().padStart(2, '0');
		if (day === '29') {
			day = '28';
		}
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${received ? year - 1 : year}`;
	};

	before(() => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			projectInfo.caseIsWelsh = true;
			projectInfoNew.caseIsWelsh = true;
			cy.login(applicationsUsers.caseAdmin);
			createCasePage.createCaseWithWelshAsRegion(projectInfo, true);
		}
	});

	it('As a user should be able to upload a document to a case and update the fields including Welsh', () => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			searchResultsPage.clickLinkByText('Project documentation');
			searchResultsPage.clickLinkByText('Project management');
			fileUploadPage.verifyUploadButtonIsVisible();
			fileUploadPage.uploadFile('test.pdf');
			searchResultsPage.clickButtonByText('Save and continue');
			fileUploadPage.verifyFolderDocuments(1);
			fileUploadPage.verifyUploadIsComplete();
			fileUploadPage.clickLinkByText('View/Edit properties');
			documentPropertiesPage.updateDocumentProperty('File name', fileName());
			documentPropertiesPage.updateDocumentProperty('Description', description());
			//documentPropertiesPage.updateDocumentProperty('Description in Welsh', descriptionforWelsh());
			documentPropertiesPage.updateDocumentProperty('Who the document is from', from());
			//documentPropertiesPage.updateDocumentProperty('Who the document is from in Welsh', documentfromWelsh());
			documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
			documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter());
			//documentPropertiesPage.updateDocumentProperty('Webfilter in Welsh', webfilter());
			documentPropertiesPage.updateDocumentType('No document type');
			documentPropertiesPage.updateDate('Date received', getDate(true));
			documentPropertiesPage.updateRedactionStatus('Redacted');
		}
	});
});

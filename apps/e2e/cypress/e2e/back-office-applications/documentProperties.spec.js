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
const from = () => 'from';
const agent = () => 'agent';
const webfilter = () => 'webfilter';

describe('Document Properties', () => {
	let projectInfo;

	const getDate = (received) => {
		const today = new Date();
		const day = (() => {
			const d = today.getDate().toString().padStart(2, '0');
			if (d === '29') {
				return '28';
			}

			return d;
		})();

		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${received ? year - 1 : year}`;
	};

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('As a user should be able to upload a document to a case', () => {
		applicationsHomePage.loadCurrentCase();
		validateProjectOverview(projectInfo);
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			searchResultsPage.verifyPageTitle(`${projectInfo.projectName} - Overview`);
		} else {
			documentPropertiesPage.verifyPageTitle(`${projectInfo.projectName} - Project information`);
		}
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyPageTitle(`${projectInfo.projectName} - NSIP Applications`);
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('test.pdf');
		fileUploadPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyPageTitle(`${projectInfo.projectName} - NSIP Applications`);
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.verifyPageTitle(`${projectInfo.projectName} - Project documentation`);
		documentPropertiesPage.updateDocumentProperty('File name', fileName());
		documentPropertiesPage.updateDocumentProperty('Description', description(), 'textarea');
		documentPropertiesPage.updateDocumentProperty('Who the document is from', from(), 'textarea');
		documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
		documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter(), 'textarea');
		documentPropertiesPage.updateDocumentType('No document type');
		documentPropertiesPage.updateDate('Date received', getDate(true));
		documentPropertiesPage.updateRedactionStatus('Redacted');
		documentPropertiesPage.verifyPageTitle(`${projectInfo.projectName} - Project documentation`);
	});
});

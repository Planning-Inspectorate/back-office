// @ts-nocheck

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
			searchResultsPage.verifyPageTitle(`Overview - ${projectInfo.projectName}`);
		} else {
			documentPropertiesPage.verifyPageTitle(`Project information - ${projectInfo.projectName}`);
		}
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyPageTitle(`Project management folder - ${projectInfo.projectName}`);
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile('test.pdf');
		fileUploadPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyPageTitle(`Project management folder - ${projectInfo.projectName}`);
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.verifyPageTitle(`Document properties - ${projectInfo.projectName}`);
		documentPropertiesPage.updateDocumentProperty('File name', 'filename');
		documentPropertiesPage.updateDocumentProperty('Description', 'description', 'textarea');
		documentPropertiesPage.updateDocumentProperty('Interested Party number', 'IP1234');
		documentPropertiesPage.updateDocumentProperty('Who the document is from', 'from', 'textarea');
		documentPropertiesPage.updateDocumentProperty('Agent (optional)', 'agent');
		documentPropertiesPage.updateDocumentProperty('Webfilter', 'webfilter', 'textarea');
		documentPropertiesPage.updateDocumentType('No document type');
		documentPropertiesPage.updateDate('Date received', getDate(true));
		documentPropertiesPage.updateRedactionStatus('Redacted');
		documentPropertiesPage.verifyPageTitle(`Document properties - ${projectInfo.projectName}`);
	});
});

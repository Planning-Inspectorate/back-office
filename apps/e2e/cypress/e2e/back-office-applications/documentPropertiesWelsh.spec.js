// @ts-nocheck

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
const { applications: applicationsUsers } = users;

const fileName = () => 'filename';
const description = () => 'description';
const descriptionforWelsh = () => 'description for welsh';
const documentFrom = () => 'from';
const documentFromWelsh = () => 'document from welsh';
const agent = () => 'agent';
const webfilter = () => 'webfilter';
const webfilterforWelsh = () => 'webfilter for welsh';

describe('Document Properties including welsh fields', () => {
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

	let projectInfo = projectInformation({ includeWales: true });

	before(() => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			cy.login(applicationsUsers.caseAdmin);
			createCasePage.createCase(projectInfo, true);
		}
	});

	beforeEach(() => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			applicationsHomePage.loadCurrentCase();
			searchResultsPage.verifyPageTitle(`Overview - ${projectInfo.projectName}`);
			searchResultsPage.clickLinkByText('Project documentation');
			searchResultsPage.clickLinkByText('Project management');
			fileUploadPage.verifyPageTitle(`Project management folder - ${projectInfo.projectName}`);
		}
	});

	it('As a user should be able to upload a document to a case and update the fields including Welsh and publish the document', () => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			fileUploadPage.verifyUploadButtonIsVisible();
			fileUploadPage.uploadFile('test.pdf');
			fileUploadPage.clickButtonByText('Save and continue');
			fileUploadPage.verifyPageTitle(`Project management folder - ${projectInfo.projectName}`);
			fileUploadPage.verifyFolderDocuments(1);
			fileUploadPage.verifyUploadIsComplete();
			fileUploadPage.clickLinkByText('View/Edit properties');
			documentPropertiesPage.updateDocumentProperty('File name', fileName());
			documentPropertiesPage.updateDocumentProperty('Description', description(), 'textarea');
			documentPropertiesPage.updateDocumentProperty(
				'Description in Welsh',
				descriptionforWelsh(),
				'textarea'
			);
			documentPropertiesPage.updateDocumentProperty(
				'Who the document is from',
				documentFrom(),
				'textarea'
			);
			documentPropertiesPage.updateDocumentProperty(
				'Who the document is from in Welsh',
				documentFromWelsh(),
				'textarea'
			);
			documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
			documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter(), 'textarea');
			documentPropertiesPage.updateDocumentProperty(
				'Webfilter in Welsh',
				webfilterforWelsh(),
				'textarea'
			);
			documentPropertiesPage.updateDocumentType('No document type');
			documentPropertiesPage.updateDate('Date received', getDate(true));
			documentPropertiesPage.updateRedactionStatus('Redacted');
			documentPropertiesPage.clickBackLink();
			documentPropertiesPage.verifyPageTitle(
				`Project management folder - ${projectInfo.projectName}`
			);
			folderPage.markAllReadyToPublish();
			folderPage.clickLinkByText('View publishing queue');
			folderPage.publishAllDocumentsInList();
			documentPropertiesPage.verifyPageTitle('Document/s successfully published');
		}
	});

	it('As a user try to pubilish the document without welsh field values and validated the error messages', () => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			fileUploadPage.verifyUploadButtonIsVisible();
			fileUploadPage.uploadFile('sample-doc.pdf');
			searchResultsPage.clickButtonByText('Save and continue');
			fileUploadPage.clickLinkByText('View/Edit properties');
			documentPropertiesPage.updateDocumentProperty('File name', fileName());
			documentPropertiesPage.updateDocumentProperty('Description', description(), 'textarea');
			documentPropertiesPage.updateDocumentProperty(
				'Who the document is from',
				documentFrom(),
				'textarea'
			);
			documentPropertiesPage.updateDocumentProperty('Agent (optional)', agent());
			documentPropertiesPage.updateDocumentProperty('Webfilter', webfilter(), 'textarea');
			documentPropertiesPage.updateDocumentType('No document type');
			documentPropertiesPage.updateDate('Date received', getDate(true));
			documentPropertiesPage.updateRedactionStatus('Redacted');
			documentPropertiesPage.clickBackLink();
			documentPropertiesPage.verifyPageTitle(
				`Project management folder - ${projectInfo.projectName}`
			);
			folderPage.markAllReadyToPublish();
			documentPropertiesPage.verifyPageTitle(
				`Project management folder - ${projectInfo.projectName}`,
				{
					error: true
				}
			);
			documentPropertiesPage.validateSummaryErrorMessage(
				'You must fill in all mandatory document properties to publish a document'
			);
		}
	});
});

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

describe('Upload different types of document and validate the transcript value', () => {
	let projectInfo;
	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		applicationsHomePage.loadCurrentCase();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it('As a user should be able to upload a document to a case', () => {
		fileUploadPage.fileUpload('sample-doc.pdf', 1);
	});

	it('As a user  able to upload a html file to a case and validate the transcript value', () => {
		fileUploadPage.fileUpload('NI_Video_Template_2.html', 2);
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.enterDocRefandValidateTranscriptValue();
	});

	it('As a user able to upload MP3 file to a case and validate the transcript value', () => {
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.fileUpload('Sample.mp3', 3);
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.enterDocRefandValidateTranscriptValue();
	});

	it('As a user able to upload a video file to a case and validate the transcript value', () => {
		fileUploadPage.fileUpload('sample-video.mp4', 4);
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.enterDocRefandValidateTranscriptValue();
	});

	it('As a user enters incorrect document reference number then error will displayed ', () => {
		fileUploadPage.fileUpload('NI_Template_2.html', 5);
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.enterIncorrectDocumentRefNumber(Cypress.env('currentCreatedCase'));
		documentPropertiesPage.validateDocumentErrorMessage();
	});
});

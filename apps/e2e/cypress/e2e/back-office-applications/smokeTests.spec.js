// @ts-nocheck
/// <reference types="cypress"/>
import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { validateProjectOverview } from '../../support/utils/utils';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { DocumentPropertiesPage } from '../../page_objects/documentPropertiesPage.js';
import { ExaminationTimetablePage } from '../../page_objects/examinationTimetablePage';
import { FolderDocumentsPage } from '../../page_objects/folderDocumentsPage';
import { timetableItem } from '../../support/utils/createTimetableItemInfo';
import { s51AdviceDetails } from '../../support/utils/createS51Advice.js';
import { S51AdvicePage } from '../../page_objects/s51AdvicePage.js';
import { CasePage } from '../../page_objects/casePage';

const createCasePage = new CreateCasePage();
const casePage = new CasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const documentPropertiesPage = new DocumentPropertiesPage();
const examTimetablePage = new ExaminationTimetablePage();
const folderPage = new FolderDocumentsPage();
const folderDocumentsPage = new FolderDocumentsPage();
const s51AdvicePage = new S51AdvicePage();
const { applications: applicationsUsers } = users;

const texts = {
	examTimetableLinkText: 'Examination timetable',
	createTimetableButtonText: 'Create new timetable item',
	successMessageText: 'Timetable item successfully added'
};
const itemOptions = [
	'Accompanied Site Inspection',
	'Compulsory Acquisition Hearing',
];

describe('Smoke tests', () => {
	let projectInfo;


	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	after(() => {
		cy.deleteDownloads();
	});

	it('runs the smoke tests successfully', () => {
		const fileName = 'sample-doc.pdf';
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateProjectOverview(projectInfo);
		searchResultsPage.clickLinkByText('Update project information');
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.verifyUploadButtonIsVisible();
		fileUploadPage.uploadFile(fileName);
		searchResultsPage.clickButtonByText('Save and continue');
		fileUploadPage.verifyFolderDocuments(1);
		fileUploadPage.verifyUploadIsComplete();
    // Verify the document is downloaded from properties page
		fileUploadPage.clickLinkByText('View/Edit properties');
		fileUploadPage.clickDownloadFile();

	// Verify the document version
	    fileUploadPage.uploadFile('test.pdf', true);
		fileUploadPage.clickButtonByText('Upload');
		documentPropertiesPage.validateVersionCount(2);

	// Verify exam timetable is created
		documentPropertiesPage.goBackToPrjdocumentationPage();
		documentPropertiesPage.goBackToOverviewPage();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		const itemType = itemOptions[0];
		const options = timetableItem();
		examTimetablePage.selectTimetableItem(itemType);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetails(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.clickLinkByText('Go back to examination timetable');

	// Verify Publish and Unpublish examtime table
		examTimetablePage.verifyPublishAndUnpublishExamtimetable();


	// Publish and Unpublish document
        searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
		fileUploadPage.clickLinkByText('View/Edit properties');
		documentPropertiesPage.updateAllProperties('Redacted');
		folderPage.markAllReadyToPublish();
		folderPage.clickLinkByText('View publishing queue');
		folderPage.validatePublishingQueueCase(projectInfo, caseRef);
		folderPage.publishAllDocumentsInList();
		folderPage.validateSuccessfulPublish(projectInfo, caseRef, 1);
        folderPage.navigateToProjectFolder();
		searchResultsPage.clickLinkByText('View/Edit properties');
		folderDocumentsPage.unpublishDocument();

	// Verify the create S51 Advice - Enquirer Full Details
	    folderPage.navigateToProjectFolder();
		documentPropertiesPage.goBackToPrjdocumentationPage();
		searchResultsPage.clickLinkByText('S51 advice');
		s51AdvicePage.clickButtonByText('Create new S51 advice');
		const details = s51AdviceDetails();
		const titlefirst='firsttitle';
		s51AdvicePage.completeS51Advice(details, {
			organisation: details.organisation,
			firstName: details.firstName,
			lastName: details.lastName
		},titlefirst);
	// Verify S51 Advice - Publish/Unpublish
       s51AdvicePage.verifyS51PubishandUnpublish();

    // Verify Project - Publish/Unpublish
	   casePage.publishUnpublishProject();

	});

});

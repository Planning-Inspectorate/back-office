// @ts-nocheck

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { ExaminationTimetablePage } from '../../page_objects/examinationTimetablePage';
import { timetableItem } from '../../support/utils/createTimetableItemInfo';

const applicationsHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const examTimetablePage = new ExaminationTimetablePage();
const { applications: applicationsUsers } = users;

const itemOptions = [
	'Accompanied Site Inspection',
	'Compulsory Acquisition Hearing',
	'Deadline',
	'Deadline For Close Of Examination',
	'Issued By',
	'Issue Specific Hearing',
	'Open Floor Hearing',
	'Other Meeting',
	'Preliminary Meeting',
	'Procedural Deadline (Pre-Examination)',
	'Procedural Decision',
	'Publication Of'
];

const texts = {
	examTimetableLinkText: 'Examination timetable',
	createTimetableButtonText: 'Create timetable item',
	successMessageText: 'Timetable item successfully added'
};

describe('Examination Timetable Errors', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('The dropdown should have correct items', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		cy.get('#timetable-type option').then((options) => {
			const optionValues = [...options].map((o) => o.value);
			expect(optionValues).to.deep.equal(itemOptions);
		});
	});

	it('Should trigger validation errors - name, start time', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		cy.get('#timetable-type').select(itemOptions[0]);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.clickButtonByText('Continue');
		createCasePage.validateErrorMessageCountOnPage(5);
		createCasePage.validateErrorMessage('You must enter the item name');
		createCasePage.validateErrorMessage('You must enter the item date');
	});

	it('Should trigger validation errors - name, end time', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		cy.get('#timetable-type').select(itemOptions[2]);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.clickButtonByText('Continue');
		createCasePage.validateErrorMessageCountOnPage(9);
		createCasePage.validateErrorMessage('You must enter the item name');
		createCasePage.validateErrorMessage('You must enter the item end date');
	});

	it('Should trigger validation errors - end date', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		const itemType = itemOptions[2];
		const options = timetableItem();
		options.endYear = (options.currentYear - 2).toString();
		cy.get('#timetable-type').select(itemType);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetailsStartAndEnd(options);
		examTimetablePage.clickButtonByText('Continue');
		createCasePage.validateErrorMessageCountOnPage(4);
		createCasePage.validateErrorMessage('The item end date must be after the item start date');
	});
});

describe('Examination Timetable', () => {
	let projectInfo;
	let caseRef;

	before(() => {
		projectInfo = projectInformation({ excludeWales: true });
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		applicationsHomePage.loadCurrentCase();
		examTimetablePage.clickLinkByText('Examination timetable');
		examTimetablePage.deleteAllExaminationTimetableItems();
		applicationsHomePage.loadCurrentCase();
		caseRef = Cypress.env('currentCreatedCase');
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
	});

	it('As a user able to create timetable item - only start dates (StartTime Mandatory Template)', () => {
		const options = timetableItem();
		examTimetablePage.selectTimetableItem('Accompanied Site Inspection');
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetails(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', 'Accompanied Site Inspection');
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
	});

	it('As a user able to create timetable item - start and end dates (Deadline Template)', () => {
		const options = timetableItem();
		examTimetablePage.selectTimetableItem('Deadline');
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetailsStartAndEnd(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', 'Deadline');
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Start date', options.startDateFullDeadLine);
		examTimetablePage.checkAnswer('End date', options.endDateFullDeadLine);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
	});

	it('As a user able to create timetable item - (NoTimes Template)', () => {
		const options = timetableItem();
		examTimetablePage.selectTimetableItem('Issued By');
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemNameAndDate(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', 'Issued By');
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFullDeadLine);
		examTimetablePage.checkAnswer('Timetable item description', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
	});

	it('As a user able to create timetable item - (Deadline StartDate Template)', () => {
		const options = timetableItem();
		examTimetablePage.selectTimetableItem('Procedural Deadline (Pre-Examination)');
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetailsStartAndEnd(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', 'Procedural Deadline (Pre-Examination)');
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFullDeadLine);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.clickLinkByText('Go back to examination timetable');
		examTimetablePage.publishUnpublishExamTimetable();
	});
});

// @ts-nocheck
/// <reference types="cypress"/>

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
	createTimetableButtonText: 'Create new timetable item',
	successMessageText: 'Timetable item successfully created'
};

/*describe('Examination Timetable Errors', () => {
	let projectInfo = projectInformation();
	let caseRef;

	before(() => {
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
	});

	it('The dropdown should have correct items', () => {
		cy.get('#timetable-type option').then((options) => {
			const optionValues = [...options].map((o) => o.value);
			expect(optionValues).to.deep.equal(itemOptions);
		});
	});

	it('Should trigger validation errors - name, start time', () => {
		cy.get('#timetable-type').select(itemOptions[0]);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.clickButtonByText('Continue');
		createCasePage.validateErrorMessageCountOnPage(8);
		createCasePage.validateErrorMessage('You must enter the item name');
		createCasePage.validateErrorMessage('You must enter the item date');
		createCasePage.validateErrorMessage('You must enter the item start time');
	});

	it('Should trigger validation errors - name, end time', () => {
		cy.get('#timetable-type').select(itemOptions[2]);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.clickButtonByText('Continue');
		createCasePage.validateErrorMessageCountOnPage(8);
		createCasePage.validateErrorMessage('You must enter the item name');
		createCasePage.validateErrorMessage('You must enter the item end date');
		createCasePage.validateErrorMessage('You must enter the item end time');
	});

	it('Should trigger validation errors - end date', () => {
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
});*/

describe('Examination Timetable', () => {
	let projectInfo = projectInformation();
	let caseRef;

	before(() => {
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('Should create timetable item - only start dates (StartTime Mandatory Template)', () => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
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
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description (optional)', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
		examTimetablePage.clickLinkByText('Go back to examination table');
		examTimetablePage.toggleExaminationTimetableItem(options.itemName, false);
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Description', options.description);
		examTimetablePage.toggleExaminationTimetableItem(options.itemName);
	});

	it('Should create timetable item - start and end dates (Deadline Template)', () => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		const itemType = itemOptions[2];
		const options = timetableItem();
		examTimetablePage.selectTimetableItem(itemType);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetailsStartAndEnd(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Start date', options.startDateFull);
		examTimetablePage.checkAnswer('End date', options.endDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description (optional)', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
		examTimetablePage.clickLinkByText('Go back to examination table');
		examTimetablePage.toggleExaminationTimetableItem(options.itemName, false);
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Start date', options.startDateFull);
		examTimetablePage.checkAnswer('End date', options.endDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Description', options.description);
		examTimetablePage.toggleExaminationTimetableItem(options.itemName);
	});

	it('Should create timetable item - (NoTimes Template)', () => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		const itemType = itemOptions[4];
		const options = timetableItem();
		examTimetablePage.selectTimetableItem(itemType);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemNameAndDate(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Timetable item description (optional)', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
		examTimetablePage.clickLinkByText('Go back to examination table');
		examTimetablePage.toggleExaminationTimetableItem(options.itemName, false);
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Description', options.description);
		examTimetablePage.toggleExaminationTimetableItem(options.itemName);
	});

	it('Should create timetable item - (Deadline StartDate Template)', () => {
		cy.visit('/');
		caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		examTimetablePage.clickLinkByText(texts.examTimetableLinkText);
		examTimetablePage.clickButtonByText(texts.createTimetableButtonText);
		const itemType = itemOptions[9];
		const options = timetableItem();
		examTimetablePage.selectTimetableItem(itemType);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.fillItemDetailsStartAndEnd(options);
		examTimetablePage.clickButtonByText('Continue');
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Timetable item description (optional)', options.description);
		examTimetablePage.clickButtonByText('Save item');
		examTimetablePage.validateSuccessPanelTitle(texts.successMessageText);
		examTimetablePage.validateSuccessPanelBody(projectInfo.projectName);
		examTimetablePage.validateSuccessPanelBody(caseRef);
		examTimetablePage.clickLinkByText('Go back to examination table');
		examTimetablePage.toggleExaminationTimetableItem(options.itemName, false);
		examTimetablePage.checkAnswer('Item type', itemType);
		examTimetablePage.checkAnswer('Item name', options.itemName);
		examTimetablePage.checkAnswer('Date', options.startDateFull);
		examTimetablePage.checkAnswer('Start time', options.startTimeFormatted);
		examTimetablePage.checkAnswer('End time', options.endTimeFormatted);
		examTimetablePage.checkAnswer('Description', options.description);
		examTimetablePage.toggleExaminationTimetableItem(options.itemName);
	});
});

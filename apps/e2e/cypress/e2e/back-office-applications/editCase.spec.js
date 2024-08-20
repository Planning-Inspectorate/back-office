// @ts-nocheck
/// <reference types="cypress"/>

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { Page } from '../../page_objects/basePage';
import { CasePage } from '../../page_objects/casePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';

const applicationsHomePage = new ApplicationsHomePage();
const page = new Page();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationsUsers } = users;

describe('Edit a case', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');

		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();

		if (!Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			page.clickLinkByText('Project information');
			page.clickAccordionByText('Project details');
			page.clickAccordionByText('Applicant information');
		}
	});

	it('Should be able to edit material change field', () => {
		if (!Cypress.env('featureFlags')['applics-156-material-changes']) {
			return;
		}

		casePage.clickChangeLink('Material change application');
		page.selectRadioButtonByValue('Yes');
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Material change application', 'Yes');
	});

	it('Should be able to change the regions', () => {
		casePage.clickChangeLink(
			Cypress.env('featureFlags')['applic-55-welsh-translation'] ? 'Regions' : 'Region(s)'
		);
		page.chooseCheckboxByIndex(0);
		page.clickButtonByText('Save changes');
	});

	it('Should be able to change the case stage', () => {
		const caseStage = 'Decision';

		casePage.clickChangeLink('Case stage');
		page.selectRadioButtonByValue(caseStage);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Case stage', caseStage);
	});

	it('Should be able to change the project name', () => {
		const projectName = 'Updated test project name';

		casePage.clickChangeLink('Project name');
		page.fillTextArea(projectName);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Project name', projectName);
	});

	it('Should be able to change the project description', () => {
		const projectDescription = 'Updated test project description';

		casePage.clickChangeLink('Project description');
		page.fillTextArea(projectDescription);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Project description', projectDescription);
	});

	it('Should be able to change the project location', () => {
		const projectLocation = 'test location';

		casePage.clickChangeLink('Project location');
		page.fillTextArea(projectLocation);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Project location', projectLocation);
	});

	it('Should be able to update the project email address', () => {
		const email = 'test@email.com';

		casePage.clickChangeLink('Project email address');
		page.fillInput(email);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Project email address', email);
	});

	it('Should be able to update the project grid references', () => {
		const input = '345678';

		casePage.clickChangeLink('Grid references');
		createCasePage.sections.geographicalInformation.fillEastingGridRef(input);
		createCasePage.sections.geographicalInformation.fillNorthingGridRef(input);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Grid references', `${input} (Easting)${input} (Northing)`);
	});

	it('Should be able to update the map zoom level', () => {
		const zoomLevel = 'None';

		casePage.clickChangeLink('Map zoom level');
		page.selectRadioButtonByValue(zoomLevel);
		page.clickButtonByText('Save changes');

		casePage.checkProjectAnswer('Map zoom level', zoomLevel);
	});

	it('Should be able to update the organisation name', () => {
		const organisationName = 'Test organisation name';

		casePage.clickChangeLink('Organisation name', true);
		page.fillInput(organisationName);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem('Organisation name', organisationName);
	});

	it('Should be able to update the contact name', () => {
		const contactName = 'test name';

		casePage.clickChangeLink('Contact name (Internal use only)', true);
		page.fillInput(contactName);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem(
			'Contact name (Internal use only)',
			`${contactName}  ${projectInfo.applicantLastName}`
		);
	});

	it('Should be able to update the address', () => {
		casePage.clickChangeLink('Address (Internal use only)', true);
		page.clickLinkByText('Change');
		createCasePage.sections.applicantAddress.fillApplicantPostcode(projectInfo.postcode2);
		cy.get('button.govuk-button:nth-child(4)').click();
		page.chooseSelectItemByIndex(1);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem('Address (Internal use only)', projectInfo.applicantFullAddress2);
	});

	it('Should be able to update the website', () => {
		const website = 'https://google.com';

		casePage.clickChangeLink('Website', true);
		page.fillInput(website);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem('Website', website);
	});

	it('Should be able to update applicant email address', () => {
		const email = 'test@email.com';

		casePage.clickChangeLink('Email address', true);
		page.fillInput(email);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem('Email address', email);
	});

	it('Should be able to update telephone number', () => {
		const phone = '0300 123 3000';

		casePage.clickChangeLink('Telephone number (Internal use only)', true);
		page.fillInput(phone);
		page.clickButtonByText('Save changes');

		casePage.validateSummaryItem('Telephone number (Internal use only)', phone);
	});
});

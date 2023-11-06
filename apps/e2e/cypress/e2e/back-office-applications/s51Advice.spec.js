// @ts-nocheck
/// <reference types="cypress"/>

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { S51AdvicePage } from '../../page_objects/s51AdvicePage.js';
import { s51AdviceDetails } from '../../support/utils/createS51Advice.js';

const applicationsHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const s51AdvicePage = new S51AdvicePage();
const { applications: applicationsUsers } = users;

const texts = {
	projectDocumentationLinkText: 'Project documentation',
	s51AdviceLinkText: 'S51 advice',
	createS51AdviceButtonText: 'Create new S51 advice',
	successMessageText: 'Timetable item successfully created'
};


describe('Section 51 Advice', () => {
	let projectInfo;

	beforeEach(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('S51 Advice - Enquirer Full Details', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
		s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
		s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
		const details = s51AdviceDetails();
		s51AdvicePage.completeS51Advice(details, {
			organisation: details.organisation,
			firstName: details.firstName,
			lastName: details.lastName
		});
	});

	it('S51 Advice - Enquirer Name Only', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
		s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
		s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
		const details = s51AdviceDetails();
		s51AdvicePage.completeS51Advice(details, {
			firstName: details.firstName,
			lastName: details.lastName
		});
	});

	it('S51 Advice - Enquirer Org Only', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
		s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
		s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
		const details = s51AdviceDetails();
		s51AdvicePage.completeS51Advice(details, { organisation: details.organisation });
	});
});

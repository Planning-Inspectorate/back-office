// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { ProjectTeamPage } from '../../page_objects/projectTeamPage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const projectTeamPage = new ProjectTeamPage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationUsers } = users;

describe('Project team related scenarios ', () => {
	let projectInfo;
	let email;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('Add team member and verify the role is added to project team', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.log(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		email=Cypress.env('CASE_ADMIN_EMAIL');
		projectTeamPage.addTeamMeber(email);
		projectTeamPage.verifyCaseManagerRoleAdded();
	});

	it('Verify team member is added', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		email=Cypress.env('CASE_ADMIN_EMAIL');
		projectTeamPage.searchTeamMemberByEmail(email);
        projectTeamPage.verifyTeamMemberIsAdded();
	});

	it('Enter valid input and verify multiple results count', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		projectTeamPage.searchTeamMemberByEmail('test');
		projectTeamPage.validateMultipleSearchCount();
	});

	it('Enter invalid input and verify the error and count', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		projectTeamPage.searchTeamMemberByEmail('abc');
		projectTeamPage.verifyInvalidSearchResultsMessageAndCount();
	});

	it('Verify the error message without entering the search criteria', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		projectTeamPage.validateErrorMessageWithoutEnteringAnything();
	});

});

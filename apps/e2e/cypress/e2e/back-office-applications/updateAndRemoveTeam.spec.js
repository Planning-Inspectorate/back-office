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

describe('Update and remove team related scenarios ', () => {
	let projectInfo;
	let email;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('As a user able to verify inspector role is added to project team', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		email=Cypress.env('INSPECTOR_EMAIL');
		projectTeamPage.addTeamMeber(email);
		projectTeamPage.verifyCaseManagerRoleAdded();

	});

	it('As a user able to update the inspector team member role from CaseManager to Operations Manager', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project team');
        projectTeamPage.verifyRoleChangedToOperationsManager();
	});

	it('As a user able remove the team role from project team section', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		projectTeamPage.clickOnProjectTeamLink();
		projectTeamPage.verifyTeamRoleIsRemoved();
	});
});

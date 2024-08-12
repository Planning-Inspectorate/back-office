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

	beforeEach(() => {
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
	});

	it('As a user able to add team member and verify the role is added to project team', () => {
		email = Cypress.env('CASE_ADMIN_EMAIL');
		projectTeamPage.addTeamMeber(email);
		projectTeamPage.verifyCaseManagerRoleAdded();
	});

	it('As a user able to verify team member is added', () => {
		email = Cypress.env('CASE_ADMIN_EMAIL');
		projectTeamPage.searchTeamMemberByEmail(email);
		projectTeamPage.verifyTeamMemberIsAdded();
	});

	it('As a user able to enter valid input and verify multiple results count', () => {
		projectTeamPage.searchTeamMemberByEmail('test');
		projectTeamPage.validateMultipleSearchCount();
	});

	it('As a user able to enter invalid input and verify the error and count', () => {
		projectTeamPage.searchTeamMemberByEmail('abc');
		projectTeamPage.verifyInvalidSearchResultsMessageAndCount();
	});

	it('As a user able to verify the error message without entering the search criteria', () => {
		projectTeamPage.validateErrorMessageWithoutEnteringAnything();
	});
});

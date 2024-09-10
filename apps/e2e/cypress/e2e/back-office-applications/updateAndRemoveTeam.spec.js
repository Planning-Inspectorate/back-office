// @ts-nocheck

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
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project team');
		searchResultsPage.clickButtonByText('Add team member');
		email = Cypress.env('INSPECTOR_EMAIL');
		projectTeamPage.addTeamMember(email);
		projectTeamPage.verifyCaseManagerRoleAdded();
	});

	it('As a user able to update the inspector team member role from CaseManager to Operations Manager', () => {
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project team');
		projectTeamPage.verifyRoleChangedToOperationsManager();
	});

	it('As a user able remove the team role from project team section', () => {
		applicationsHomePage.loadCurrentCase();
		projectTeamPage.clickOnProjectTeamLink();
		//projectTeamPage.verifyTeamRoleIsRemoved();
	});
});

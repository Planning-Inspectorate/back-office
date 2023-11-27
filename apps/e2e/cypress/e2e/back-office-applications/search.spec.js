// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationsUsers } = users;

describe('Search', () => {
	let projectInfo;
	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});


	context('As Inspector', () => {
		beforeEach(() => {
			cy.login(applicationsUsers.inspector);
			cy.visit('/');
		});

		it('Inspector user should be able to use search using Case Reference', () => {
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Inspector user should be able to use search using Case Name', () => {
			applicationsHomePage.searchFor(projectInfo.projectName);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Inspector user should be able to use search using Case Description', () => {
			applicationsHomePage.searchFor(projectInfo.projectDescription);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});
	});

	context('As Case Team Admin', () => {
		beforeEach(() => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
		});

		it('Case Team Admin user should be able to use search using Case Reference', () => {
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team Admin user should be able to use search using Case Name', () => {
			applicationsHomePage.searchFor(projectInfo.projectName);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team Admin user should be able to use search using Case Description', () => {
			applicationsHomePage.searchFor(projectInfo.projectDescription);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team Admin user should see an error when nothing is entered', () => {
			applicationsHomePage.searchFor(' ');
			searchResultsPage.verifySearchError('Enter a search term');
		});
	});

	// Case team email, is not in use. Once after resetting the password, going to uncomment the code.

	/*context('As Case Team', () => {
		beforeEach(() => {
			cy.login(applicationsUsers.caseTeam);
			cy.visit('/');
		});

		it('Case Team user should be able to use search using Case Reference', () => {
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team user should be able to use search using Case Name', () => {
			applicationsHomePage.searchFor(projectInfo.projectName);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team user should be able to use search using Case Description', () => {
			applicationsHomePage.searchFor(projectInfo.projectDescription);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});

		it('Case Team user should see an error when nothing is entered', () => {
			applicationsHomePage.searchFor(' ');
			searchResultsPage.verifySearchError('Enter a search term');
		});

		it('Case Team user should see an error when nothing is entered', () => {
			applicationsHomePage.searchFor('TR');
			searchResultsPage.verifySearchResultsCount();
		});
	});*/
});

// Case team email, is not in use. Once after resetting the password, going to uncomment the code.

/*Object.keys(applicationsUsers).forEach((user) => {
	describe(`Search - Error/General - ${user}`, () => {
		beforeEach(() => {
			cy.login(applicationsUsers[user]);
			cy.visit('/');
		});
		it(`${user} user should see an error when nothing is entered`, () => {
			applicationsHomePage.searchFor('TR');
			searchResultsPage.verifySearchResultsCount();
		});
		it(`${user} user should see an error when nothing is entered`, () => {
			applicationsHomePage.searchFor('TR');
			searchResultsPage.verifySearchResultsCount();
		});
	});
});*/

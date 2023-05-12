// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { faker } from '@faker-js/faker';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { isCI } from '../../support/utils/isCI';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();

describe('Search', () => {
	let projectInfo;
	before(() => {
		projectInfo = projectInformation();
		cy.login(users.caseTeam);
		createCasePage.createCase(projectInfo);
		cy.clearAllCookies();
	});

	context('As Inspector', () => {
		beforeEach(() => {
			cy.login(users.inspector);
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

	if (!isCI()) {
		context('As Case Team Admin', () => {
			beforeEach(() => {
				cy.login(users.caseAdmin);
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
	}

	context('As Case Team', () => {
		beforeEach(() => {
			cy.login(users.caseTeam);
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
	});
});

if (isCI()) {
	delete users.caseAdmin;
}

Object.keys(users).forEach((user) => {
	if (user != users.caseAdmin)
		describe(`Search - Error/General - ${user}`, () => {
			beforeEach(() => {
				cy.login(users[user]);
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
});

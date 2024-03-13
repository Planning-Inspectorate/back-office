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


	context('As a user', () => {
		beforeEach(() => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
		});

		it('As a user able to use search using Case Reference', () => {
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.verifySearchResultsCount(1);
			searchResultsPage.verifyTopSearchResultName(projectInfo.projectName);
		});


		it('As a user able to see an error when nothing is entered', () => {
			applicationsHomePage.searchFor(' ');
			searchResultsPage.verifySearchError('Enter a search term');
		});
	});

});



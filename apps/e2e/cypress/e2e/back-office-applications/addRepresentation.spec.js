// @ts-nocheck
/// <reference types="cypress"/>
import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { RepresentationPage } from '../../page_objects/representationPage.js';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const representationPage = new RepresentationPage();
const { applications: applicationsUsers } = users;

describe('Add representation scenarios', () => {
	let projectInfo;


	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('Add a representation to the case',{ tags: '@smoke' }, () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Relevant representations');
		searchResultsPage.clickButtonByText('Add a representation');
		representationPage.fillRepresentationDetails();
	});
	it('Search representation', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Relevant representations');
		representationPage.searchRepresenation();
	});
});

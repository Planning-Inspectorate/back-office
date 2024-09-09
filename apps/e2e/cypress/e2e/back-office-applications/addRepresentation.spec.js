// @ts-nocheck

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

	it('As a user able to add a representation to the case', () => {
		applicationsHomePage.loadCurrentCase();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Relevant representations');
		searchResultsPage.clickButtonByText('Add a representation');
		representationPage.fillRepresentationDetails();
		representationPage.publishUnpublshRepresentations();
	});
});

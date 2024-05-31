// @ts-nocheck
/// <reference types="cypress"/>

import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { users } from '../../fixtures/users';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { S51AdvicePage } from '../../page_objects/s51AdvicePage.js';
import { s51AdviceDetails } from '../../support/utils/createS51Advice.js';
import { updateProjectRegions } from '../../support/utils/utils';

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
	let caseRef;

	before(() => {
		projectInfo = projectInformation({ excludeWelsh: true });
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	describe('in an English region', () => {
		beforeEach(() => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
			s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
			s51AdvicePage.clickButtonByText(texts.createS51AdviceButtonText);
		});

		it('As a user able to create S51 Advice - Enquirer Full Details', () => {
			const details = s51AdviceDetails();
			const titlefirst = 'firsttitle';
			s51AdvicePage.completeS51Advice(
				details,
				{
					organisation: details.organisation,
					firstName: details.firstName,
					lastName: details.lastName
				},
				titlefirst
			);
		});

		it('As a user able to create S51 Advice - Enquirer Name Only', () => {
			const details = s51AdviceDetails();
			const titlesecond = 'secondtitle';
			s51AdvicePage.completeS51Advice(
				details,
				{
					firstName: details.firstName,
					lastName: details.lastName
				},
				titlesecond
			);
		});

		it('As a user able to create S51 Advice - Enquirer Org Only', () => {
			const details = s51AdviceDetails();
			const titlethird = 'thirdtitle';
			s51AdvicePage.completeS51Advice(details, { organisation: details.organisation }, titlethird);
		});
	});

	describe('updating region to be Wales', () => {
		beforeEach(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				s51AdvicePage.clickLinkByText(texts.projectDocumentationLinkText);
				s51AdvicePage.clickLinkByText(texts.s51AdviceLinkText);
			}
		});

		it('As a user able to view an existing S51 Advice with Welsh fields included', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				s51AdvicePage.clickLinkByText('View/edit advice');
				s51AdvicePage.basePageElements.linkByText('S51 title in Welsh');
				s51AdvicePage.basePageElements.linkByText('Enquiry details in Welsh');
				s51AdvicePage.basePageElements.linkByText('Advice given in Welsh');
			}
		});
	});
});

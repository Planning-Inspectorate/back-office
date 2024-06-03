// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import {
	updateProjectInformation,
	updateProjectNameInWelsh,
	updateProjectDescriptionInWelsh,
	updateProjectLocationInWelsh,
	updateProjectRegions,
	validateProjectInformation,
	validateProjectOverview,
	validatePreviewAndPublishInfo,
	validateWelshProjectInformation
} from '../../support/utils/utils';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CasePage } from '../../page_objects/casePage';

const applicationsHomePage = new ApplicationsHomePage();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationsUsers } = users;

function clickonWelshProjectName() {
	casePage.clickChangeLink('Project name in Welsh');
	casePage.fillInput('êŵŵîôôôôôû');
	casePage.clickButtonByText('Save changes');
}
function clickonWelshProjectDesc() {
	casePage.clickChangeLink('Project description in Welsh');
	cy.get('#descriptionWelsh').clear();
	casePage.fillTextArea('êŵŵîôôôôôûêŵŵîôôôôôûêŵŵîôôôôôûêŵŵîôôôôôûvvêŵŵîôôôôôûvêŵŵîôôôôôû');
	casePage.clickButtonByText('Save changes');
}

function validateErrorMessageForProjectname() {
	casePage.clickChangeLink('Project name in Welsh');
	cy.get('#titleWelsh').clear();
	casePage.clickButtonByText('Save changes');
	cy.get('#main-content > div > div > div > div > div > ul > li > a').contains(
		'Enter the name of the project in Welsh'
	);
}
function validateErrorMessageForProjectdesc() {
	casePage.clickChangeLink('Project description in Welsh');
	cy.get('#descriptionWelsh').clear();
	casePage.clickButtonByText('Save changes');
	cy.get('#main-content > div > div > div > div > div > ul > li > a').contains(
		'Enter the description of the project in Welsh'
	);
}
function validateErrorMessageForProjectlocation() {
	casePage.clickChangeLink('Project location in Welsh');
	cy.get(
		'body > div:nth-child(4) > main:nth-child(2) > form:nth-child(2) > div:nth-child(1) > textarea'
	).clear();
	casePage.clickButtonByText('Save changes');
	cy.get('#main-content > div > div > div > div > div > ul > li > a').contains(
		'Enter the project location in Welsh'
	);
}

describe('Enable and update Project Information with Welsh fields', () => {
	context('As a user', () => {
		let projectInfo = projectInformation({ includeWales: true });
		let projectInfoNew = projectInformation({ includeWales: true });

		before(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				createCasePage.createCase(projectInfo, true);
			}
		});

		it('As a user able to update the case information with welsh fields', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				validateProjectOverview(projectInfo, true);
				casePage.showAllSections();
				validateWelshProjectInformation(projectInfo, true);
				updateProjectInformation(projectInfoNew);
				validateProjectInformation(projectInfoNew, false, true);
				casePage.clickLinkByText('Overview');
				casePage.clickPublishProjectButton();
				validatePreviewAndPublishInfo(projectInfoNew);
				casePage.clickButtonByText('Accept and publish project');
				casePage.validatePublishBannerMessage('Project page successfully published');
			}
		});

		it('As a user able to able to update the project name in welsh language', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				clickonWelshProjectName();
			}
		});

		it('Able to validate the error message for project name in welsh language field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				validateErrorMessageForProjectname();
			}
		});

		it('As a user able to able to update the project desc in welsh language', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				clickonWelshProjectDesc();
			}
		});
		it('Able to validate the error message for project desc welsh field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				validateErrorMessageForProjectdesc();
			}
		});
		it('Able to validate the error message for project location welsh field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.login(applicationsUsers.caseAdmin);
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				validateErrorMessageForProjectlocation();
			}
		});
	});
});

describe('Update project information to add a Welsh region', () => {
	context('As a user', () => {
		let projectInfo;

		before(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectInfo = projectInformation({ excludeWales: true });
				cy.login(applicationsUsers.caseAdmin);
				createCasePage.createCase(projectInfo);
			}
		});

		it('Publish fails when Welsh fields are not populated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				casePage.clickPublishProjectButton();
				casePage.validateErrorMessageCountInSummary(3);
				casePage.validateErrorMessageIsInSummary('Enter the name of the project in Welsh');
				casePage.validateErrorMessageIsInSummary('Enter the description of the project in Welsh');
				casePage.validateErrorMessageIsInSummary('Enter the project location in Welsh');
			}
		});

		it('Publish passes when Welsh fields are populated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				if (!projectInfo.regions.includes('Wales')) {
					projectInfo.regions = [...projectInfo.regions, 'Wales'].sort();
				}
				updateProjectRegions(projectInfo.regions);
				updateProjectNameInWelsh(projectInfo.projectNameInWelsh);
				updateProjectDescriptionInWelsh(projectInfo.projectDescriptionInWelsh);
				updateProjectLocationInWelsh(projectInfo.projectLocationInWelsh);
				casePage.clickPublishProjectButton();
				casePage.validateErrorMessageCountInSummary(0);
				validatePreviewAndPublishInfo(projectInfo);
			}
		});
	});
});

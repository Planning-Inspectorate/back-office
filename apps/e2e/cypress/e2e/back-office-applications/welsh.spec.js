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
import { ExaminationTimetablePage } from '../../page_objects/examinationTimetablePage';
import { timetableItem } from '../../support/utils/createTimetableItemInfo.js';

const applicationsHomePage = new ApplicationsHomePage();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const examTimetablePage = new ExaminationTimetablePage();
const { applications: applicationsUsers } = users;

function clickonWelshProjectName() {
	casePage.clickChangeLink('Project name in Welsh');
	casePage.fillTextArea('êŵŵîôôôôôû');
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
	casePage.validateErrorMessageIsInSummary('Enter project name in Welsh');
}
function validateErrorMessageForProjectdesc() {
	casePage.clickChangeLink('Project description in Welsh');
	cy.get('#descriptionWelsh').clear();
	casePage.clickButtonByText('Save changes');
	casePage.validateErrorMessageIsInSummary('Enter project description in Welsh');
}
function validateErrorMessageForProjectlocation() {
	casePage.clickChangeLink('Project location in Welsh');
	casePage.clearTextArea();
	casePage.clickButtonByText('Save changes');
	casePage.validateErrorMessage('Enter project location in Welsh');
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
				casePage.validateErrorMessageIsInSummary('Enter project name in Welsh');
				casePage.validateErrorMessageIsInSummary('Enter project description in Welsh');
				casePage.validateErrorMessageIsInSummary('Enter project location in Welsh');
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

describe('Display and edit welsh fields in Examination Timetable', () => {
	context('As a user', () => {
		function openAccordion(text) {
			cy.contains(text).find('.govuk-accordion__section-toggle-text').scrollIntoView().click();
		}

		function validateBannerMessage(bannerText) {
			cy.get('.govuk-notification-banner__content')
				.invoke('text')
				.then((text) => {
					expect(text.trim()).to.equal(bannerText);
				});
		}

		let projectInfo;

		before(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectInfo = projectInformation({ excludeWales: true });
				cy.login(applicationsUsers.caseAdmin);
				createCasePage.createCase(projectInfo);
			}
		});

		it('Welsh fields are present on the examination timetable item', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				examTimetablePage.clickLinkByText('Examination timetable');
				examTimetablePage.clickButtonByText('Create timetable item');
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');
				cy.get('.govuk-accordion__section-button').click();
				examTimetablePage.checkAnswer('Item name in Welsh', '');
				examTimetablePage.checkAnswer('Item description in Welsh', '');
			}
		});

		it('Can edit examination timetable item name in welsh and it is validated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				examTimetablePage.clickLinkByText('Examination timetable');
				examTimetablePage.clickButtonByText('Create timetable item');
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				openAccordion(Cypress.env('currentCreatedItem'));
				examTimetablePage.clickChangeLink('Item name in Welsh');
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage('Enter item name in Welsh');

				examTimetablePage.fillInput('Name that is too long'.repeat(10));
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage('Item name in Welsh must be 200 characters or less');

				examTimetablePage.fillInput('Valid welsh name');
				examTimetablePage.clickSaveAndReturn();
				validateBannerMessage('Item name in Welsh updated');
			}
		});

		it('Can edit examination timetable item description in welsh and it is validated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				examTimetablePage.clickLinkByText('Examination timetable');
				examTimetablePage.clickButtonByText('Create timetable item');
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(timetableItem());
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');
				examTimetablePage.clickChangeLink('Item description');
				examTimetablePage.fillTextArea('Valid english description \n*bullet1');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				examTimetablePage.clickChangeLink('Item description in Welsh');
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage('Enter item description in Welsh');

				examTimetablePage.fillTextArea(
					'Description that has more bulletpoints than the english counterpart \n*bullet1\n*bullet2\n*bullet3'
				);
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage(
					'Item description in Welsh must contain the same number of bullets as the item description in English'
				);

				examTimetablePage.fillTextArea('Valid welsh description \n*bullet1');
				examTimetablePage.clickSaveAndReturn();
				validateBannerMessage('Item description in Welsh updated');
			}
		});

		it('Publishing fails when Item name in welsh is missing', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				cy.contains('a', 'Examination timetable').click();
				examTimetablePage.clickButtonByText('Create timetable item');
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				cy.get('.govuk-button').contains('Preview and publish').click();
				cy.get('.govuk-button').contains('Publish examination timetable').click();
				casePage.validateErrorMessageIsInSummary(
					`Enter examination timetable item name in welsh - ${options.itemName}`
				);
			}
		});

		it('Publishing succeeds when Item name in welsh is present', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				cy.visit('/');
				const caseRef = Cypress.env('currentCreatedCase');
				applicationsHomePage.searchFor(caseRef);
				searchResultsPage.clickTopSearchResult();
				updateProjectRegions(['Wales']);
				cy.contains('a', 'Examination timetable').click();
				examTimetablePage.clickButtonByText('Create timetable item');
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				openAccordion(Cypress.env('currentCreatedItem'));
				examTimetablePage.clickChangeLink('Item name in Welsh');
				examTimetablePage.fillInput('Valid welsh name');
				examTimetablePage.clickSaveAndReturn();
				validateBannerMessage('Item name in Welsh updated');

				cy.get('.govuk-button').contains('Preview and publish').click();
				cy.get('.govuk-button').contains('Publish examination timetable').click();

				cy.get('.govuk-panel__title').contains('Timetable item successfully published');
			}
		});
	});
});

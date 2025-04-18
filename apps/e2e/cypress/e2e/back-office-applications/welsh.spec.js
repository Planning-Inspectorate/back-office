// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
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
				applicationsHomePage.loadCurrentCase();
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
				applicationsHomePage.loadCurrentCase();
				clickonWelshProjectName();
			}
		});

		it('Able to validate the error message for project name in welsh language field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				validateErrorMessageForProjectname();
			}
		});

		it('As a user able to able to update the project desc in welsh language', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				clickonWelshProjectDesc();
			}
		});
		it('Able to validate the error message for project desc welsh field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				validateErrorMessageForProjectdesc();
			}
		});
		it('Able to validate the error message for project location welsh field', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
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
				applicationsHomePage.loadCurrentCase();
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
				applicationsHomePage.loadCurrentCase();
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
		let projectInfo;

		before(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectInfo = projectInformation({ excludeWales: true });
				cy.login(applicationsUsers.caseAdmin);
				createCasePage.createCase(projectInfo);
			}
		});

		beforeEach(() => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				updateProjectRegions(['Wales']);
				examTimetablePage.clickLinkByText('Examination timetable');
				examTimetablePage.deleteAllExaminationTimetableItems();
				examTimetablePage.clickButtonByText('Create timetable item');
			}
		});

		it('Welsh fields are present on the examination timetable item', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');
				examTimetablePage.openExaminationTimetableItemAccordion(options.itemName);
				examTimetablePage.checkAnswer('Item name in Welsh', '');
				examTimetablePage.checkAnswer('Item description in Welsh', '');
			}
		});

		it('Can edit examination timetable item name in welsh and it is validated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				examTimetablePage.openExaminationTimetableItemAccordion(options.itemName);
				examTimetablePage.clickChangeLink('Item name in Welsh');
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage('Enter item name in Welsh');

				examTimetablePage.fillInput('Name that is too long'.repeat(10));
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateErrorMessage('Item name in Welsh must be 200 characters or less');

				examTimetablePage.fillInput('Valid welsh name');
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateBannerMessage('Item name in Welsh updated');
			}
		});

		it('Can edit examination timetable item description in welsh and it is validated', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
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
				examTimetablePage.validateBannerMessage('Item description in Welsh updated');
			}
		});

		it('Publishing fails when Item name in welsh is missing', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				examTimetablePage.clickButtonByText('Preview and publish');
				examTimetablePage.clickButtonByText('Publish examination timetable');
				casePage.validateErrorMessageIsInSummary(
					`Enter examination timetable item name in welsh - ${options.itemName}`
				);
			}
		});

		it('Publishing succeeds when Item name in welsh is present', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				const options = timetableItem();
				examTimetablePage.selectTimetableItem('Deadline');
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.fillItemDetailsStartAndEnd(options);
				examTimetablePage.clickButtonByText('Continue');
				examTimetablePage.clickButtonByText('Save item');
				examTimetablePage.clickLinkByText('Go back to examination timetable');

				examTimetablePage.openExaminationTimetableItemAccordion(options.itemName);
				examTimetablePage.clickChangeLink('Item name in Welsh');
				examTimetablePage.fillInput('Valid welsh name');
				examTimetablePage.clickSaveAndReturn();
				examTimetablePage.validateBannerMessage('Item name in Welsh updated');

				examTimetablePage.clickButtonByText('Preview and publish');
				examTimetablePage.clickButtonByText('Publish examination timetable');
				examTimetablePage.validateSuccessPanelTitle('Timetable item successfully published');
			}
		});
	});
});

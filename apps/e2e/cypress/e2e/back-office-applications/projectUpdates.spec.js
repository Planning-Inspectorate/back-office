// @ts-nocheck

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { ProjectUpdatesPage } from '../../page_objects/projectUpdatesPage';
import {
	updateProjectDescriptionInWelsh,
	updateProjectLocationInWelsh,
	updateProjectNameInWelsh,
	updateProjectRegions
} from '../../support/utils/utils';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const projectUpdatesPage = new ProjectUpdatesPage();
const { applications: applicationUsers } = users;

describe('Project Updates', () => {
	let projectInfo;
	const invalidEnglishContent = 'E'.repeat(11);
	const validEnglishContent = 'E'.repeat(12);
	const invalidWelshContent = 'W'.repeat(11);
	const validWelshContent = 'W'.repeat(12);

	before(() => {
		projectInfo = projectInformation({ excludeWales: true });
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	describe('English project update', () => {
		const invalidEnglishContent = 'E'.repeat(11);
		const validEnglishContent = 'E'.repeat(12);
		const updatedEnglishContent = 'X'.repeat(12);

		beforeEach(() => {
			applicationsHomePage.loadCurrentCase();
			searchResultsPage.clickLinkByText('Project updates');
		});

		it('As a user able to validate and enter a draft english project update', () => {
			projectUpdatesPage.clickButtonByText('Create a project update');

			// Test no english content
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.validateErrorMessageIsInSummary('Enter details about the update');

			// Test english content only 11 characters
			projectUpdatesPage.fillEnglishContent(invalidEnglishContent);
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.validateErrorMessageIsInSummary(
				'Details about the update must be 12 characters or more'
			);

			// Test english content valid
			projectUpdatesPage.fillEnglishContent(validEnglishContent);
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			cy.contains('Create your project update');

			// Save project update
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectUpdatesPage.checkAnswer('Details about the update', validEnglishContent);
				projectUpdatesPage.clickButtonByText('Save project update');
			} else {
				projectUpdatesPage.checkAnswer('English', validEnglishContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
			}

			projectUpdatesPage.validateBannerMessage('Project update saved');

			// Verify saved
			projectUpdatesPage.verifyTableCellText({
				rowIndex: 0,
				cellIndex: 1,
				textToMatch: validEnglishContent,
				strict: true
			});
		});

		it('As a user able to review and update a draft english project update', () => {
			projectUpdatesPage.clickReviewLink(validEnglishContent);
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectUpdatesPage.clickChangeLink('Details about the update');
			} else {
				projectUpdatesPage.clickChangeLink('Content');
			}

			// Update and save
			projectUpdatesPage.fillEnglishContent(updatedEnglishContent);
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			cy.contains('Create your project update');

			// Save project update
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectUpdatesPage.checkAnswer('Details about the update', updatedEnglishContent);
				projectUpdatesPage.clickButtonByText('Save project update');
			} else {
				projectUpdatesPage.checkAnswer('English', updatedEnglishContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
			}

			projectUpdatesPage.validateBannerMessage('Project update saved');

			// Verify saved
			projectUpdatesPage.verifyTableCellText({
				rowIndex: 0,
				cellIndex: 1,
				textToMatch: updatedEnglishContent,
				strict: true
			});
		});

		it('As a user able to delete a draft english project update', () => {
			projectUpdatesPage.clickReviewLink(updatedEnglishContent);
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				projectUpdatesPage.clickLinkByText('Delete');
			} else {
				projectUpdatesPage.clickButtonByText('Delete');
			}

			cy.contains('Delete project update');
			cy.contains(updatedEnglishContent);
			projectUpdatesPage.clickButtonByText('Confirm delete');
		});
	});

	describe('Welsh project update', () => {
		const validEnglishContent = 'U'.repeat(12);
		const invalidWelshContent = 'W'.repeat(11);
		const validWelshContent = 'W'.repeat(12);
		const updatedWelshContent = 'Z'.repeat(12);

		it('As a user able to validate and enter a welsh project update', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();

				// Make the case Welsh
				updateProjectRegions([...projectInfo.regions, 'Wales']);
				updateProjectNameInWelsh(projectInfo.projectNameInWelsh);
				updateProjectDescriptionInWelsh(projectInfo.projectDescriptionInWelsh);
				updateProjectLocationInWelsh(projectInfo.projectLocationInWelsh);

				searchResultsPage.clickLinkByText('Project updates');
				projectUpdatesPage.clickButtonByText('Create a project update');

				// Test no welsh content
				projectUpdatesPage.fillEnglishContent(validEnglishContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.validateErrorMessageIsInSummary(
					'Enter details about the update in Welsh'
				);

				// Test welsh content only 11 characters
				projectUpdatesPage.fillWelshContent(invalidWelshContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.validateErrorMessageIsInSummary(
					'Details about the update in Welsh must be 12 characters or more'
				);

				// Test welsh content valid
				projectUpdatesPage.fillWelshContent(validWelshContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.clickButtonByText('Save and continue');
				cy.contains('Create your project update');
				projectUpdatesPage.checkAnswer('Details about the update in Welsh', validWelshContent);

				// Save project update
				projectUpdatesPage.clickButtonByText('Save project update');

				// Verify saved
				projectUpdatesPage.validateBannerMessage('Project update saved');
				projectUpdatesPage.verifyTableCellText({
					rowIndex: 0,
					cellIndex: 1,
					textToMatch: validEnglishContent,
					strict: true
				});
			}
		});

		it('As a user able to review and update an welsh project update', () => {
			if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
				applicationsHomePage.loadCurrentCase();
				searchResultsPage.clickLinkByText('Project updates');

				projectUpdatesPage.clickReviewLink(validEnglishContent);
				projectUpdatesPage.clickChangeLink('Details about the update in Welsh');

				// Update and save
				projectUpdatesPage.fillWelshContent(updatedWelshContent);
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.clickButtonByText('Save and continue');
				projectUpdatesPage.clickButtonByText('Save and continue');
				cy.contains('Create your project update');
				projectUpdatesPage.checkAnswer('Details about the update in Welsh', updatedWelshContent);

				// Save project update
				projectUpdatesPage.clickButtonByText('Save project update');

				// Verify saved
				projectUpdatesPage.validateBannerMessage('Project update saved');
				projectUpdatesPage.verifyTableCellText({
					rowIndex: 0,
					cellIndex: 1,
					textToMatch: validEnglishContent,
					strict: true
				});
			}
		});
	});
});

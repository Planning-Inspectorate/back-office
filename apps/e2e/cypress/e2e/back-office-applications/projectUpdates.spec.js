// @ts-nocheck
/// <reference types="cypress"/>
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

	before(() => {
		projectInfo = projectInformation({ excludeWales: true });
		cy.login(applicationUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	it('As a user able to validate and enter an english project update', () => {
		cy.login(applicationUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project updates');
		projectUpdatesPage.clickButtonByText('Create a project update');

		// Test no english content
		projectUpdatesPage.clickButtonByText('Save and continue');
		projectUpdatesPage.validateErrorMessageIsInSummary('Enter details about the update');

		// Test english content only 12 characters
		projectUpdatesPage.fillEnglishContent('E'.repeat(12));
		projectUpdatesPage.clickButtonByText('Save and continue');
		projectUpdatesPage.validateErrorMessageIsInSummary(
			'Details about the update must be 12 characters or more'
		);

		// Test english content valid
		projectUpdatesPage.fillEnglishContent('E'.repeat(13));
		projectUpdatesPage.clickButtonByText('Save and continue');
		projectUpdatesPage.clickButtonByText('Save and continue');
		projectUpdatesPage.clickButtonByText('Save and continue');
		cy.contains('Check your project update');
	});

	it('As a user able to validate and enter a welsh project update', () => {
		if (Cypress.env('featureFlags')['applic-55-welsh-translation']) {
			cy.login(applicationUsers.caseAdmin);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();

			// Make the case Welsh
			updateProjectRegions([...projectInfo.regions, 'Wales']);
			updateProjectNameInWelsh(projectInfo.projectNameInWelsh);
			updateProjectDescriptionInWelsh(projectInfo.projectDescriptionInWelsh);
			updateProjectLocationInWelsh(projectInfo.projectLocationInWelsh);

			searchResultsPage.clickLinkByText('Project updates');
			projectUpdatesPage.clickButtonByText('Create a project update');

			// Test no welsh content
			projectUpdatesPage.fillEnglishContent('E'.repeat(13));
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.validateErrorMessageIsInSummary('Enter details about the update in Welsh');

			// Test welsh content only 12 characters
			projectUpdatesPage.fillWelshContent('W'.repeat(12));
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.validateErrorMessageIsInSummary(
				'Details about the update in Welsh must be 12 characters or more'
			);

			// Test welsh content valid
			projectUpdatesPage.fillWelshContent('W'.repeat(13));
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			projectUpdatesPage.clickButtonByText('Save and continue');
			cy.contains('Check your project update');
		}
	});
});

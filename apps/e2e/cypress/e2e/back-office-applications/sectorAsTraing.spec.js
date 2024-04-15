// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { validateSectorSubsectorValues } from '../../support/utils/utils.js';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();
const projectInfo = projectInformation();
const { applications: applicationsUsers } = users;

describe('Create Case with sector as training', () => {
	it('As a user able to create case with sector and sub-sector as training', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		createCasePage.clickButtonByText('Create case');
		createCasePage.sections.nameAndDescription.fillCaseName(projectInfo.projectName);
		createCasePage.sections.nameAndDescription.fillCaseDescription(projectInfo.projectDescription);
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.sector.selectTrainingAsSectorSubsector();

		createCasePage.sections.geographicalInformation.fillLocation(projectInfo.projectLocation);
		createCasePage.sections.geographicalInformation.fillEastingGridRef(projectInfo.gridRefEasting);
		createCasePage.sections.geographicalInformation.fillNorthingGridRef(
			projectInfo.gridRefNorthing
		);
		createCasePage.clickSaveAndContinue();
		createCasePage.sections.regions.chooseRegions(projectInfo.regions);
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickSaveAndContinue();
		createCasePage.clickButtonByText('I accept - confirm creation of a new case');
		createCasePage.sections.caseCreated.validateCaseCreated();
	});
	it('As a user able to verify the sector and sub sector names', () => {
		cy.login(applicationsUsers.caseAdmin);
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		validateSectorSubsectorValues();
	});
});

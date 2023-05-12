// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import {
	updateProjectInformation,
	validateProjectInformation,
	validateSummaryPageInfo
} from '../../support/utils/utils';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CasePage } from '../../page_objects/casePage';

const applicationsHomePage = new ApplicationsHomePage();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();

describe('Update Project Information', () => {
	context('As Inspector', () => {
		let projectInfo = projectInformation();

		before(() => {
			cy.login(users.caseAdmin);
			createCasePage.createCase(projectInfo);
		});

		it('Should not be able to update the case information', () => {
			cy.login(users.inspector);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateSummaryPageInfo(projectInfo, 'complete');
			searchResultsPage.clickLinkByText('Project information');
			searchResultsPage.clickAccordionByText('Show all sections');
			validateProjectInformation('Project information', projectInfo, 'complete');
			casePage.validateUserIsUnableToEdit();
		});
	});

	context('As Case Team', () => {
		let projectInfo = projectInformation();
		let projectInfoNew = projectInformation();

		before(() => {
			cy.login(users.caseTeam);
			createCasePage.createCase(projectInfo, true);
		});

		it('Should be able to update the case information', () => {
			cy.login(users.caseTeam);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateSummaryPageInfo(projectInfo, 'mandatory');
			searchResultsPage.clickLinkByText('Update project information');
			searchResultsPage.clickAccordionByText('Show all sections');
			validateProjectInformation('Project information', projectInfo, 'mandatory');
			updateProjectInformation(projectInfoNew);
			validateProjectInformation('Project information', projectInfoNew, 'complete', true);
			searchResultsPage.clickLinkByText('Preview and publish project');
			validateProjectInformation('Preview and publish', projectInfoNew, 'complete', true);
			searchResultsPage.clickButtonByText('Accept and publish project');
			searchResultsPage.validateBannerMessage('Project page published');
		});
	});

	context('As Case Team Admin', () => {
		let projectInfo = projectInformation();
		let projectInfoNew = projectInformation();

		before(() => {
			cy.login(users.caseAdmin);
			createCasePage.createCase(projectInfo, true);
		});

		it('Should be able to update the case information', () => {
			cy.login(users.caseAdmin);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateSummaryPageInfo(projectInfo, 'mandatory');
			searchResultsPage.clickLinkByText('Update project information');
			searchResultsPage.clickAccordionByText('Show all sections');
			validateProjectInformation('Project information', projectInfo, 'mandatory');
			updateProjectInformation(projectInfoNew);
			validateProjectInformation('Project information', projectInfoNew, 'complete', true);
			searchResultsPage.clickLinkByText('Preview and publish project');
			validateProjectInformation('Preview and publish', projectInfoNew, 'complete', true);
			searchResultsPage.clickButtonByText('Accept and publish project');
			searchResultsPage.validateBannerMessage('Project page published');
		});
	});
});

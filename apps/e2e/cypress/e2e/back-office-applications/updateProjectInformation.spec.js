// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import {
	updateProjectInformation,
	validateProjectInformation,
	validateProjectOverview,
	validatePreviewAndPublishInfo
} from '../../support/utils/utils';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CasePage } from '../../page_objects/casePage';

const applicationsHomePage = new ApplicationsHomePage();
const casePage = new CasePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const { applications: applicationsUsers } = users;

describe('Update Project Information', () => {
	context('As Inspector', () => {
		let projectInfo = projectInformation();

		before(() => {
			cy.login(applicationsUsers.caseAdmin);
			createCasePage.createCase(projectInfo);
		});

		it('Should not be able to update the case information', () => {
			cy.login(applicationsUsers.inspector);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateProjectOverview(projectInfo);
			searchResultsPage.clickLinkByText('Project information');
			validateProjectInformation(projectInfo);
			casePage.validateUserIsUnableToEdit();
		});
	});

	context('As Case Team', () => {
		let projectInfo = projectInformation();
		let projectInfoNew = projectInformation();

		before(() => {
			cy.login(applicationsUsers.caseTeam);
			createCasePage.createCase(projectInfo, true);
		});

		it('Should be able to update the case information', () => {
			cy.login(applicationsUsers.caseTeam);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateProjectOverview(projectInfo, true);
			casePage.clickLinkByText('Update project information');
			casePage.showAllSections();
			validateProjectInformation(projectInfo, true);
			updateProjectInformation(projectInfoNew);
			validateProjectInformation(projectInfoNew, false, true);
			casePage.clickLinkByText('Overview');
			casePage.clickButtonByText('Preview and publish project');
			validatePreviewAndPublishInfo(projectInfoNew);
			casePage.clickButtonByText('Accept and publish project');
			casePage.validatePublishBannerMessage('Project page successfully published');

		});
	});

	context('As Case Team Admin', () => {
		let projectInfo = projectInformation();
		let projectInfoNew = projectInformation();

		before(() => {
			cy.login(applicationsUsers.caseAdmin);
			createCasePage.createCase(projectInfo, true);
		});

		it('Should be able to update the case information', () => {
			cy.login(applicationsUsers.caseAdmin);
			cy.visit('/');
			const caseRef = Cypress.env('currentCreatedCase');
			applicationsHomePage.searchFor(caseRef);
			searchResultsPage.clickTopSearchResult();
			validateProjectOverview(projectInfo, true);
			casePage.clickLinkByText('Update project information');
			casePage.showAllSections();
			validateProjectInformation(projectInfo, true);
			updateProjectInformation(projectInfoNew);
			validateProjectInformation(projectInfoNew, false, true);
			casePage.clickLinkByText('Overview');
			casePage.clickButtonByText('Preview and publish project');
			validatePreviewAndPublishInfo(projectInfoNew);
			casePage.clickButtonByText('Accept and publish project');
			casePage.validatePublishBannerMessage('Project page successfully published');

		});
	});
});

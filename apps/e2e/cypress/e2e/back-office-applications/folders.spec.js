// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { FileUploadPage } from '../../page_objects/uploadFiles';
import { Page } from '../../page_objects/basePage';
import { projectInformation } from '../../support/utils/createProjectInformation';
import { CreateCasePage } from '../../page_objects/createCasePage';

const { applications: applicationsUsers } = users;
const applicationsHomePage = new ApplicationsHomePage();
const createCasePage = new CreateCasePage();
const searchResultsPage = new SearchResultsPage();
const fileUploadPage = new FileUploadPage();
const page = new Page();

describe('Folders', () => {
	let projectInfo;

	before(() => {
		projectInfo = projectInformation();
		cy.login(applicationsUsers.caseAdmin);
		createCasePage.createCase(projectInfo);
	});

	beforeEach(() => {
		cy.visit('/');
		const caseRef = Cypress.env('currentCreatedCase');
		applicationsHomePage.searchFor(caseRef);
		searchResultsPage.clickTopSearchResult();
		searchResultsPage.clickLinkByText('Project documentation');
		searchResultsPage.clickLinkByText('Project management');
	});

	it('Should be able to create a subfolder of one of the hardcoded folders', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		fileUploadPage.showSubfolders();
		fileUploadPage.createFolder();

		const folderName = 'Test folder 1';

		page.fillInput(folderName);
		page.clickButtonByText('Save and return');

		fileUploadPage.verifyTableContains(folderName);
	});

	it('Should be able to create a subfolder of a subfolder', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		fileUploadPage.showSubfolders();
		fileUploadPage.clickFolder('Logistics');
		fileUploadPage.createFolder();

		const folderName = 'Test folder 2';

		page.fillInput(folderName);
		page.clickButtonByText('Save and return');

		fileUploadPage.verifyTableContains(folderName);
	});

	it('Should be able to rename a custom folder', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		fileUploadPage.showSubfolders();
		fileUploadPage.createFolder();

		const folderName = 'Folder to rename 1';
		page.fillInput(folderName);
		page.clickButtonByText('Save and return');

		fileUploadPage.clickFolder(folderName);
		fileUploadPage.renameFolder();

		const updatedFolderName = 'Folder to rename 1 - updated';
		page.fillInput(updatedFolderName);
		page.clickButtonByText('Save and return');

		fileUploadPage.verifyFolderTitle(updatedFolderName);
	});

	it('Should not be able to rename a non-custom folder', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		page.basePageElements.linkByText('Rename folder').should('not.exist');
	});

	it('Should be able to delete a custom folder', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		fileUploadPage.showSubfolders();
		fileUploadPage.createFolder();

		const folderName = 'Folder to delete 1';
		page.fillInput(folderName);
		page.clickButtonByText('Save and return');
		fileUploadPage.verifyTableContains(folderName);

		fileUploadPage.clickFolder(folderName);
		fileUploadPage.deleteFolder();
		page.clickButtonByText('Delete folder');

		fileUploadPage.verifyFolderTitle('Project management');
		fileUploadPage.verifyTableDoesNotContain(folderName);
	});

	it('Should not be able to delete a non-custom folder', () => {
		if (!Cypress.env('featureFlags')['applic-625-custom-folders']) {
			return;
		}

		page.basePageElements.linkByText('Delete folder').should('not.exist');
	});
});

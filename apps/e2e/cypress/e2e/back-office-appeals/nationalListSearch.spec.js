// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';
import { projectInformation } from '../../support/utils/createProjectInformation';

const page = new AppealsListPage();
describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.appeals.caseAdmin);
	});

	it('Case admin user should be able to use search using appeal id', () => {
		cy.visit('/appeals-service/appeals-list');
		page.fillInput('92623353');
		page.clickButtonByText('Search');
		page.clearSearchResults();
	});

	it('Case admin user should be able to use search using postcode with spaces', () => {
		cy.visit('/appeals-service/appeals-list');
		page.fillInput('BS7 8LQ');
		page.clickButtonByText('Search');
		page.clearSearchResults();
	});

	it('Case admin user should see error validation if not enough characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.fillInput('9');
		page.clickButtonByText('Search');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});

	it('Case admin user should see error validation if too many characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.fillInput('999999999');
		page.clickButtonByText('Search');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});
});

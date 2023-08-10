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
		page.nationalListSearch('92623353');
		page.clearSearchResults();
	});

	it('Case admin user should be able to use search using postcode with spaces', () => {
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch('BS7 8LQ');
		page.clearSearchResults();
	});

	it('Case admin user should see error validation if not enough characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch('9');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});

	it('Case admin user should see error validation if too many characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch('999999999');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});
});

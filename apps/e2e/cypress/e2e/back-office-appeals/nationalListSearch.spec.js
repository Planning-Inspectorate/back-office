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

	it('Case admin user should be able to view Search all cases page', () => {
		cy.visit('/appeals-service/appeals-list');

		page.verifySectionHeader('Search all cases');
	});

	it.skip('Case admin user should be able to use search using appeal id', () => {
		const id = '6001030';
		const testData = { rowIndex: 0, cellIndex: 0, textToMatch: id, strict: true };
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch(id);
		page.verifyTableCellText(testData);

		page.clearSearchResults();
	});

	it.skip('Case admin user should be able to use search using postcode with spaces', () => {
		const postcode = 'MD21 5XY';
		const testData = { rowIndex: 0, cellIndex: 1, textToMatch: postcode, strict: false };
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch(postcode);
		page.verifyTableCellText(testData);
		page.clearSearchResults();
	});

	it.skip('Case admin user should see error validation if not enough characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch('9');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});

	it.skip('Case admin user should see error validation if too many characters are entered', () => {
		cy.visit('/appeals-service/appeals-list');
		page.nationalListSearch('999999999');
		page.validateErrorMessage('Search query must be between 2 and 8 characters');
	});
});

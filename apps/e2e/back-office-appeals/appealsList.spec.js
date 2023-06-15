// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { AppealsListPage } from '../../page_objects/appealsListPage';

const page = new AppealsListPage();
describe('Appeals feature', () => {
	beforeEach(() => {
		cy.login(users.inspector);
		page.verifyInspectorIsSignedIn();
	});

	it('Test 1', () => {
		cy.visit('/');
		page.clickMyUniqueElement();
		/// Other steps
	});
});

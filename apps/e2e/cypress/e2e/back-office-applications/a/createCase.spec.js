// @ts-nocheck
/// <reference types="cypress"/>

import { ApplicationsHomePage } from '../../..//page_objects/applicationsHomePage';
import { users } from '../../../fixtures/users';

const applicationsHomePage = new ApplicationsHomePage();

describe('Create A Case', () => {
	context('As Inspector', () => {
		beforeEach(() => {
			cy.clearAllCookies();
			cy.login(users.inspector);
		});

		it('Should not be able to create a case - button is not available', () => {
			cy.visit('/');
			applicationsHomePage.verifyInspectorIsSignedIn();
			applicationsHomePage.verifyCreateCaseIsNotAvailable();
		});

		it('Should not be able to create a case - cannot navigate to URL', () => {
			cy.visit('/');
			cy.visit('/applications-service/create-new-case', {
				failOnStatusCode: false
			});
			cy.contains('You are not permitted to access this URL.').should('exist');
		});
	});
});

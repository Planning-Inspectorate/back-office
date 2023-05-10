// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../fixtures/users';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../page_objects/createCasePage';
import { faker } from '@faker-js/faker';
import { projectInformation } from '../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();

describe('Create A Case', () => {
	context('As Inspector', () => {
		beforeEach(() => {
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

	context('As a Case Team Admin User', () => {
		it('Should successfully create a case as an admin', () => {
			cy.clearAllCookies();
			cy.login(users.caseAdmin);
			cy.visit('/');
			createCasePage.verifyCaseAdminIsSignedIn();
			const projectInfo = projectInformation();
			createCasePage.createCase(projectInfo);
		});
	});

	context('As a Case Team User', () => {
		it('Should successfully create a case when the logged in user is a case team user', () => {
			cy.clearAllCookies();
			cy.login(users.caseTeam);
			cy.visit('/');
			createCasePage.verifyCaseTeamIsSignedIn();
			const projectInfo = projectInformation();
			createCasePage.createCase(projectInfo);
		});
	});
});

// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../../fixtures/users';
import { CreateCasePage } from '../../../page_objects/createCasePage';
import { projectInformation } from '../../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();

describe('Create A Case', () => {
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
});

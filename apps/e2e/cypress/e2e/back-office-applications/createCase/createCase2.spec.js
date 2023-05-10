// @ts-nocheck
/// <reference types="cypress"/>

import { users } from '../../../fixtures/users';
import { ApplicationsHomePage } from '../../../page_objects/applicationsHomePage';
import { CreateCasePage } from '../../../page_objects/createCasePage';
import { projectInformation } from '../../../support/utils/createProjectInformation';

const createCasePage = new CreateCasePage();
const applicationsHomePage = new ApplicationsHomePage();

describe('Create A Case', () => {
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

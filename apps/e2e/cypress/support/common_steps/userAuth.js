// @ts-nocheck
/// <reference types="cypress"/>
import { Before, Then } from '@badeball/cypress-cucumber-preprocessor';
import { users } from '../../fixtures/users';
import '../commands';
import { Page } from '../../page_objects/basePage';

const page = new Page();

// H O O K S

after(() => {
	cy.task('ClearAllCookies');
});

beforeEach(() => {
	cy.clearLocalStorage();
	cy.clearCookies();
});

Before({ tags: '@CaseTeam' }, () => {
	cy.login(users.caseTeam);
});

Before({ tags: '@CaseAdmin' }, () => {
	cy.login(users.caseAdmin);
});

Before({ tags: '@Inspector' }, () => {
	cy.login(users.inspector);
});

// A S S E R T I O N S

Then('the logged in user should be an Inspector', function () {
	page.verifyInspectorIsSignedIn();
});

Then('the logged in user should be a Case Team user', function () {
	page.verifyCaseTeamIsSignedIn();
});

Then('the logged in user should be a Case Admin', function () {
	page.verifyCaseAdminIsSignedIn();
});

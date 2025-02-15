// @ts-nocheck
/// <reference types="cypress"/>

// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { users } from '../fixtures/users';
import { loadFlags } from '../fixtures/feature-flags';
import './commands';
import { isCI } from './utils/isCI';

before(async () => {
	Cypress.env('featureFlags', await loadFlags());
});

before(() => {
	const featureFlags = Cypress.env('featureFlags');
	if (featureFlags) {
		cy.task('LogToTerminal', '  Feature flags: ');
		Object.entries(featureFlags).forEach(([flag, value]) => {
			cy.task('LogToTerminal', `    ${flag.padEnd(35, ' ')}${value ? 'ON ' : 'OFF'}`);
		});
		cy.task('LogToTerminal', '');
	}
});

after(() => {
	cy.deleteUnwantedFixtures();
});

after(() => {
	//cy.clearAllSessionStorage();
	//cy.clearCookies();
});
Cypress.on('uncaught:exception', (err, runnable) => {
	return false;
});

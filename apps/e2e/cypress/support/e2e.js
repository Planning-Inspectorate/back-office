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
import './commands';
import { isCI } from './utils/isCI';

after(() => {
	cy.deleteUnwantedFixtures();
});

beforeEach(() => {
	cy.on('window:before:load', (win) => {
		win.sessionStorage.clear();
		const cookies = win.document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			let cookie = cookies[i];
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
			win.document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
		}
	});
});

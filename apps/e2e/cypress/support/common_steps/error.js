// @ts-nocheck
/// <reference types="cypress"/>
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

Then(/^the user should see (\d+) error (message|messages)$/, function (length) {
	page.basePageElements.errorMessage().should('have.length', length);
});

Then('the user should see the {string} error message', function (errorMessage) {
	page.validateErrorMessage(errorMessage);
});

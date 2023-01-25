// @ts-nocheck
/// <reference types="cypress"/>

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

// U S E R  A C T I O N S

Given('the user visits the home page', function () {
	cy.visit('/');
});

When('the user navigates to the create a new case page', function () {
	cy.visit('/applications-service/create-new-case', {
		failOnStatusCode: false
	});
});

When('the user validates previous page', function () {
	cy.get('.govuk-back-link').click();
	cy.contains('button', 'Save and continue').click();
});

When("the user enters the applicant's postcode as {string}", function (postcode) {
	cy.get('#postcode').type(postcode);
});

// @ts-nocheck
/// <reference types="cypress"/>

import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';
import { CreateCasePage } from '../../page_objects/createCasePage';

const page = new Page();
const createCasePage = new CreateCasePage();

// U S E R  A C T I O N S

Given(/^the user visits the home page$/, function () {
	cy.visit('/');
});

Given(/^the user goes to the dashboard$/, function () {
	page.clickLinkByText('Go to Dashboard');
});

When(/^the user navigates to the create a new case page$/, function () {
	cy.visit('/applications-service/create-new-case', {
		failOnStatusCode: false
	});
});

When(/^the user validates previous page$/, function () {
	page.basePageElements.backLink().click();
	page.clickSaveAndContinue();
});

When(/^the user enters the applicant's postcode as "([^"]*)"$/, function (postcode) {
	createCasePage.sections.applicantAddress.fillApplicantPostcode(postcode);
});

When(/^the user refreshes the page$/, function () {
	cy.reload();
});

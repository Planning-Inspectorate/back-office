// @ts-nocheck
/// <reference types="cypress"/>

import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

// U S E R  A C T I O N S
When(/^the user clicks the "([^"]*)" button$/, function (buttonText) {
	page.clickButtonByText(buttonText);
});

Then(/^the user should not see the "([^"]*)" button$/, function (buttonText) {
	page.basePageElements.buttonByLabelText(buttonText).should('not.exist');
});

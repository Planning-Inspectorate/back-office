// @ts-nocheck
/// <reference types="cypress"/>

import { When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

// U S E R  A C T I O N S
When(/^the user clicks the "([^"]*)" accordion$/, function (accordionText) {
	page.clickAccordionByText(accordionText);
});

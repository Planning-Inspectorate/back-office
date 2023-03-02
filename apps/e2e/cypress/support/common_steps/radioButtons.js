// @ts-nocheck
/// <reference types="cypress"/>

import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

// U S E R  A C T I O N S

When('the user chooses option {int} radio button', function (optionNumber) {
	page.chooseRadioBtnByIndex(optionNumber - 1);
});

// A S S E R T I O N S

Then('the user should see {int} radio options to choose on the page', function (radiosCount) {
	page.validateNumberOfRadioBtn(radiosCount);
});

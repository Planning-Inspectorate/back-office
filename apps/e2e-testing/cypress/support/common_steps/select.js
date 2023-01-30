// @ts-nocheck
/// <reference types="cypress"/>

import { When } from '@badeball/cypress-cucumber-preprocessor';
import { Page } from '../../page_objects/basePage';
import '../commands';

const page = new Page();

// U S E R  A C T I O N S
When('the user selects option {int} from the {string} list', function (optionNumber) {
	page.chooseSelectItemByIndex(optionNumber);
});

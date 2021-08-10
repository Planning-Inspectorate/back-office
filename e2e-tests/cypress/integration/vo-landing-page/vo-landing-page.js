import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {decisionDatePage, houseHolderPage, yesRadioBtn} from '../../support/PageObjects/vo-landing-page-po'


Given('Householder planning permission is requested', () => {
    houseHolderPage();
    cy.checkPageA11y();
});

When('user selects yes option', () => {
    //yesRadioBtn();
});

Then('Decision date page is presented and page title is verified', () => {
    //decisionDatePage();
    cy.checkPageA11y();
});


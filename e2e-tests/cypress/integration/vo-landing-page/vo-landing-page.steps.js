import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {decisionDatePage, yesRadioBtn} from '../../support/PageObjects/vo-landing-page-po'



Given('Householder planning permission is requested', () => {
cy.visit("http://localhost:9003/eligibility/householder-planning-permission");
});

When('user selects yes option', () => {
    yesRadioBtn();
});

Then('Decision date page is presented and page title is verified', () => {
    decisionDatePage();
});


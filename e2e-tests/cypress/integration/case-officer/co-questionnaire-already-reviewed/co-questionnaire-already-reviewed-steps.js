import {Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import {verifyPageUrl} from "../../../support/common/verify-page-url";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {returnToAppealSubmission} from "../../../support/PageObjects/co-questionnaire-already-reviewed-po";
const pageUrl = '/questionnaires-for-review/already-reviewed/1';
const pageTitle = 'Questionnaire already reviewed - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Questionnaire already reviewed';
Given('a case officer is reviewing a questionnaire',()=>{
    cy.visit(pageUrl);
});
When('the questionnaire review outcome is set as complete or incomplete',()=>{});
Then('the Questionnaire already reviewed page is displayed',()=>{
    verifyPageUrl(pageUrl);
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
});
Given('the case officer has navigated to questionnaire already reviewed page',()=>{
    cy.visit(pageUrl);
    verifyPageUrl(pageUrl);
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
});
When('case officer selects return to questionnaires for review link',()=>{
    returnToAppealSubmission().click();
});
Then('the questionnaires for review page is displayed',()=>{
    verifyPageUrl('questionnaires-list');
    verifyPageTitle('Questionnaires for review - Appeal a householder planning decision - GOV.UK');
    verifyPageHeading('Questionnaires for review');
})
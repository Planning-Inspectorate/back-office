import {Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAppealReference,
    getAppealSite,
    getConfirmContinueButton,
    getGoBackToReviewQuestionnaireLink,
    getLocalPlanningDepartment,
    getReviewOutcome,
    getSectionHeading
} from "../../../support/PageObjects/co-check-and-confirm-po";
import {verifySectionName} from "../../../support/case-officer/verify-Section-Name";
const completeStatusUrl = '/planning-inspectorate/appeals/questionnaires-for-review/check-and-confirm/1';
Given('a Case Officer selects continue on the review questionnaire page',()=>{
    cy.visit(completeStatusUrl);
    cy.checkPageA11y();
});
When('the questionnaire review is {string}',(questionnaireReviewStatus)=>{
    verifySectionName('Check and confirm');
});
Then('the {string} page is displayed showing the questionnaire as {string}',(page,questionnaireReviewStatus)=>{
verifySectionName(page);
getReviewOutcome().siblings().should('contain',questionnaireReviewStatus);
    getAppealReference().should('be.visible');
    getAppealSite().should('be.visible');
    getLocalPlanningDepartment().should('be.visible');
    getConfirmContinueButton().should('have.class','govuk-button');
    getGoBackToReviewQuestionnaireLink().should('have.attr','href');
});

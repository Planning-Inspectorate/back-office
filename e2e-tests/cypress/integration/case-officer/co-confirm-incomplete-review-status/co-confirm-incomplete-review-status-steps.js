import {Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAppealReference,
    getAppealSite,
    getConfirmContinueButton,
    getGoBackToReviewQuestionnaireLink,
    getLocalPlanningDepartment, getMissingOrIncorrectDocuments,
    getReviewOutcome,
    getSectionHeading
} from "../../../support/PageObjects/co-check-and-confirm-po";
import {verifySectionName} from "../../../support/case-officer/verify-Section-Name";
const incompleteStatusUrl = '/planning-inspectorate/appeals/questionnaires-for-review/check-and-confirm/2';
Given('a Case Officer selects continue on the review questionnaire page',()=>{
    cy.visit(incompleteStatusUrl);
    cy.checkPageA11y();
});
When('the questionnaire review is {string}',(questionnaireReviewStatus)=>{
    verifySectionName('Check and confirm');
});
Then('the {string} page is displayed showing the questionnaire as {string}',(page,questionnaireReviewStatus)=>{
verifySectionName(page);
    getReviewOutcome().siblings().should('contain',questionnaireReviewStatus);
    getMissingOrIncorrectDocuments().should('be.visible');
    getAppealReference().should('be.visible');
    getAppealSite().should('be.visible');
    getLocalPlanningDepartment().should('be.visible');
    getConfirmContinueButton().should('have.class','govuk-button');
    getGoBackToReviewQuestionnaireLink().should('have.attr','href');
});

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import {
    gotoReviewQuestionnaireConfirmationPage,
    questionnaireForReviewLink, reviewQuestionnaireConfirmationPage,
    reviewQuestionnaireListPage
} from "../../../support/PageObjects/co-review-questionnaire-confirmation-po";

Given('the Case Officer is on the Check and Confirm page', () => {
    // Do nothing for now. However write code to get to 'Check and Confirm' page once all the pages are built
});

When('the Review outcome is Complete', () => {
    gotoReviewQuestionnaireConfirmationPage();
});

Then('the Case Officer is presented with the confirmation page', () => {
    reviewQuestionnaireConfirmationPage();
});

Then('the Confirmation page should have link to Questionnaire review page', () => {
    questionnaireForReviewLink()
        .should('have.attr', 'href', '/questionnaires-list');
    cy.checkPageA11y();
});

When('the Case Officer clicks Return to Questionnaire review link', () => {
    questionnaireForReviewLink().click();
});

Then('the Case Officer should be taken to review questionnaire list page', () => {
    reviewQuestionnaireListPage();
});
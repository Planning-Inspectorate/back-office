import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import {
    gotoReviewQuestionnaireConfirmationPage,
    questionnaireForReviewLink,
    verifyPageHeading,
    reviewQuestionnaireListPage
} from "../../../support/PageObjects/co-review-questionnaire-confirmation-po";
import { verifyPageTitle } from "../../../support/common/verify-page-title";
import { verifyPageUrl } from "../../../support/common/verify-page-url";

const page = {
    heading: 'Outcome confirmed',
    title: 'Review complete - Appeal a householder planning decision - GOV.UK',
    url: 'review-questionnaire-complete',
};

Given('the Case Officer is on the Check and Confirm page', () => {
    // Do nothing for now. However write code to get to 'Check and Confirm' page once all the pages are built
});

When('the Review outcome is Complete', () => {
    gotoReviewQuestionnaireConfirmationPage();
});

Then('the Case Officer is presented with the confirmation page', () => {
    verifyPageUrl(page.url);
    verifyPageTitle(page.title);
    verifyPageHeading(page.heading);
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
import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {appealReference, validationOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";
import {
    reviewAppealSubmissionPage, selectOutcomeMissingOrWrong,
    selectOutcomeValid
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {
    confirmFinishReviewButton,
    continueButton,
    linkReturnToTaskList,
    textWhatNext
} from "../../../support/PageObjects/common-po";
import {checkAndConfirmPageValid} from "../../../support/PageObjects/vo-validappeal-description-of-development-po";
import {
    checkboxCompletedTasks,
    checkMissingOrWrongDocuments, checkOtherMissingOrWrong, textboxOtherMissingOrWrong,
    visitCheckConfirmPageMissingWrong
} from "../../../support/PageObjects/vo-missing-or-wrong-check-confirm-page-po";
import {
    textOtherReason, verifyCheckBoxTasksEmails,
    visitMissingOrWrongCheckConfirmPage
} from "../../../support/PageObjects/vo-missing-wrong-check-confirm-page-po";
import {
    textAppealTurnedAway,
    verifyAppealInValid, verifyAppealMissingWrong,
    verifyAppealReference, verifyMissingAppealReference,
    visitPageUrl
} from "../../../support/PageObjects/vo-review-complete-po";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";

const url = '/review-complete';
const pageTitle = 'Review complete - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Review complete';
const missingConfirmPage = () => {
    cy.url().should('contain',url);
}
const goToCheckConfirmPageMissing = () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeMissingOrWrong().click();
    continueButton().click();
    checkOtherMissingOrWrong().check();
    textboxOtherMissingOrWrong().type('Test Data for Other List Reasons in Something missing or wrong page');
    continueButton().click();
    checkboxCompletedTasks().check();
}

Given( "a Validation Officer has confirmed an appeal as 'Something missing or wrong' on the 'Check and confirm' page", () => {
    goToCheckConfirmPageMissing();
} );

When( "the Validation Officer selects 'Confirm and finish review'", () => {
    confirmFinishReviewButton().click();
} );
Then( "the Confirmation Page will be displayed showing 'Something is missing or wrong'", () => {
    missingConfirmPage();
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
    verifyMissingAppealReference().should('exist');
    verifyAppealMissingWrong();
    textWhatNext().should('exist');
    linkReturnToTaskList().should('exist');
} );

Given( "a Validation Officer is on the Review complete page for the outcome 'Something missing or wrong'", () => {
    goToCheckConfirmPageMissing();
    confirmFinishReviewButton().click();
} );
When( 'the Validation Officer selects the Return to task list link', () => {
    linkReturnToTaskList().click();
} );
Then( "the 'Appeal submissions for review' Page will be displayed", () => {
    validationOfficerLandingPage();
} );
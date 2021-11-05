import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {
    invalidAppealDetailsPage, reasonsOutOfTimeCheck,
    selectOutcomeInvalid
} from "../../../support/PageObjects/vo-invalid-appeal-details-po";
import {appealReference, validationOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";
import {reviewAppealSubmissionPage} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {
    confirmTurnAwayButton,
    continueButton,
    linkReturnToTaskList,
    textWhatNext
} from "../../../support/PageObjects/common-po";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {
    textAppealTurnedAway,
    verifyAppealInValid,
    verifyAppealReference,
    visitPageUrl
} from "../../../support/PageObjects/vo-review-complete-po";
import {verifyInvalidCheckAndConfirmPage} from "../../../support/PageObjects/vo-invalid-check-confirm-po";

const verifyCompletePageTitle = 'Review complete - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Review complete';
const InvalidCheckConfirmPage = () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
    reasonsOutOfTimeCheck().check();
    continueButton().click();
    verifyInvalidCheckAndConfirmPage();
}

Given( "the Validation Officer is on the 'Check and confirm' page and has deemed the appeal as 'InValid'", () => {
    InvalidCheckConfirmPage();
} );
When( "the Validation Officer selects 'Confirm and turn away appeal'", () => {
    confirmTurnAwayButton().click();
} );
Then( "the 'Review complete' Page will be displayed showing the validation outcome as 'Appeal invalid' with appeal reference", () => {
    verifyPageTitle(verifyCompletePageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
    verifyAppealReference().should('exist');
    verifyAppealInValid();
    textAppealTurnedAway();
    textWhatNext().should('exist');
    linkReturnToTaskList().should('exist');
} );

Given( "a Validation Officer is on the 'Invalid Review complete' page", () => {
    InvalidCheckConfirmPage();
    confirmTurnAwayButton().click();
} );
When( 'the Validation Officer selects the Return to task list link', () => {
    linkReturnToTaskList().click();
} );
Then( "the 'Appeal submissions for review' Page will be displayed", () => {
    validationOfficerLandingPage();
} );
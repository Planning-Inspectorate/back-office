import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {appealReference, validationOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";
import {reviewAppealSubmissionPage, visitReviewAppealSubmissionPage} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {
    invalidAppealDetailsPage,
    invalidAppealReference,
    invalidPageHeader,
    otherListReasons,
    reasonsAppealInvalid,
    reasonsOther, reasonsOutOfTime,
    selectOutcomeInvalid, reasonsNoRightOfAppeal, reasonsNotAppealable, reasonsLPADeemedApplications,
} from "../../../support/PageObjects/vo-invalid-appeal-details-po";
import {backLink, continueButton} from "../../../support/PageObjects/common-po";
import {validateErrorMessages} from "../../../support/common/validate-error-messages";
import { verifyInvalidCheckAndConfirmPage} from "../../../support/PageObjects/vo-invalid-check-confirm-po";

Given( "the validation Officer has selected outcome as 'Invalid' on the Review appeal submission page", () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    //cy.checkPageA11y();
    selectOutcomeInvalid().click();
});
When( "a Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then( "the ‘Invalid appeal details’ Page will be displayed showing the appeal reference", () => {
    invalidAppealDetailsPage();
    // *** This identified critical issue AS-3610 bug has been raised ***
    //cy.checkPageA11y();
    invalidAppealReference().should('exist');
    invalidPageHeader().should('exist');
    reasonsAppealInvalid().should('exist');
    reasonsOutOfTime().should('exist');
    reasonsNoRightOfAppeal().should('exist');
    reasonsNotAppealable().should('exist');
    reasonsLPADeemedApplications().should('exist');
    reasonsLPADeemedApplications().should('exist');
    reasonsOther();
} );

Given( 'the Validation Officer has not selected a reason on the ‘Invalid appeal details’ Page',  () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
} );
When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then( 'error message {string} will be displayed', (errorMessage) => {
    validateErrorMessages(errorMessage);
} );

Given( "the Validation Officer is on the ‘Invalid appeal details' Page", () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
} );
When( "the Validation Officer selects ‘Other’ as the invalid reason", () => {
    reasonsOther().check();
} );
Then( 'a text box will be displayed below the ‘Other’ option', () => {
    otherListReasons().should('exist');
} );

Given( 'the Validation Officer selects ‘Other’ as the invalid reason but has not provided any text', () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
    reasonsOther().check();
    otherListReasons();
    continueButton();
} );

When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );

Then( "the Review appeal submission Page will be displayed showing the previously selected outcome as 'Invalid'", () => {
    visitReviewAppealSubmissionPage();
    selectOutcomeInvalid();
} );

When( 'provide the Other List reasons', () => {
    otherListReasons().type('This is a Test to List reasons why the appeal is INVALID')
} );

Then( 'the Invalid outcome Check and confirm page is displayed',() => {
    verifyInvalidCheckAndConfirmPage();
} );
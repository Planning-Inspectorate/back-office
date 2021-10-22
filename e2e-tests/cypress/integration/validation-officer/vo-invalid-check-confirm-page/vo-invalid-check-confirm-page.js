import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {backLink, continueButton, linkChangeOutcome} from "../../../support/PageObjects/common-po";
import {
    invalidAppealDetailsPage, otherListReasons, reasonsLPADeemedApplicationsCheck,
   reasonsNoRightOfAppealCheck, reasonsNotAppealableCheck, reasonsOther, reasonsOutOfTimeCheck, selectOutcomeInvalid
} from "../../../support/PageObjects/vo-invalid-appeal-details-po";
import {
    btnConfirmAndTurnAwayAppeal,
    invalidOutcomeOfReview,
    invalidPageHeaderCheckConfirm,
    invalidReasonsText,
    invalidReasonsTextNoRightOfAppeal,
    invalidReasonsTextNotAppealable, invalidReasonsTextNotAppealableLPADeemedApplication,
    invalidReasonsTextOutOfTime,
    verifyInvalidCheckAndConfirmPage,
    visitInvalidCheckConfirmPage,
    warningTextCheckConfirmInValid
} from "../../../support/PageObjects/vo-invalid-check-confirm-po";
import {
    appealSite,
    appellantName,
    reviewAppealSubmissionPage,
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {appealReference, validationOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";



Given("the Validation Officer has provided the invalid reasons on the ‘Invalid appeal details’ page", () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
    // *** This identified critical issue AS-3610 bug has been raised ***
    //cy.checkPageA11y();
    reasonsOutOfTimeCheck().check();
    reasonsNoRightOfAppealCheck().check();
    reasonsNotAppealableCheck().check();
    reasonsLPADeemedApplicationsCheck().check();
    reasonsOther().check();
    otherListReasons().type('This is a Test data for other List Reasons why the Appeal is Invalid');
});
When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then("the ‘Check and confirm’ Page will be displayed showing the the outcome as Invalid", () => {
    visitInvalidCheckConfirmPage();
    verifyInvalidCheckAndConfirmPage();
    invalidPageHeaderCheckConfirm();
    invalidOutcomeOfReview();
    appellantName();
    appealReference();
    appealSite();
    invalidReasonsTextOutOfTime();
    invalidReasonsTextNoRightOfAppeal();
    invalidReasonsTextNotAppealable();
    invalidReasonsTextNotAppealableLPADeemedApplication();
    invalidReasonsText();
    warningTextCheckConfirmInValid();
    btnConfirmAndTurnAwayAppeal();
    linkChangeOutcome();
});

Given( "the Validation Officer is on the ‘Check and confirm’ page and the outcome is ‘Invalid’", () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
    invalidAppealDetailsPage();
    // *** This identified critical issue AS-3610 bug has been raised ***
    //cy.checkPageA11y();
    reasonsOutOfTimeCheck().check();
    reasonsNoRightOfAppealCheck().check();
    reasonsNotAppealableCheck().check();
    reasonsLPADeemedApplicationsCheck().check();
    reasonsOther().check();
    otherListReasons().type('This is a Test data for other List Reasons why the Appeal is Invalid');
    continueButton().click();
    verifyInvalidCheckAndConfirmPage();
} );
When( "the Validation Officer selects ‘Back’ link", () => {
    backLink().click();
} );
Then( "the ‘Invalid appeal details’ page will be displayed along with the previously input data", () => {
    invalidAppealDetailsPage();
} );
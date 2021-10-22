import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appellantName,
    reviewAppealSubmissionPage,
    selectOutcomeValid
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {backLink, continueButton, linkChangeOutcome} from "../../../support/PageObjects/common-po";
import {
    checkAndConfirmPageValid,
    descriptionOfDevelopmentPage,
    enterDescriptionOfDevelopmentTxt,
} from "../../../support/PageObjects/vo-validappeal-description-of-development-po";
import {
    btnConfirmAndStartAppeal, verifyDescriptionOfDevelopmentText, outcomeOfReview,
    pageHeader,
    warningTextCheckConfirmValid, pageTitleValidCheckConfirm
} from "../../../support/PageObjects/vo-valid-check-confirm-page-po";
import {
    invalidAppealDetailsPage,
    otherListReasons,
    reasonsLPADeemedApplicationsCheck,
    reasonsNoRightOfAppealCheck,
    reasonsNotAppealableCheck,
    reasonsOther,
    reasonsOutOfTimeCheck, selectOutcomeInvalid
} from "../../../support/PageObjects/vo-invalid-appeal-details-po";
import {
    btnConfirmAndTurnAwayAppeal,
    invalidOutcomeOfReview,
    invalidPageHeaderCheckConfirm, invalidReasonsText,
    invalidReasonsTextNoRightOfAppeal,
    invalidReasonsTextNotAppealable,
    invalidReasonsTextNotAppealableLPADeemedApplication,
    invalidReasonsTextOutOfTime,
    verifyInvalidCheckAndConfirmPage,
    visitInvalidCheckConfirmPage, warningTextCheckConfirmInValid
} from "../../../support/PageObjects/vo-invalid-check-confirm-po";

function goToReviewAppealSubmissionPage () {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
}

const goToOutcomeValidPage = () => {
    goToReviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
};

Given( 'the Validation Officer has provided a Description of development on the Valid appeal details Page', () => {
    goToOutcomeValidPage();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt().type('This is a test description for Valid Outcome');
} );
When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then( "the Check and confirm Page will be displayed showing the outcome as 'Valid'", () => {
    pageTitleValidCheckConfirm();
    cy.checkPageA11y();
    checkAndConfirmPageValid();
    pageHeader();
    outcomeOfReview();
    appellantName();
    appealReference();
    appealSite();
    verifyDescriptionOfDevelopmentText();
    warningTextCheckConfirmValid();
    btnConfirmAndStartAppeal();
    linkChangeOutcome();
} );

Given( 'the Validation Officer is on the Check and confirm page', () => {
    goToOutcomeValidPage();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt().type('This is a test description for Valid Outcome');
    continueButton().click();
    checkAndConfirmPageValid();
} );
When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );
Then( 'the Valid appeal details Page will be displayed with the description of development details', () => {
    descriptionOfDevelopmentPage();
} );

Given( 'the Validation Officer is on the ’Valid appeal details’ page', () => {
    goToOutcomeValidPage();
} );
When( "the Validation Officer clicks on ‘Change outcome’ link", () => {
    linkChangeOutcome().click();
} );
Then( "the ‘Review appeal submission’ Page will be displayed", () => {
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
} );

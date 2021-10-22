import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appellantName, receivedOn,
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
    pageHeader, pageTitleCheckConfirm,
    warningTextCheckConfirmValid, pageTitleValidCheckConfirm
} from "../../../support/PageObjects/vo-valid-check-confirm-page-po";

Given( 'the Validation Officer has provided a Description of development on the Valid appeal details Page', () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
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
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
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

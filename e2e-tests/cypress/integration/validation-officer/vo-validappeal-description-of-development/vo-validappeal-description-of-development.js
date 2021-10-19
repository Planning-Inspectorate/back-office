import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {backLink} from "../../../support/PageObjects/common-po";
import {visitReviewAppealSubmissionPage} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
const {descriptionOfDevelopmentPage,errorMessageDesDevelopment,enterDescriptionOfDevelopmentTxt,checkAndConfirmPageValid} = require( "../../../support/PageObjects/vo-validappeal-description-of-development-po" );
const {caseOfficerLandingPage, appealReference} = require( "../../../support/PageObjects/vo-landing-page-po" );
const {reviewAppealSubmissionPage,selectOutcomeValid} = require( "../../../support/PageObjects/vo-review-appeal-submission-page-po" );
const {continueButton} = require( "../../../support/PageObjects/common-po" );

Given( "Validation Officer has selected outcome as valid on the ‘Review appeal submission’ page", () => {
    caseOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
    selectOutcomeValid().click();
} );

When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
    } );

Then( 'the Valid appeal details Page will be displayed with the appeal reference', () => {
    descriptionOfDevelopmentPage();
} );

Given( 'the Validation Officer has not provided a Description of development on the Valid appeal details Page', () => {
    caseOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    descriptionOfDevelopmentPage()
    cy.checkPageA11y();
    continueButton().click();
    } );

Then( 'error message Enter a description of development will be displayed', () => {
    errorMessageDesDevelopment();
} );

Given( "Validation Officer is on the Valid appeal details page", () => {
    caseOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
    descriptionOfDevelopmentPage();
} );

When( "the Validation Officer selects the ‘Back’ link for kk", () => {
    backLink().click();
} );

Then( "the Review appeal submission Page will be displayed showing the previously selected outcome", () => {
    visitReviewAppealSubmissionPage();
    selectOutcomeValid();
} );

Given( 'the Validation Officer has provided a Description of development on the Valid appeal details Page', () => {
    caseOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt();
} );

Then( 'Check and confirm page is displayed', () => {
    checkAndConfirmPageValid();
} );
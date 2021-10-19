import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {appealReference, caseOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appealStatement,
    appellantName,
    decisionLetter,
    errorMessage,
    errorMessageHeader,
    headerReviewSubmission,
    localPlanningDept,
    planningAppForm,
    planningAppReference,
    receivedOn,
    reviewAppealSubmissionPage,
    supportingDocs,
    titleReviewSubmission,
    selectOutcomeValid,
    visitReviewAppealSubmissionPage,
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {descriptionOfDevelopmentPage} from "../../../support/PageObjects/vo-validappeal-description-of-development-po"
import {backLink, continueButton} from "../../../support/PageObjects/common-po";


Given( "Validation Officer is on the ‘Appeal submissions for review’ page", () => {
    caseOfficerLandingPage();
} );

When( "the Validation Officer selects an appeal", () => {
    appealReference().click();
} );

Then( "the ‘Review appeal submission’ Page will be displayed", () => {
   reviewAppealSubmissionPage();
    cy.checkPageA11y();
} );

Given( "Validation Officer has not chosen an outcome on the ‘Review appeal submission’ page", () => {
    reviewAppealSubmissionPage();
} );

When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );

Then( "error message 'Select if the appeal is valid or invalid, or if something is missing or wrong' is displayed", () => {
    errorMessageHeader();
    errorMessage();
} );

Given( "Validation Officer is on the ‘Review appeal submission’ page", () => {
   visitReviewAppealSubmissionPage();
} );

When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );

Then( "the ‘Appeal submissions for review’ page will be displayed", () =>{
    caseOfficerLandingPage();
} );

When( 'the Validation Officer selects the appeal {string}', () => {
    appealReference().click();
} );

Then( "the ‘Review appeal submission’ Page will be displayed with the Appellant details", () =>{
    headerReviewSubmission().should('contain.text', "Review appeal submission");
    titleReviewSubmission();
    cy.checkPageA11y();
    appellantName();
    appealReference();
    receivedOn();
    appealSite();
    localPlanningDept();
    planningAppReference();
    planningAppForm();
    decisionLetter();
    appealStatement();
    supportingDocs();
} );

Given( "Validation Officer has selected outcome as valid on the ‘Review appeal submission’ page", () => {
    caseOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
    selectOutcomeValid().click();
} );

Then( 'Description of Development page is displayed', () => {
    descriptionOfDevelopmentPage();
} );
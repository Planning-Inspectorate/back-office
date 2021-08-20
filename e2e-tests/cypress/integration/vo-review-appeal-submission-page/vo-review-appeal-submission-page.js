import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {appealReference, caseOfficerLandingPage} from "../../support/PageObjects/vo-landing-page-po";
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
    titleReviewSubmission
} from "../../support/PageObjects/vo-review-appeal-submission-page-po";
import {backLink, continueButton} from "../../support/PageObjects/common-po";


Given( "a Validation Officer is on the ‘Appeal submissions for review’ page", function () {
    caseOfficerLandingPage();
} );

When( "the Validation Officer selects an appeal", function () {
    appealReference().click();
} );

Then( "the ‘Review appeal submission’ Page will be displayed", function () {
   reviewAppealSubmissionPage().contains('Review appeal submission').should('be.visible');
    cy.checkPageA11y();
} );


Given( "a Validation Officer has not chosen an outcome on the ‘Review appeal submission’ page", function () {
    reviewAppealSubmissionPage();
} );

When( "the Validation Officer selects ‘Continue’", function () {
    continueButton().click();
} );

Then( "error message 'Select if the appeal is valid or invalid, or if something is missing or wrong' is displayed", function () {
    errorMessageHeader();
    errorMessage();
} );

Given( "a Validation Officer is on the ‘Review appeal submission’ page", function () {
    reviewAppealSubmissionPage();
} );
When( "the Validation Officer selects the ‘Back’ link", function () {
    backLink().click();
} );
Then( "the ‘Appeal submissions for review’ page will be displayed", function () {
    caseOfficerLandingPage();
} );

When( 'the Validation Officer selects the appeal {string}', function () {
    appealReference().click();
} );
Then( "the ‘Review appeal submission’ Page will be displayed with the Appellant details", function () {
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

import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {
    checkAndConfirmPageValid,
    descriptionOfDevelopmentPage,
    enterDescriptionOfDevelopmentTxt
} from "../../../support/PageObjects/vo-validappeal-description-of-development-po";
import {continueButton, linkReturnToTaskList, textWhatNext} from "../../../support/PageObjects/common-po";
import {
    reviewAppealSubmissionPage,
    selectOutcomeValid
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {appealReference, validationOfficerLandingPage} from "../../../support/PageObjects/vo-landing-page-po";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {
    textAppealStart,
    verifyAppealReference,
    verifyAppealValid
} from "../../../support/PageObjects/vo-review-complete-po";
import {selectAppealIdForValidationOfficerFromDb} from "../../../support/db-queries/select-appeal-id-for-validation-officer-from-db";


const url = '/review-complete';
const pageTitle = 'Review complete - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Review complete';

const confirmValidOutcome = () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeValid().click();
    continueButton().click();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt().type('This is a test description for Valid Outcome');
    continueButton().click();
    checkAndConfirmPageValid();
}
const reviewCompletePage = () => {
    cy.url().should('contain',url);
}

Given( "the Validation Officer is on the Check and confirm page and has deemed the appeal Valid", () => {
    //confirmValidOutcome();
    validationOfficerLandingPage();
    selectAppealIdForValidationOfficerFromDb();
    cy.get( '@appealReferenceVO' ).then( appealReferenceVO => {
        appealReference( appealReferenceVO[16] ).should( 'exist' ).click();
        reviewAppealSubmissionPage();
        cy.checkPageA11y();
        selectOutcomeValid().click();
        continueButton().click();
        descriptionOfDevelopmentPage();
        //enterDescriptionOfDevelopmentTxt().type('This is a test description for Valid Outcome');
        let appealRefID = appealReferenceVO[16];
    });
    let descriptionDevText = 'This is test data for description of development';
    enterDescriptionOfDevelopmentTxt().type(descriptionDevText);
    continueButton().click();
    checkAndConfirmPageValid();
} );
When( "the Validation Officer selects 'Confirm and start appeal'", () => {
    continueButton().click();
} );
Then( "the Review completePage will be displayed showing the validation outcome as 'Appeal valid' with appeal reference", () => {
    reviewCompletePage();
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
    selectAppealIdForValidationOfficerFromDb();
    cy.get( '@appealReferenceVO' ).then( appealReferenceVO => {
        appealReference( appealReferenceVO[16] ).should( 'exist' );
    });
    verifyAppealValid();
    textAppealStart();
    textWhatNext().should('exist');
    linkReturnToTaskList().should('exist');
} );

Given('a Validation Officer is on the Review complete page', () => {
    validationOfficerLandingPage();
    selectAppealIdForValidationOfficerFromDb();
    cy.get( '@appealReferenceVO' ).then( appealReferenceVO => {
        appealReference( appealReferenceVO[16] ).should( 'exist' ).click();
               //let appealRefID = appealReferenceVO[16];
    });
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
    selectOutcomeValid().click();
    continueButton().click();
    descriptionOfDevelopmentPage();
    let descriptionDevText = 'This is test data for description of development';
    enterDescriptionOfDevelopmentTxt().type(descriptionDevText);
    continueButton().click();
    checkAndConfirmPageValid();
    continueButton().click();
    reviewCompletePage();
} );
When( 'the Validation Officer selects the Return to task list link', () => {
    linkReturnToTaskList().click();
} );
Then( "the 'Appeal submissions for review' Page will be displayed", () => {
    validationOfficerLandingPage();
} );
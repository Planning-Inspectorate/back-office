import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {btnConfirmAndStartAppeal} from "../../../support/PageObjects/vo-valid-check-confirm-page-po";
import {
    textAppealStart, textAppealTurnedAway, verifyAppealInValid, verifyAppealMissingWrong,
    verifyAppealValid, visitReviewCompleteInValid, visitReviewCompleteMissingWrong,
    visitReviewCompleteValid
} from "../../../support/PageObjects/vo-review-complete-po";
import {confirmFinishReviewButton} from "../../../support/PageObjects/common-po";
import {checkboxCompletedTasks} from "../../../support/PageObjects/vo-missing-or-wrong-check-confirm-page-po";
const {reviewAppealSubmissionPage, selectOutcomeValid, selectOutcomeMissingOrWrong} = require( '../../../support/PageObjects/vo-review-appeal-submission-page-po' );
const {validationOfficerLandingPage, appealReference} = require( "../../../support/PageObjects/vo-landing-page-po" );
const {continueButton, confirmTurnAwayButton} = require( "../../../support/PageObjects/common-po" );
const {selectOutcomeInvalid, invalidAppealDetailsPage, reasonsOutOfTimeCheck} = require( "../../../support/PageObjects/vo-invalid-appeal-details-po" );
const {descriptionOfDevelopmentPage, enterDescriptionOfDevelopmentTxt} = require( "../../../support/PageObjects/vo-validappeal-description-of-development-po" );
const {visitMissingOrWrongPage, checkNamesDoNotMatch} = require( "../../../support/PageObjects/vo-missing-or-wrong-page-po" );
const {visitInvalidCheckConfirmPage} = require( "../../../support/PageObjects/vo-invalid-check-confirm-po" );
const {visitMissingOrWrongCheckConfirmPage} = require( "../../../support/PageObjects/vo-missing-wrong-check-confirm-page-po" );
const {visitCheckConfirmPageValid} = require( "../../../support/PageObjects/vo-valid-check-confirm-page-po" );


Given( 'the user is on the Review appeal submission page', () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
} );

When( 'the user selects the outcome as {string} and click on Continue button', (outcome) => {
    if (outcome === 'valid') {
            selectOutcomeValid().click();
            continueButton().click();
        }
    else if (outcome === 'invalid') {
            selectOutcomeInvalid().click();
            continueButton().click();
        }
    else if (outcome === 'something is missing or wrong') {
            selectOutcomeMissingOrWrong().click();
            continueButton().click();
        };
    } );

Then( 'the {string} is displayed', (nextpage) => {
    if (nextpage === 'valid appeal details') {
         descriptionOfDevelopmentPage();
        }
    else if (nextpage === 'invalid appeal details') {
         invalidAppealDetailsPage();
        }
    else if (nextpage === 'what is missing or wrong') {
         visitMissingOrWrongPage();
        }
} );

When( 'the user selects or enters {string} and click on Continue button', (outcomeReason) => {
    if (outcomeReason === 'description of development') {
        enterDescriptionOfDevelopmentTxt().type( 'This is a test description for Valid Outcome' );
        }
    else if (outcomeReason === 'out of time') {
        reasonsOutOfTimeCheck().check();
        }
    else if (outcomeReason === 'names do not match') {
        checkNamesDoNotMatch().check();
        };
} );

Then( 'the Check and confirm page for {string} is displayed', (outcome) => {
   switch (outcome) {
       case 'valid':
             visitCheckConfirmPageValid();
             break;
       case 'invalid':
             visitInvalidCheckConfirmPage();
             break;
       case 'something is missing or wrong':
             visitMissingOrWrongCheckConfirmPage();
             break;
   }
} );

When( 'the user clicks on the {string}', (confirmButton) => {
    switch (confirmButton) {
        case 'confirm and start appeal':
            btnConfirmAndStartAppeal().click();
        break;
        case 'confirm and turn away appeal':
            confirmTurnAwayButton().click();
        break;
        case 'confirm and finish review':
            checkboxCompletedTasks().check();
            confirmFinishReviewButton().click();
        break;
    }
} );


Then( 'the review is complete with the appeal status as {string}', (outcome) => {
    switch (outcome) {
        case 'valid':
            visitReviewCompleteValid();
            verifyAppealValid().should('exist');
            textAppealStart().should('exist');
            break;
        case 'invalid':
            visitReviewCompleteInValid();
            verifyAppealInValid().should('exist');
            textAppealTurnedAway().should('exist');
            break;
        case 'something is missing or wrong':
            visitReviewCompleteMissingWrong();
            verifyAppealMissingWrong().should('exist');
            break;
    }
} );


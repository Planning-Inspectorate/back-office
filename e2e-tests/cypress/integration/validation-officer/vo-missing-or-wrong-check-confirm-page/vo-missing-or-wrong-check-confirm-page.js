import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appellantName,
    receivedOn,
    reviewAppealSubmissionPage,
    selectOutcomeInvalid,
    selectOutcomeMissingOrWrong,
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

function goToReviewAppealSubmissionPage () {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
}

const goToOutcomeMissingOrWrongPage = () => {
    goToReviewAppealSubmissionPage();
    selectOutcomeMissingOrWrong().click();
    continueButton().click();
};

Given( 'the Validation Officer is on the ’Missing or Wrong’ page', () => {
    goToOutcomeMissingOrWrongPage();
} );
When( "the Validation Officer clicks on ‘Change outcome’ link", () => {
    linkChangeOutcome().click();
} );
Then( "the ‘Review appeal submission’ Page will be displayed", () => {
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
} );

import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    reviewAppealSubmissionPage,
    selectOutcomeMissingOrWrong
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {backLink, continueButton} from "../../../support/PageObjects/common-po";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {
    btnConfirmFinishReview,
    textOtherReason,
    verifyAppealReference, verifyAppealSite,
    verifyAppellantName, verifyCheckBoxTasksEmails,
    verifyOutcomeOfReview, visitMissingOrWrongCheckConfirmPage
} from "../../../support/PageObjects/vo-missing-wrong-check-confirm-page-po";
import {
    checkNamesDoNotMatch,
    checkOtherMissingOrWrong,
    textboxOtherMissingOrWrong, visitMissingOrWrongPage
} from "../../../support/PageObjects/vo-missing-or-wrong-page-po";
import {checkMissingOrWrongDocuments, checkApplicationForm} from "../../../support/PageObjects/vo-missing-or-wrong-check-confirm-page-po"
import {validateErrorMessages} from "../../../support/common/validate-error-messages";

const url = '/check-and-confirm';
const pageTitle = 'Check and confirm - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Check and confirm';
const textReasons = 'Test Data for Other List Reasons in Something missing or wrong page';
const outcomeReviewValue = 'Something is missing or wrong';
const appellantNameValue = 'Manish Sharma';
const appealReferenceValue = 'APP/Q9999/D/21/1234567';
const appealSiteValue = 'XM26 7YS';
const appealReasonsValue = textReasons;


const gotoSomethingMissingWrongPage = () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeMissingOrWrong().click();
    continueButton().click();
}

const gotoSomethingMissingCheckConfirmPage = () => {
    gotoSomethingMissingWrongPage();
    continueButton().click();
    visitMissingOrWrongCheckConfirmPage();
}

Given ("the Validation Officer has provided what is missing or wrong on the 'What is missing or wrong?’ page", () => {
    gotoSomethingMissingWrongPage();
    checkNamesDoNotMatch().check();
    checkMissingOrWrongDocuments().check();
    checkApplicationForm().check();
    checkOtherMissingOrWrong().check();
    textboxOtherMissingOrWrong().type(textReasons);
});
When( "the Validation Officer selects 'Continue'", () => {
    continueButton().click();
} );
Then( "the {string} page will be displayed showing the Outcome and Reasons", () => {
    cy.url().should('contain',url);
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
    verifyOutcomeOfReview().siblings().should('contain', outcomeReviewValue);
    verifyAppellantName().siblings().should('contain', appellantNameValue);
    verifyAppealReference().siblings().should('contain', appealReferenceValue);
    verifyAppealSite().siblings().should('contain', appealSiteValue);
    textOtherReason().siblings().should('contain',appealReasonsValue);
    verifyCheckBoxTasksEmails().should('exist');
    btnConfirmFinishReview().should('exist');
} );


When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );

Given( "the Validation Officer has not selected the checkbox on the {string} page", () => {
    gotoSomethingMissingCheckConfirmPage();
    continueButton().click();
} );
Then( 'error message {string} will be displayed', (errorMessage) => {
    validateErrorMessages(errorMessage);
} );

Given( "the Validation Officer is on the 'Check and confirm' page with the outcome being 'Something missing or wrong'", () => {
    gotoSomethingMissingWrongPage();
    checkNamesDoNotMatch().click();
    continueButton().click();
} );
Then( "the 'What is missing or wrong?' page will be displayed", () => {
    visitMissingOrWrongPage();
} );
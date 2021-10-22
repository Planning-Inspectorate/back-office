import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {reviewAppealSubmissionPage, selectOutcomeMissingOrWrong
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {backLink, continueButton, linkChangeOutcome} from "../../../support/PageObjects/common-po";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {voVerifyAppealId} from "../../../support/validation-officer/vo-verify-appeal-id";
import {
    checkApplicationForm, checkDecisionNotice, checkGroundsOfAppeal, checkInflammatoryCommentsMade,
    checkMissingOrWrongDocuments,
    checkNamesDoNotMatch, checkOpenedInError,
    checkOtherMissingOrWrong,
    checkSensitiveInformationIncluded, checkSupportingDocuments, checkWrongAppealTypeUsed,
    textboxOtherMissingOrWrong, visitCheckConfirmPageMissingWrong
} from "../../../support/PageObjects/vo-missing-or-wrong-check-confirm-page-po";
import {validateErrorMessages} from "../../../support/common/validate-error-messages";

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

const url = '/missing-or-wrong';
const pageTitle = 'What is missing or wrong? - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'What is missing or wrong?';

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

Given( "the Validation Officer selects that ‘something is missing or wrong’ on the ‘Review appeal submission’ page", () => {
    goToReviewAppealSubmissionPage();
    selectOutcomeMissingOrWrong().click();
} );
When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then( "the ‘What is missing or wrong’ Page will be displayed showing the appeal reference {string}", (appealId) => {
    cy.url().should('contain',url);
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
    voVerifyAppealId(appealId);
} );

Given( "the Validation Officer has not selected a reason on the ‘What is missing or wrong’ Page", () => {
    goToOutcomeMissingOrWrongPage();
} );
Then( 'error message {string} will be displayed', (errorMessage) => {
validateErrorMessages(errorMessage);
} );

Given( "the Validation Officer has selected that a document is missing or wrong but, has not selected a document from the list on the ‘What is missing or wrong’ Page", () => {
    goToOutcomeMissingOrWrongPage();
    checkMissingOrWrongDocuments().check();
} );

Given( "the Validation Officer selects ‘Other’ as the missing or wrong reason but, has not provided any text on the ‘What is missing or wrong’ page",() => {
    goToOutcomeMissingOrWrongPage();
    checkOtherMissingOrWrong().check();
} );

Given( 'the Validation officer does not select any missing documents and no information is provided for other reasons', () => {
    goToOutcomeMissingOrWrongPage();
    checkMissingOrWrongDocuments().check();
    checkOtherMissingOrWrong().check();
} );
When( "the Validation Officer selects ‘Other’ as the reason", () => {
    checkOtherMissingOrWrong().check();
} );
Then( "a text box will be displayed below the ‘Other’ option and Validation officer enters data", () => {
    checkOtherMissingOrWrong().should('exist');
    textboxOtherMissingOrWrong().type('Test Data for Other List Reasons in Something missing or wrong page');
} );

When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );
When( "the Validation Officer selects all the available options and click on 'Continue' button", () => {
    goToOutcomeMissingOrWrongPage();
    checkNamesDoNotMatch().check();
    checkSensitiveInformationIncluded().check();
    checkMissingOrWrongDocuments().check();
    checkApplicationForm().check();
    checkDecisionNotice().check();
    checkGroundsOfAppeal().check();
    checkSupportingDocuments().check();
    checkInflammatoryCommentsMade().check();
    checkOpenedInError().check();
    checkWrongAppealTypeUsed().check();
    checkOtherMissingOrWrong().check();
    textboxOtherMissingOrWrong().type('Test Data for Other List Reasons in Something missing or wrong page');

} );
Then( "Check and confirm page for something missing or wrong is displayed", () => {
    visitCheckConfirmPageMissingWrong();
} );

import {Given, Then, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealReference,
    validationOfficerLandingPage,
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appellantName,
    reviewAppealSubmissionPage, selectOutcomeMissingOrWrong,
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
    invalidAppealDetailsPage, invalidPageHeader,
    otherListReasons, reasonsAppealInvalid, reasonsLPADeemedApplications,
    reasonsLPADeemedApplicationsCheck, reasonsNoRightOfAppeal,
    reasonsNoRightOfAppealCheck, reasonsNotAppealable,
    reasonsNotAppealableCheck,
    reasonsOther, reasonsOutOfTime,
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
import {
    checkNamesDoNotMatch, checkOtherMissingOrWrong, textboxOtherMissingOrWrong
} from "../../../support/PageObjects/vo-missing-or-wrong-page-po";
import { verifyPageTitle } from "../../../support/common/verify-page-title";
import { verifyPageHeading } from "../../../support/common/verify-page-heading";
import {
    btnConfirmFinishReview,
    textOtherReason,
    verifyAppealReference, verifyAppealSite,
    verifyAppellantName, verifyCheckBoxTasksEmails,
    verifyOutcomeOfReview,
} from "../../../support/PageObjects/vo-missing-wrong-check-confirm-page-po";
import {
    checkApplicationForm,
    checkMissingOrWrongDocuments
} from "../../../support/PageObjects/vo-missing-or-wrong-check-confirm-page-po";

const url = '/check-and-confirm';
const pageTitle = 'Check and confirm - Appeal a householder planning decision - GOV.UK';
const pageHeading = 'Check and confirm';
const textReasons = 'Test Data for Other List Reasons in Something missing or wrong page';
const outcomeReviewValue = 'Something is missing or wrong';
const appellantNameValue = 'Manish Sharma';
const appealReferenceValue = 'APP/Q9999/D/21/1234567';
const appealSiteValue = 'XM26 7YS';
const appealReasonsValue = textReasons;

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

const goToOutcomeInvalidPage = () => {
    goToReviewAppealSubmissionPage();
    selectOutcomeInvalid().click();
    continueButton().click();
};

const gotoSomethingMissingWrongPage = () => {
    validationOfficerLandingPage();
    appealReference().click();
    reviewAppealSubmissionPage();
    selectOutcomeMissingOrWrong().click();
    continueButton().click();
}

const goToOutcomeMissingOrWrongPage = () => {
    selectOutcomeMissingOrWrong().click();
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
Then( '‘Description of development’ field should have the related description', () => {
    goToOutcomeValidPage();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt().should('have.value', 'This is a test description for Valid Outcome')
} );

Given( 'the Validation Officer goes to the ’Valid appeal details’ page', () => {
    goToOutcomeValidPage();
} );
When( "the Validation Officer clicks on ‘Change outcome’ link", () => {
    linkChangeOutcome().click();
} );
Then( "the ‘Review appeal submission’ Page will be displayed", () => {
    reviewAppealSubmissionPage();
    cy.checkPageA11y();
} );


Given("the Validation Officer has provided the invalid reasons on the ‘Invalid appeal details’ page", () => {
    goToOutcomeInvalidPage();
    invalidAppealDetailsPage();
    // *** This identified critical issue AS-3610 bug has been raised ***
    //cy.checkPageA11y();
    reasonsOutOfTimeCheck().check();
    reasonsNoRightOfAppealCheck().check();
    reasonsNotAppealableCheck().check();
    reasonsLPADeemedApplicationsCheck().check();
    reasonsOther().check();
    otherListReasons().type('This is a Test data for other List Reasons why the Appeal is Invalid');
});
Then("the ‘Check and confirm’ Page will be displayed showing the the outcome as Invalid", () => {
    visitInvalidCheckConfirmPage();
    verifyInvalidCheckAndConfirmPage();
    invalidPageHeaderCheckConfirm();
    invalidOutcomeOfReview();
    appellantName();
    appealReference();
    appealSite();
    invalidReasonsTextOutOfTime();
    invalidReasonsTextNoRightOfAppeal();
    invalidReasonsTextNotAppealable();
    invalidReasonsTextNotAppealableLPADeemedApplication();
    invalidReasonsText();
    warningTextCheckConfirmInValid();
    btnConfirmAndTurnAwayAppeal();
    linkChangeOutcome();
});

Then( 'The Valid appeal details Page should have an empty ’description of development’ field', () => {
    goToOutcomeValidPage();
    descriptionOfDevelopmentPage();
    enterDescriptionOfDevelopmentTxt().should('be.empty')
} );

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

When( 'the Validation Officer goes to the ’Missing or Wrong’ page', () => {
    goToOutcomeMissingOrWrongPage();
} );
Then( "the ‘Missing or Wrong’ Page will be displayed as populated", () => {
    checkNamesDoNotMatch().should('be.checked');
    checkMissingOrWrongDocuments().should('be.checked');
    checkApplicationForm().should('be.checked');
    checkOtherMissingOrWrong().should('be.checked');
    textboxOtherMissingOrWrong().should('have.value', textReasons);
} );
Then( "the ‘Missing or Wrong’ Page will be displayed as empty", () => {
    checkNamesDoNotMatch().should('not.be.checked');
    checkMissingOrWrongDocuments().should('not.be.checked');
    checkApplicationForm().should('not.be.checked');
    checkOtherMissingOrWrong().should('not.be.checked');
    textboxOtherMissingOrWrong().should('have.value', '');
} );

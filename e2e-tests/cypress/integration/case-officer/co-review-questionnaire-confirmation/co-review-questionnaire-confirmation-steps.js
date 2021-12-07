import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"
import {
    gotoReviewQuestionnaireConfirmationPage,
    questionnaireForReviewLink,
    verifyPageHeading,
    reviewQuestionnaireListPage, getOutcomeConfirmationPageText
} from "../../../support/PageObjects/co-review-questionnaire-confirmation-po";
import { verifyPageTitle } from "../../../support/common/verify-page-title";
import { verifyPageUrl } from "../../../support/common/verify-page-url";
import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {getAppealsLink, getContinueButton} from "../../../support/PageObjects/co-review-questionnaire-po";
import {verifySectionName} from "../../../support/case-officer/verify-Section-Name";
import {getConfirmContinueButton} from "../../../support/PageObjects/co-check-and-confirm-po";
import {reviewSectionMissingInformationCheckbox} from "../../../support/case-officer/review-section-missing-information-check-box";
import {reviewSectionMissingInformation} from "../../../support/case-officer/review-section-missing-information";

const page = {
    heading: 'Outcome confirmed',
    title: 'Review complete - Appeal a householder planning decision - GOV.UK',
    url: 'review-questionnaire-complete',
};

Given('Case officer is on Check and confirm page for {string} status', (status) => {
    goToCaseOfficerPage();
    selectCaseReferenceFromDb('Received');
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference[23]).click();
    });
    if(status==='Complete'){
        getContinueButton().click();
        verifySectionName('Check and confirm');
    }else{
        reviewSectionMissingInformationCheckbox('Plans used to reach decision');
        reviewSectionMissingInformation('Plans used to reach decision are incomplete','Plans used to reach decision');
        getContinueButton().click();
        verifySectionName('Check and confirm');
    }
});

Given('Case officer is navigated to confirm outcome page',()=>{
    goToCaseOfficerPage();
    selectCaseReferenceFromDb('Received');
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference[23]).click();
    });
    getContinueButton().click();
    verifySectionName('Check and confirm');
    getConfirmContinueButton().click();
    cy.get('h1').should('contain','Outcome confirmed');
});

When('Case Officer clicks on Confirm outcome',()=>{
    getConfirmContinueButton().click();
    cy.get('h1').should('contain','Outcome confirmed');
});

Then('Case officer is navigated to confirm outcome page for {string} status',(status)=>{
    cy.get('h1').should('contain','Outcome confirmed');
    getOutcomeConfirmationPageText().should('contain', 'Questionnaire').should('contain',status);
    selectCaseReferenceFromDb('Received');
    cy.get('@caseReference').then((caseReference)=>{
        getOutcomeConfirmationPageText().should('contain',caseReference[23]);
    });
})

Then('the Case Officer is presented with the confirmation page', () => {
    verifyPageUrl(page.url);
    verifyPageTitle(page.title);
    verifyPageHeading(page.heading);
});

Then('the Confirmation page should have link to Questionnaire review page', () => {
    questionnaireForReviewLink()
        .should('have.attr', 'href', '/questionnaires-list');
    cy.checkPageA11y();
});

When('the Case Officer clicks Return to Questionnaire review link', () => {
    questionnaireForReviewLink().click();
});

Then('the Case Officer should be taken to review questionnaire list page', () => {
    reviewQuestionnaireListPage();
});
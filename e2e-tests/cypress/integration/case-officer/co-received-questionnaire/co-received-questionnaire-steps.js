import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {
    getAppealsLink,
    getContinueButton, getQuestionnaireForReviewBack
} from "../../../support/PageObjects/co-review-questionnaire-po";
import {reviewSectionDocumentList} from "../../../support/case-officer/review-section-documentList";
import {reviewSectionMissingInformationCheckbox} from "../../../support/case-officer/review-section-missing-information-check-box";
import {reviewSectionMissingInformation} from "../../../support/case-officer/review-section-missing-information";
import {reviewSectionMissingInformationError} from "../../../support/case-officer/review-section-missing-information-error";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {selectAppealIdForCaseOfficerFromDb} from "../../../support/db-queries/select-appeal-id-for-case-officer-from-db";
const url = '/review-questionnaire-submission/';
const pageHeading = 'Review questionnaire';
const title = 'Review questionnaire - Appeal a householder planning decision - GOV.UK';

Given('a Case officer is on the Questionnaires for review page',()=>{
    goToCaseOfficerPage();
    verifyPageHeading('Questionnaires for review');
});
Given('appeal status is {string}',(status)=>{
    cy.contains('td',status);
});
Given('Case officer has navigated to {string} page',(page)=>{
    verifyPageTitle(title);
    verifyPageHeading(pageHeading);
});
Given('Case officer has selected the checkbox for missing information for {string}',(document_section)=>{
    reviewSectionMissingInformationCheckbox(document_section);
});
Given('a Case officer is on the Review questionnaire page for {string} status',(status)=>{
    goToCaseOfficerPage();
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference).click();
    });
    verifyPageTitle(title);
    verifyPageHeading(pageHeading);
    cy.url().should('contain',url);
});
When('Case officer selects the appeal to view for {string} status',(status)=>{
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference).click();
    });

});
When('the Case officer selects a {string} link in the {string}',(documentName, reviewSection)=>{
    reviewSectionDocumentList(documentName,reviewSection);
});
When(`the Case officer selects the missing or incorrect checkbox for a {string}`,(document_section)=>{
    reviewSectionMissingInformationCheckbox(document_section);
});
When('Case officer does not provide the relevant missing information for {string}',(document_section)=>{
    reviewSectionMissingInformation('',document_section);
    getContinueButton().click();
});
When('Case officer selects questionnaire for review from breadcrumbs',()=>{
    getQuestionnaireForReviewBack().click();
});
Then('the Review Questionnaire page will be displayed',()=>{
    selectAppealIdForCaseOfficerFromDb();
    cy.get('@receivedStatusAppealId').then((appealId)=>{
        cy.url().should('contain',appealId);
    })
    cy.url().should('contain','/review-questionnaire-submission/');
    verifyPageTitle(title);
    verifyPageHeading(pageHeading);
});
Then('the document {string} will be downloaded for the {string}',(documentName, reviewSection)=>{
    reviewSectionDocumentList(documentName,reviewSection);
});
Then(`the Case officer is able to enter {string} information for {string}`,(missing_information, document_section)=>{
    reviewSectionMissingInformation(missing_information,document_section);
});
Then('an error {string} is displayed for {string}',(error_message, document_section)=>{
    reviewSectionMissingInformationError(error_message,document_section);
});
Then('the Case officer is able to submit the review',()=>{
    getContinueButton().click();
});

Then('Case officer navigates to Questionnaires for review page',()=>{
    verifyPageHeading('Questionnaires for review');
})
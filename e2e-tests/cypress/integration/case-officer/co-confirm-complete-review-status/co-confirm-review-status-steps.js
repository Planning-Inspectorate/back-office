import {Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAppealReference,
    getAppealSite,
    getConfirmContinueButton,
    getGoBackToReviewQuestionnaireLink,
    getLocalPlanningDepartment, getMissingOrIncorrectDocuments,
    getReviewOutcome
} from "../../../support/PageObjects/co-check-and-confirm-po";
import {verifySectionName} from "../../../support/case-officer/verify-Section-Name";
import {getAppealsLink, getContinueButton} from "../../../support/PageObjects/co-review-questionnaire-po";
import {reviewSectionMissingInformationCheckbox} from "../../../support/case-officer/review-section-missing-information-check-box";
import {reviewSectionMissingInformation} from "../../../support/case-officer/review-section-missing-information";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";

Given('a Case officer is on the Review questionnaire page for {string} status',(status)=>{
    goToCaseOfficerPage();
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference).click();
    });
})

When('Case Officer finishes the review as no missing information',()=>{
    getContinueButton().click();
})
When('the questionnaire review is {string}',(questionnaireReviewStatus)=>{
    verifySectionName('Check and confirm');
});

When(`the Case officer enters {string} information for {string}`,(missing_information, document_section)=>{
    reviewSectionMissingInformationCheckbox('Plans used to reach decision');
    reviewSectionMissingInformation(missing_information,document_section);
    getContinueButton().click();
})
Then('the {string} page is displayed showing the questionnaire as {string}',(page,questionnaireReviewStatus)=>{
verifySectionName(page);
getReviewOutcome().siblings().should('contain',questionnaireReviewStatus);
    getAppealReference().should('be.visible');
    getAppealSite().should('be.visible');
    getMissingOrIncorrectDocuments().should('be.visible');
    getLocalPlanningDepartment().should('be.visible');
    getConfirmContinueButton().should('have.class','govuk-button');
    getGoBackToReviewQuestionnaireLink().should('have.attr','href');
});

Then(`Case officer can see the {string} for the {string}`,(missing_information, document_section)=>{
    getMissingOrIncorrectDocuments()
        .siblings('dd')
        .should('contain', missing_information)
        .should('contain',document_section);
})
